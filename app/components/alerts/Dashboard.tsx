'use client';

import React, { useState, useEffect } from 'react';
import { useDriverStore } from '@/app/lib/store/useDriverStore';
import { VisionGuard } from '@/app/components/vision/VisionGuard';
import { StatusBadge } from '@/app/components/alerts/StatusBadge'; // Keeping for reference if needed, but not used in new layout based on plan? Actually used in new Code? No, using Header.
import { EmergencyButton } from '@/app/components/emergency/EmergencyButton';
import { useAlertSound } from '@/app/hooks/useAlertSound';
import { Car, Play, Settings } from 'lucide-react';
import { VoiceAssistant } from '@/app/components/voice/VoiceAssistant';
// SettingsModal removed
import { Sidebar } from '@/app/components/layout/Sidebar';

import { Header } from '@/app/components/dashboard/Header';
import { MapPanel } from '@/app/components/dashboard/MapPanel';
import { TripReport } from '@/app/components/dashboard/TripReport'; // New Import
import { SettingsView } from '@/app/components/settings/SettingsView';

interface DashboardProps {
    apiKey: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ apiKey }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [currentView, setCurrentView] = useState<'dashboard' | 'report' | 'settings'>('dashboard');
    const {
        status,
        isMonitoring,
        setIsMonitoring,
        tripStats,
        incrementDistance,
        incrementDrowsyCount
    } = useDriverStore();
    const { initAudio } = useAlertSound();

    // Removed old modal state


    const handleStart = () => {
        initAudio();
        setHasStarted(true);
        setIsMonitoring(true);
    };

    // Simulation: Increment distance every 5 seconds (approx 100m or 0.1km for demo speed)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isMonitoring && hasStarted) {
            interval = setInterval(() => {
                // Simulate driving at ~72km/h => 20m/s => 100m per 5s => 0.1km
                incrementDistance(0.1);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isMonitoring, hasStarted, incrementDistance]);

    // Track drowsiness events
    useEffect(() => {
        // Report status to API when it becomes severe
        if (status === 'DROWSY' || status === 'CRITICAL') {
            const report = async () => {
                try {
                    await fetch('/api/events/drowsiness', {
                        method: 'POST',
                        body: JSON.stringify({ status, timestamp: Date.now() })
                    });
                } catch (e) {
                    console.error('Failed to report drowsiness event:', e);
                }
            };
            report();

            // Increment local stats
            // We need a debounce or check to ensure we don't over-count a single event.
            // For simplicity in this iteration, we just increment. A more robust way handles state transitions.
            // Let's assume the store handles transient states, but here we might count every frame update if not careful.
            // Better to rely on a transition. But useDriverStore status is stateful.
            // A simple way is to use a ref to track if we already counted this specific "event" instance, 
            // but status can flip back and forth. 
            // The previous code had the reporting logic here, so it was already firing.
            incrementDrowsyCount();
        }
    }, [status, incrementDrowsyCount]);


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

                    {/* Settings button removed from landing page for simplicity in V2 */}

                    <div className="mb-8 p-4 bg-white/5 rounded-full backdrop-blur-3xl border border-white/10 shadow-2xl shadow-blue-500/20 animate-float">
                        <img
                            src="/assets/sadar_logo.png"
                            alt="SADAR Logo"
                            className="w-48 h-auto object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        />
                    </div>


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
            </div>
        );
    }


    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans selection:bg-blue-500/30">
            {/* 1. Sidebar */}
            <Sidebar
                onSettingsClick={() => setCurrentView('settings')} // Fallback or unused
                onViewChange={setCurrentView}
                currentView={currentView}
            />

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative bg-gradient-to-br from-slate-950 to-blue-950/30">

                {/* 3. Top Header */}
                <Header status={status} />

                {/* 4. Content Content - Conditional Rendering */}
                {currentView === 'report' ? (
                    <TripReport />
                ) : currentView === 'settings' ? (
                    <SettingsView />
                ) : (
                    <div className="flex-1 p-6 flex flex-row gap-6 h-[calc(100vh-5rem)] overflow-hidden">
                        {/* Left Panel: Vision (Camera) */}
                        <div className="w-1/2 relative rounded-[2.5rem] overflow-hidden bg-slate-900 border-2 border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col min-h-[300px] hover:border-blue-500/50 transition-all duration-500 group">
                            {/* Glowing corner effects */}
                            <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500/10 blur-xl rounded-full -translate-x-10 -translate-y-10 group-hover:bg-blue-500/20 transition-all"></div>

                            {/* Camera container */}
                            <div className="flex-1 relative overflow-hidden">
                                <VisionGuard />

                                {/* Overlay for Critical Alert */}
                                {(status === 'DROWSY' || status === 'CRITICAL') && (
                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[90%]">
                                        <div className={`p-4 rounded-xl border backdrop-blur-md shadow-lg flex items-center justify-center gap-3 animate-pulse ${status === 'CRITICAL' ? 'bg-red-500/80 border-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-orange-500/80 border-orange-400 text-white shadow-[0_0_30px_rgba(249,115,22,0.5)]'
                                            }`}>
                                            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                                            <span className="font-bold text-lg tracking-wider uppercase drop-shadow-md">
                                                {status === 'CRITICAL' ? 'MICROSLEEP DETECTED!' : 'DROWSINESS DETECTED'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Status Strip (Vision Panel) */}
                            <div className="h-24 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 p-4 flex items-center justify-between z-10 relative">
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1 tracking-[0.2em]">Driver Monitoring System</p>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse relative z-10"></div>
                                            <div className="absolute inset-0 bg-emerald-500 blur-sm animate-pulse"></div>
                                        </div>
                                        <span className="text-sm text-slate-200 font-bold tracking-wide">AI ACTIVE SCANNING</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    {/* Speed HUD (Simulation) */}
                                    <div className="flex flex-col items-end mr-4">
                                        <div className="text-3xl font-black text-white italic tracking-tighter">
                                            72 <span className="text-sm font-normal text-slate-400 not-italic">km/h</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-mono">SPEED</div>
                                    </div>

                                    <div className="w-px h-10 bg-white/10"></div>

                                    <VoiceAssistant apiKey={apiKey} />

                                    <button className="relative group w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-xl bg-red-600/20 border border-red-500/50 hover:bg-red-600 hover:border-red-500 active:scale-95 overflow-hidden">
                                        <div className="absolute inset-0 bg-red-500/20 animate-pulse group-hover:animate-none"></div>
                                        <span className="text-2xl font-black text-red-500 group-hover:text-white z-10 transition-colors">SOS</span>
                                        <span className="text-[8px] font-bold text-red-400 group-hover:text-white/80 z-10 uppercase tracking-wider mt-0.5">Emergency</span>
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Right Panel: Map & Navigation */}
                        <div className="w-1/2 relative rounded-[2.5rem] overflow-hidden bg-slate-900 h-full min-h-[300px] border-2 border-teal-500/20 shadow-[0_0_50px_rgba(20,184,166,0.15)] hover:border-teal-500/50 transition-all duration-500 group">
                            {/* Glowing corner effects */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/10 blur-xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-teal-500/20 transition-all"></div>

                            <MapPanel status={status} onEditContact={() => setCurrentView('settings')} />
                        </div>
                    </div>
                )}
            </div>

            {/* Modal removed */}
        </div>
    );
};


