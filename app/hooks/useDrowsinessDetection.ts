import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useDriverStore } from '@/app/lib/store/useDriverStore';
import {
    EAR_THRESHOLD_DROWSY,
    EAR_THRESHOLD_CRITICAL,
    TIME_WINDOW_MS
} from '@/app/lib/constants';
import {
    calculateEyeAspectRatio,
    LEFT_EYE_INDICES,
    RIGHT_EYE_INDICES
} from '@/app/lib/vision-utils';

export function useDrowsinessDetection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
    const requestRef = useRef<number>(0);
    const { setStatus, setEAR, isMonitoring, status } = useDriverStore();

    // State for smoothing and state machine
    const consecutiveDrowsyFrames = useRef(0);
    const drowsyStartTime = useRef<number | null>(null);
    const lastVideoTimeRef = useRef<number>(0);

    // Initialize MediaPipe
    useEffect(() => {
        const initMediaPipe = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                    delegate: "CPU"
                },
                outputFaceBlendshapes: true,
                runningMode: "IMAGE",
                numFaces: 1
            });
            setFaceLandmarker(faceLandmarker);
        };

        initMediaPipe();

        return () => {
            // Cleanup not strictly necessary for singleton, but good practice if we were destroying it
        };
    }, []);

    const processVideo = useCallback(() => {
        if (!faceLandmarker || !videoRef.current || !isMonitoring) return;

        // Strict check for video readiness and dimensions
        if (videoRef.current.readyState < 2 || videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
            requestRef.current = requestAnimationFrame(processVideo);
            return;
        }
        const now = performance.now();
        if (now - lastVideoTimeRef.current < 200) { // Limit to ~5 FPS for PoC stability
            requestRef.current = requestAnimationFrame(processVideo);
            return;
        }
        lastVideoTimeRef.current = now;

        // Strict runtime checks
        const video = videoRef.current;
        if (video.paused || video.ended || video.currentTime === 0) {
            requestRef.current = requestAnimationFrame(processVideo);
            return;
        }
        try {
            // Use detect() in IMAGE mode for better stability in PoC
            const results = faceLandmarker.detect(videoRef.current);

            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                const landmarks = results.faceLandmarks[0]; // 478 landmarks

                // Calculate EAR
                const leftEAR = calculateEyeAspectRatio(landmarks, LEFT_EYE_INDICES);
                const rightEAR = calculateEyeAspectRatio(landmarks, RIGHT_EYE_INDICES);
                const avgEAR = (leftEAR + rightEAR) / 2.0;

                setEAR(avgEAR);

                // State Machine for Drowsiness
                // Simple logic: if EAR < Threshold for Time Window -> Drowsy

                if (avgEAR < EAR_THRESHOLD_DROWSY) {
                    if (drowsyStartTime.current === null) {
                        drowsyStartTime.current = Date.now();
                    }

                    const duration = Date.now() - drowsyStartTime.current;

                    if (duration > TIME_WINDOW_MS) {
                        // Check severity
                        if (avgEAR < EAR_THRESHOLD_CRITICAL) {
                            setStatus('CRITICAL');
                        } else {
                            setStatus('DROWSY');
                        }
                    } else {
                        // Still in "Alert" buffer time (blinking?)
                        // Only switch if we were already drowsy to keep state stability
                        if (status !== 'ALERT' && status !== 'NO_FACE') {
                            // keep current status
                        } else {
                            setStatus('ALERT');
                        }
                    }
                } else {
                    // Eyes open
                    drowsyStartTime.current = null;
                    setStatus('ALERT');
                }

            } else {
                setStatus('NO_FACE');
                drowsyStartTime.current = null;
            }
        } catch (e) {
            // Suppress error overlay, just warn
            console.warn("MediaPipe Detection Transient Error:", e);
            // Backoff logic: wait 1 second before retrying heavily
            lastVideoTimeRef.current = performance.now() + 1000;
        }

        requestRef.current = requestAnimationFrame(processVideo);
    }, [faceLandmarker, isMonitoring, setStatus, setEAR, status]);

    // Start/Stop loop based on monitoring state
    useEffect(() => {
        if (isMonitoring && faceLandmarker) {
            requestRef.current = requestAnimationFrame(processVideo);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
    }, [isMonitoring, faceLandmarker, processVideo]);

    // Camera setup helper
    const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user", width: 640, height: 480 }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // Prevent "The play() request was interrupted" error
                    if (videoRef.current.paused) {
                        try {
                            await videoRef.current.play();
                        } catch (e: any) {
                            // Ignore AbortError which happens when video is interrupted by new load
                            if (e.name !== 'AbortError') {
                                console.warn("Video play failed:", e);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Error starting camera:", err);
            }
        }
    };

    return { videoRef, startCamera, isReady: !!faceLandmarker };
}
