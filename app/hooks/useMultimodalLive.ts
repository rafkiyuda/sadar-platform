import React, { useState, useRef, useCallback, useEffect } from 'react';
import { base64ToArrayBuffer, arrayBufferToBase64, floatTo16BitPCM, downsampleTo16kHz } from '@/app/lib/audio-utils';
import { useDriverStore } from '@/app/lib/store/useDriverStore';

type LiveStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

const MODEL = "models/gemini-3.1-flash-live-preview";
const HOST = "generativelanguage.googleapis.com";
const WS_URL = `wss://${HOST}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent`;

export function useMultimodalLive(apiKeyParam: string = "", location: string | null = null) {
    const apiKey = apiKeyParam || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
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

    const {
        aiMood,
        setAiMood,
        alarmSettings,
        setAlarmSettings,
        cameraMode,
        setCameraMode,
        status: driverStatus,
        tripStats,
        currentCoords
    } = useDriverStore();

    // Dynamic Setup Message with System Instruction
    // POC FORCED: UIN Sunan Gunung Djati Bandung (Kampus 1, Cibiru)
    const locationContext = "Universitas Islam Negeri (UIN) Sunan Gunung Djati Bandung (Kampus 1, Cibiru)";
    const coordsContext = currentCoords ? `${currentCoords.lat.toFixed(6)}, ${currentCoords.lng.toFixed(6)}` : "-6.9139, 107.6437";

    const systemInstruction = React.useMemo(() => `You are a helpful driving assistant named SADAR. 

    LIVE TELEMETRY (POC PRESENTATION - UIN BANDUNG):
    - LOKASI UTAMA: ${locationContext}.
    - KOORDINAT GPS: ${coordsContext}.
    - AREA SEKITAR: Jl. A.H. Nasution No. 105, Cipadung, Panyileukan, Kota Bandung. Kawasan ini ramai dengan aktivitas mahasiswa.
    
    STATUS KENDARAAN & PENGEMUDI:
    - STATUS PENGEMUDI: ${driverStatus} (SAFE=Aman, DROWSY=Mengantuk, NO_FACE=Wajah tidak terdeteksi).
    - JARAK TEMPUH: ${tripStats.distance.toFixed(2)} km.
    - TOTAL PERINGATAN KANTUK: ${tripStats.drowsyCount}.
    
    POIs TERDEKAT (HARDCODED FOR POC):
    1. TEMPAT KOPI (Favorit Mahasiswa):
       - Demos Cafe (Jl. Desa Cipadung) - Sangat dekat, Wi-Fi kencang, cocok untuk nugas.
       - Relatif Kopi (Jl. Pandanwangi) - Estetik dan nyaman.
       - Coffee New Cammary (Jl. Manisi) - Harga ekonomis ramah kantong mahasiswa.
       - RC ROASTERY (Jl. Raya Cibiru 631) - Luas, sering ada live music.
    2. TEMPAT SHOLAT:
       - Masjid Ikomah - Berada di dalam Kampus 1 UIN Bandung.
       - Masjid Kifayatul Achyar - Berlokasi tepat di samping barat kampus (Jl. A.H. Nasution).
       - Masjid Al-Baqiyatush Sholihat - Berlokasi tepat di seberang kampus UIN.
    3. TEMPAT ISTIRAHAT & SANTAI:
       - Alun-Alun Ujung Berung - Taman publik terbuka yang nyaman untuk duduk santai.
       - Masjid Raya Al-Jabbar (Gedebage) - Masjid megah dengan taman luas, sangat cocok untuk istirahat tenang.
       - Wisata Batu Kuda - Hutan pinus sejuk di lereng Gunung Manglayang (15-20 menit dari UIN).
       - SPBU Pertamina AH Nasution (Cipadung) - Titik istirahat cepat yang praktis.
       - Shakti Hotel Bandung - Jika butuh istirahat formal atau penginapan berkualitas.

    INSTRUCTIONS:
    1. PRIORITAS UTAMA: Gunakan daftar "POIs TERDEKAT" di atas untuk menjawab pertanyaan tentang rekomendasi tempat sekitar. Sebutkan nama tempat dan detail lokasinya dengan percaya diri seolah-olah Anda benar-benar melihatnya di GPS.
    2. FALLBACK CERDAS: Jika pengguna menanyakan tempat yang TIDAK ADA dalam daftar di atas (contoh: "Gereja terdekat", "Rumah sakit terdekat"), jangan katakan "tidak tahu". Gunakan pengetahuan umum Anda untuk menjawab (misal: menyebutkan Gereja di Jatinangor atau RS terdekat ke area Cibiru).
    3. Jika pengemudi terlihat mengantuk (STATUS: DROWSY), segera sarankan salah satu tempat kopi di atas atau tempat istirahat sejuk seperti Batu Kuda atau Al-Jabbar.
    4. Berikan tanggapan yang singkat, padat, dan fokus pada keselamatan berkendara.
    5. MOOD AI: ${aiMood}.
    6. Jawab dalam Bahasa Indonesia secara default.`, [locationContext, coordsContext, driverStatus, tripStats.distance, tripStats.drowsyCount, tripStats.callDuration, aiMood]);

    const setupMessage = React.useMemo(() => ({
        setup: {
            model: MODEL,
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }
                }
            },
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            tools: [
                {
                    functionDeclarations: [
                        {
                            name: "set_ai_mood",
                            description: "Changes the AI communication style mood.",
                            parameters: {
                                type: "OBJECT",
                                properties: {
                                    mood: {
                                        type: "STRING",
                                        enum: ["friendly", "formal", "alert"],
                                        description: "The new mood for the AI."
                                    }
                                },
                                required: ["mood"]
                            }
                        },
                        {
                            name: "set_alarm",
                            description: "Sets or updates the alarm settings.",
                            parameters: {
                                type: "OBJECT",
                                properties: {
                                    enabled: { type: "BOOLEAN" },
                                    time: { type: "STRING", description: "Format HH:mm" },
                                    condition: { type: "STRING", description: "Condition to trigger the alarm" }
                                },
                                required: ["enabled"]
                            }
                        },
                        {
                            name: "set_camera_mode",
                            description: "Ubah tampilan kamera antara mode 'single' atau 'dual'.",
                            parameters: {
                                type: "OBJECT",
                                properties: {
                                    mode: {
                                        type: "STRING",
                                        enum: ["single", "dual"],
                                        description: "Mode kamera yang diinginkan."
                                    }
                                },
                                required: ["mode"]
                            }
                        }
                    ]
                }
            ]
        }
    }), [systemInstruction]);

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

                    // Handle Tool Call
                    if (response.serverContent?.modelTurn?.parts?.[0]?.functionCall) {
                        const call = response.serverContent.modelTurn.parts[0].functionCall;
                        console.log("AI Tool Call:", call.name, call.args);

                        if (call.name === 'set_ai_mood') {
                            const { mood } = call.args as { mood: 'friendly' | 'formal' | 'alert' };
                            setAiMood(mood);
                        } else if (call.name === 'set_alarm') {
                            const { enabled, time, condition } = call.args as { enabled: boolean, time?: string, condition?: string };
                            setAlarmSettings({ enabled, time, condition });
                        } else if (call.name === 'set_camera_mode') {
                            const { mode } = call.args as { mode: 'single' | 'dual' };
                            setCameraMode(mode);
                        }

                        // Send Tool Response back to AI
                        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
                            const toolResponse = {
                                toolResponse: {
                                    functionResponses: [{
                                        name: call.name,
                                        response: { output: { success: true } },
                                        id: call.id
                                    }]
                                }
                            };
                            websocketRef.current.send(JSON.stringify(toolResponse));
                        }
                    }
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
    }, [apiKey, setupMessage]);

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
                            audio: {
                                mimeType: "audio/pcm",
                                data: base64Audio
                            }
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
