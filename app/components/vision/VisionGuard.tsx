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
                className="w-full h-full object-cover transform scale-x-[-1] opacity-90 will-change-transform" // Mirror effect
                autoPlay
                playsInline
                muted
            />
            {/* Gradient Overlay for Cinematic Look */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30 pointer-events-none"></div>

            {/* Overlay Statistics (Debug/Info) */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-10">
                <div className="bg-slate-950/80 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                    <div className={`w-2 h-2 rounded-full ${isReady ? "bg-emerald-500 animate-pulse" : "bg-yellow-500"}`}></div>
                    <span className="text-[10px] font-mono text-slate-300 tracking-wider">
                        {isReady ? "SYSTEM ACTIVE" : "INITIALIZING..."}
                    </span>
                </div>

                {isReady && (
                    <div className="bg-slate-950/80 px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                        <span className="text-[10px] font-mono text-blue-400 tracking-wider">EAR: {ear.toFixed(2)}</span>
                    </div>
                )}
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
