import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ScanFace, CheckCircle2, AlertCircle } from 'lucide-react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { calculateEyeAspectRatio, LEFT_EYE_INDICES, RIGHT_EYE_INDICES } from '@/app/lib/vision-utils';
import { useDriverStore } from '@/app/lib/store/useDriverStore';

interface CalibrationViewProps {
    onComplete: () => void;
}

export const CalibrationView: React.FC<CalibrationViewProps> = ({ onComplete }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('Memuat model AI...');
    const [isFailed, setIsFailed] = useState(false);

    // Calibration State
    const [earReadings, setEarReadings] = useState<number[]>([]);
    const requestRef = useRef<number>(0);
    const { setBaselineEar } = useDriverStore();

    const TARGET_READINGS = 30; // approx 3-5 seconds of valid frames

    // 1. Load Model
    useEffect(() => {
        let isMounted = true;
        const initMediaPipe = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );
                const landmarker = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "CPU"
                    },
                    outputFaceBlendshapes: true,
                    runningMode: "IMAGE",
                    numFaces: 1
                });

                if (isMounted) {
                    setFaceLandmarker(landmarker);
                    setStatusText('Memulai kamera...');
                }
            } catch (error) {
                console.error("Failed to load MediaPipe:", error);
                if (isMounted) {
                    setStatusText('Gagal memuat sistem AI.');
                    setIsFailed(true);
                }
            }
        };

        initMediaPipe();
        return () => { isMounted = false; };
    }, []);

    // 2. Start Camera
    useEffect(() => {
        if (!faceLandmarker) return;

        let stream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user", width: 640, height: 480 }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setStatusText('Harap tatap layar dengan santai...');
                    // Start processing once video plays
                    requestRef.current = requestAnimationFrame(processVideo);
                }
            } catch (err) {
                console.error("Error starting camera:", err);
                setStatusText('Akses kamera ditolak atau gagal.');
                setIsFailed(true);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [faceLandmarker]);

    // 3. Process Video and Collect Readings
    const processVideo = useCallback(() => {
        if (!faceLandmarker || !videoRef.current) return;
        const video = videoRef.current;

        if (video.readyState >= 2 && video.videoWidth > 0 && !isFailed) {
            try {
                const results = faceLandmarker.detect(video);
                if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                    const landmarks = results.faceLandmarks[0];
                    const leftEAR = calculateEyeAspectRatio(landmarks, LEFT_EYE_INDICES);
                    const rightEAR = calculateEyeAspectRatio(landmarks, RIGHT_EYE_INDICES);
                    const avgEAR = (leftEAR + rightEAR) / 2.0;

                    // Exclude blink outliers (EAR < 0.15) or impossible values
                    if (avgEAR > 0.15 && avgEAR < 0.45) {
                        setEarReadings(prev => {
                            const newReadings = [...prev, avgEAR];
                            if (newReadings.length >= TARGET_READINGS) {
                                // Calibration Complete!
                                finishCalibration(newReadings);
                                return newReadings; // Return complete array to stop further state updates triggering effects
                            }

                            // Update progress
                            setProgress(Math.round((newReadings.length / TARGET_READINGS) * 100));
                            return newReadings;
                        });

                        // If we reached target this frame, stop raf
                        if (earReadings.length + 1 >= TARGET_READINGS) {
                            return;
                        }
                    }
                } else {
                    // Wajah tidak terdeteksi di frame ini
                    setStatusText('Wajah tidak terdeteksi...');
                }
            } catch (e) {
                console.warn("Detection error in calibration:", e);
            }
        }

        requestRef.current = requestAnimationFrame(processVideo);
    }, [faceLandmarker, isFailed, earReadings.length]); // Add length as dep so we know when to stop internally without rapid full array changes

    const finishCalibration = (readings: number[]) => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);

        // Calculate Average
        const sum = readings.reduce((a, b) => a + b, 0);
        const average = sum / readings.length;

        // Save to store
        setBaselineEar(average);

        setProgress(100);
        setStatusText('Kalibrasi Selesai!');

        setTimeout(onComplete, 1500);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#fafaf9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-center relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl max-w-sm w-full">
                <div className="relative w-40 h-40 mb-8 flex items-center justify-center rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700">

                    {/* Hidden video element for processing */}
                    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-50" playsInline muted />

                    {/* Overlay Scanning UI */}
                    <div className="absolute inset-0 border-4 border-dashed border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>

                    {!faceLandmarker && !isFailed && (
                        <ScanFace className="w-12 h-12 text-slate-400 dark:text-slate-500 animate-pulse absolute z-10" />
                    )}

                    {progress === 100 && (
                        <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center z-20">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-in zoom-in duration-300" />
                        </div>
                    )}

                    {isFailed && (
                        <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center z-20">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>
                    )}
                </div>

                <h2 className="text-xl font-bold mb-2 text-[#325a6c] dark:text-white transition-colors">Kalibrasi Mata</h2>
                <p className={`text-sm font-medium mb-6 h-10 transition-all ${isFailed ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    {statusText}
                    {!isFailed && progress > 0 && progress < 100 && (
                        <span className="block mt-1 text-xs text-blue-500">{progress}%</span>
                    )}
                </p>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${isFailed ? 'bg-red-500' : progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {progress === 100 && (
                    <p className="mt-4 text-[10px] text-slate-400">Menyesuaikan profil EAR...</p>
                )}
            </div>
        </div>
    );
};
