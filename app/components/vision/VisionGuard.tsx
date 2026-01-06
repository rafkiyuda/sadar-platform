'use client';

import React, { useEffect } from 'react';
import { useDrowsinessDetection } from '@/app/hooks/useDrowsinessDetection';
import { useDriverStore } from '@/app/lib/store/useDriverStore';

export const VisionGuard: React.FC = React.memo(() => {
    const { videoRef, startCamera, isReady } = useDrowsinessDetection();
    const { isMonitoring, status, ear } = useDriverStore();

    useEffect(() => {
        if (isMonitoring && isReady) {
            startCamera();
        }
    }, [isMonitoring, isReady, startCamera]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-slate-900/50 border-none shadow-none">
            {/* Main Video Feed */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                autoPlay
                playsInline
                muted
            />

            {/* Overlay Statistics (Debug/Info) */}
            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded text-xs text-mono font-mono border border-white/10">
                <div className="flex flex-col gap-1">
                    <span className={isReady ? "text-green-400" : "text-yellow-400"}>
                        Vision: {isReady ? "READY" : "LOADING..."}
                    </span>
                    <span className="text-gray-300">EAR: {ear.toFixed(2)}</span>
                    <span className="text-gray-400">Status: {status}</span>
                </div>
            </div>

            {/* Status Overlay Ring (Visual Feedback on Camera) */}
            <div className={`absolute inset-0 pointer-events-none border-4 rounded-2xl transition-colors duration-300
                ${status === 'ALERT' ? 'border-green-500/20' :
                    status === 'DROWSY' ? 'border-yellow-500/50' :
                        status === 'CRITICAL' ? 'border-red-600/80 animate-pulse' : 'border-transparent'
                }`}
            />
        </div>
    );
});
