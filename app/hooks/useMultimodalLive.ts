import { useState, useRef, useCallback, useEffect } from 'react';
import { base64ToArrayBuffer, arrayBufferToBase64, floatTo16BitPCM, downsampleTo16kHz } from '@/app/lib/audio-utils';

type LiveStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

const MODEL = "models/gemini-2.0-flash-exp";
const HOST = "generativelanguage.googleapis.com";
const WS_URL = `wss://${HOST}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

export function useMultimodalLive(apiKey: string) {
    const [status, setStatus] = useState<LiveStatus>('disconnected');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const websocketRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const [volume, setVolume] = useState(0);

    // Audio Output Queue
    const audioQueueRef = useRef<AudioBuffer[]>([]);
    const isPlayingRef = useRef(false);
    const nextStartTimeRef = useRef(0);

    // Initial Setup Message
    const setupMessage = {
        setup: {
            model: MODEL,
            generationConfig: {
                responseModalities: ["AUDIO"]
            }
        }
    };

    const connect = useCallback(async () => {
        if (!apiKey) {
            console.error("No API Key provided to useMultimodalLive");
            setStatus('error');
            return;
        }

        console.log("Connecting to Gemini Live with Key length:", apiKey.length);
        setStatus('connecting');
        setErrorMessage(null); // Clear any previous error message

        try {
            // 1. Initialize Audio Context
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            // 2. Initialize WebSocket
            const wsUrl = `${WS_URL}?key=${apiKey}`;
            const ws = new WebSocket(wsUrl);
            websocketRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket Connected. Sending Setup Message...");
                setStatus('connected');
                ws.send(JSON.stringify(setupMessage));

                // Start Microphone after connection
                startMicrophone();
            };

            ws.onmessage = async (event) => {
                let data = event.data;
                if (data instanceof Blob) {
                    data = await data.text();
                }

                try {
                    const response = JSON.parse(data);

                    // Handle Audio Response
                    if (response.serverContent?.modelTurn?.parts?.[0]?.inlineData) {
                        const audioData = response.serverContent.modelTurn.parts[0].inlineData.data;
                        queueAudio(audioData);
                    }

                    // Handle Tool Call (if any) - not implemented in basic PoC yet
                } catch (e) {
                    console.error("Error parsing WS message", e);
                }
            };

            ws.onerror = (err) => {
                console.error("WebSocket Error (Check Console for details):", err);
                setStatus('error');
                setErrorMessage("WebSocket connection error.");
            };

            ws.onclose = (event) => {
                console.log(`Disconnected. Code: ${event.code}, Reason: ${event.reason}`);
                setStatus('disconnected');
                setErrorMessage(event.reason || "Connection closed");
                stopMicrophone();
            };

        } catch (err) {
            console.error("Connection Failed:", err);
            setStatus('error');
            setErrorMessage("Failed to establish connection.");
        }
    }, [apiKey]);

    const disconnect = useCallback(() => {
        if (websocketRef.current) {
            websocketRef.current.close();
            websocketRef.current = null;
        }
        stopMicrophone();
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setStatus('disconnected');
    }, []);

    const startMicrophone = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            mediaStreamRef.current = stream;

            if (!audioContextRef.current) return;

            const source = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current = source;

            // Using ScriptProcessor for simplicity in PoC (AudioWorklet is better for Prod)
            const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);

                // Calculate volume for visualizer
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                    sum += inputData[i] * inputData[i];
                }
                const rms = Math.sqrt(sum / inputData.length);
                setVolume(rms);

                // Send Audio to Gemini
                if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
                    // Downsample if needed (though we requested 16k)
                    const pcm16 = floatTo16BitPCM(downsampleTo16kHz(inputData, e.inputBuffer.sampleRate));
                    const base64Audio = arrayBufferToBase64(pcm16);

                    const msg = {
                        realtimeInput: {
                            mediaChunks: [{
                                mimeType: "audio/pcm",
                                data: base64Audio
                            }]
                        }
                    };
                    websocketRef.current.send(JSON.stringify(msg));
                }
            };

            source.connect(processor);
            processor.connect(audioContextRef.current.destination);

        } catch (err) {
            console.error("Mic Error:", err);
        }
    };

    const stopMicrophone = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
    };

    const queueAudio = async (base64Data: string) => {
        if (!audioContextRef.current) return;

        const arrayBuffer = base64ToArrayBuffer(base64Data);

        // Setup raw PCM decoding (Gemini returns 24kHz PCM16 usually)
        // Ideally we used `decodeAudioData` usually works on wav/mp3 headered files.
        // For raw PCM, we manually construct buffer.
        // Gemini 2.0 Flash returns PCM 16-bit 24kHz Little Endian mono.

        const SAMPLE_RATE = 24000;
        const pcm16 = new Int16Array(arrayBuffer);
        const float32 = new Float32Array(pcm16.length);

        for (let i = 0; i < pcm16.length; i++) {
            float32[i] = pcm16[i] / 32768; // Convert Int16 to Float32
        }

        const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, SAMPLE_RATE);
        audioBuffer.getChannelData(0).set(float32);

        audioQueueRef.current.push(audioBuffer);

        if (!isPlayingRef.current) {
            playNextChunk();
        }
    };

    const playNextChunk = () => {
        if (audioQueueRef.current.length === 0) {
            isPlayingRef.current = false;
            return;
        }

        if (!audioContextRef.current) return;

        isPlayingRef.current = true;
        const buffer = audioQueueRef.current.shift()!;
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);

        const currentTime = audioContextRef.current.currentTime;
        const startTime = Math.max(currentTime, nextStartTimeRef.current);

        source.start(startTime);
        nextStartTimeRef.current = startTime + buffer.duration;

        source.onended = () => {
            playNextChunk();
        };
    };

    return {
        connect,
        disconnect,
        status,
        volume,
        errorMessage
    };
}
