'use client';

import React, { useState, useEffect } from 'react';
import { useDriverStore } from '@/app/lib/store/useDriverStore';
import { VisionGuard } from '@/app/components/vision/VisionGuard';
import { StatusBadge } from '@/app/components/alerts/StatusBadge'; // Keeping for reference if needed, but not used in new layout based on plan? Actually used in new Code? No, using Header.
import { EmergencyButton } from '@/app/components/emergency/EmergencyButton';
import { useAlertSound } from '@/app/hooks/useAlertSound';
import { Car, Play, Settings } from 'lucide-react';
import { VoiceAssistant } from '@/app/components/voice/VoiceAssistant';
import { SettingsModal } from '@/app/components/settings/SettingsModal';
import { Sidebar } from '@/app/components/layout/Sidebar';
import { Header } from '@/app/components/dashboard/Header';
import { MapPanel } from '@/app/components/dashboard/MapPanel';

interface DashboardProps {
    apiKey: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ apiKey }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const status = useDriverStore((state) => state.status);
    const isMonitoring = useDriverStore((state) => state.isMonitoring);
    const setIsMonitoring = useDriverStore((state) => state.setIsMonitoring);
    const { initAudio } = useAlertSound();
    const [debugMode, setDebugMode] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleStart = () => {
        initAudio();
        setHasStarted(true);
        setIsMonitoring(true);
    };

    useEffect(() => {
        // Report status to API when it becomes severe
        if (status === 'DROWSY' || status === 'CRITICAL') {
            const report = async () => {
                try {
                    await fetch('/api/events/drowsiness', {
                        method: 'POST',
                        body: JSON.stringify({ status, timestamp: Date.now() })
                    });
                } catch (e) { console.error(e); }
            };
            report();
        }
    }, [status]);

    // If monitoring hasn't started, show the landing screen
    if (!hasStarted) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-black text-white text-center relative overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-600/20 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="absolute top-6 right-6 p-3 text-gray-400 hover:text-white transition bg-white/5 rounded-full hover:bg-white/10"
                    >
                        <Settings className="w-6 h-6" />
                    </button>

                    <div className="bg-gradient-to-br from-blue-500/20 to-teal-500/20 p-8 rounded-full mb-8 border border-white/5 shadow-2xl shadow-blue-900/50">
                        <Car className="w-20 h-20 text-blue-400" />
                    </div>

                    <h1 className="text-5xl font-bold mb-4 tracking-tighter bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                        SADAR
                    </h1>
                    <p className="text-gray-400 mb-12 text-lg tracking-wide font-light">
                        SADAR sebelum terlambat.
                    </p>

                    <button
                        onClick={handleStart}
                        className="group relative px-8 py-4 bg-blue-600 rounded-full font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 hover:shadow-blue-500/50"
                    >
                        <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center gap-3">
                            <Play className="fill-current w-5 h-5" />
                            <span>START DRIVING MODE</span>
                        </div>
                    </button>
                </div>
                <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans selection:bg-blue-500/30">
            {/* 1. Sidebar */}
            <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative bg-gradient-to-br from-slate-950 to-blue-950/30">

                {/* 3. Top Header */}
                <Header status={status} />

                {/* 4. Split View Content */}
                <div className="flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-[calc(100vh-5rem)] overflow-y-auto md:overflow-hidden">

                    {/* Left Panel: Vision (Camera) */}
                    <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/5 shadow-2xl flex flex-col min-h-[300px]">
                        {/* Camera container */}
                        <div className="flex-1 relative overflow-hidden group">
                            <VisionGuard />

                            {/* Overlay for Critical Alert */}
                            {(status === 'DROWSY' || status === 'CRITICAL') && (
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[90%]">
                                    <div className={`p-4 rounded-xl border backdrop-blur-md shadow-lg flex items-center justify-center gap-3 animate-pulse ${status === 'CRITICAL' ? 'bg-red-500/80 border-red-400 text-white' : 'bg-orange-500/80 border-orange-400 text-white'
                                        }`}>
                                        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                                        <span className="font-bold text-lg tracking-wider uppercase">
                                            {status === 'CRITICAL' ? 'MICROSLEEP DETECTED!' : 'DROWSINESS DETECTED'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Status Strip (Vision Panel) */}
                        <div className="h-20 bg-slate-900/90 backdrop-blur-md border-t border-white/5 p-4 flex items-center justify-between z-10">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-widest">Driver Monitoring System</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-xs text-slate-300 font-medium">Face Tracking Active</span>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/5"></div>
                            <VoiceAssistant apiKey={apiKey} />
                        </div>
                    </div>

                    {/* Right Panel: Map & Navigation */}
                    <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-full min-h-[300px] border border-white/5 shadow-2xl">
                        <MapPanel status={status} onEditContact={() => setIsSettingsOpen(true)} />
                    </div>

                </div>
            </div>

            {/* Modals */}
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};
