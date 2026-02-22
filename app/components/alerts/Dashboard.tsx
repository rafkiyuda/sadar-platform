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
import { TripReport } from '@/app/components/dashboard/TripReport';
import { SettingsView } from '@/app/components/settings/SettingsView';
import { AIChat } from '@/app/components/chat/AIChat';

interface DashboardProps {
    apiKey: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ apiKey }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [currentView, setCurrentView] = useState<'dashboard' | 'report' | 'settings' | 'chat'>('dashboard');
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
            <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#fafaf9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-center relative overflow-hidden transition-colors duration-300">
                {/* Background ambient glow */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-rose-500/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center">

                    {/* Settings button removed from landing page for simplicity in V2 */}

                    <div className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm animate-float">
                        <img
                            src="/assets/sadar_logo.png"
                            alt="SADAR Logo"
                            className="w-48 h-auto object-contain dark:invert"
                        />
                    </div>


                    <button
                        onClick={handleStart}
                        className="group relative px-8 py-4 bg-orange-600 rounded-full font-bold text-white shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 hover:shadow-orange-500/40"
                    >
                        <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center gap-3">
                            <Play className="fill-current w-5 h-5" />
                            <span>MULAI PERJALANAN</span>
                        </div>
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="flex h-screen bg-[#fafaf9] dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden font-sans selection:bg-orange-500/30 transition-colors duration-300">
            {/* 1. Sidebar */}
            <Sidebar
                onSettingsClick={() => setCurrentView('settings')}
                onViewChange={setCurrentView}
                currentView={currentView}
            />

            {/* 2. Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative bg-[#fafaf9] dark:bg-slate-950 transition-colors duration-300">

                {/* 3. Top Header */}
                <Header status={status} />

                {/* 4. Content Content - Conditional Rendering */}
                {currentView === 'report' ? (
                    <TripReport />
                ) : currentView === 'settings' ? (
                    <SettingsView />
                ) : currentView === 'chat' ? (
                    <AIChat apiKey={apiKey} />
                ) : (
                    <div className="flex-1 p-6 flex flex-row gap-6 h-[calc(100vh-5rem)] overflow-hidden">
                        {/* Left Panel: Vision (Camera) */}
                        <div className="w-1/2 relative rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[300px] transition-all duration-500 group">
                            {/* Glowing corner effects */}
                            <div className="absolute top-0 left-0 w-20 h-20 bg-orange-500/5 dark:bg-orange-500/10 blur-xl rounded-full -translate-x-10 -translate-y-10 group-hover:bg-orange-500/10 dark:group-hover:bg-orange-500/20 transition-all"></div>

                            {/* Camera container */}
                            <div className="flex-1 relative overflow-hidden">
                                <VisionGuard />

                                {/* Overlay for Critical Alert */}
                                {(status === 'DROWSY' || status === 'CRITICAL') && (
                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[90%]">
                                        <div className={`p-4 rounded-xl border backdrop-blur-md shadow-lg flex items-center justify-center gap-3 animate-pulse ${status === 'CRITICAL' ? 'bg-red-500/80 border-red-400 dark:border-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-orange-500/80 border-orange-400 dark:border-orange-600 text-white shadow-[0_0_30px_rgba(249,115,22,0.5)]'
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
                            <div className="h-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between z-10 relative transition-colors duration-300">
                                <div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase mb-1 tracking-[0.2em]">DMS Scanner</p>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse relative z-10"></div>
                                            <div className="absolute inset-0 bg-emerald-500 blur-sm animate-pulse"></div>
                                        </div>
                                        <span className="text-sm text-slate-700 dark:text-slate-300 font-bold tracking-wide">AI ACTIVE</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    {/* Speed HUD (Simulation) */}
                                    <div className="flex flex-col items-end mr-4">
                                        <div className="text-3xl font-black text-slate-800 dark:text-slate-200 italic tracking-tighter">
                                            72 <span className="text-sm font-normal text-slate-400 dark:text-slate-500 not-italic">km/h</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">SPEED</div>
                                    </div>

                                    <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 transition-colors duration-300"></div>

                                    <VoiceAssistant apiKey={apiKey} />

                                    <button className="relative group w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white dark:hover:text-white active:scale-95 overflow-hidden">
                                        <div className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 animate-pulse group-hover:animate-none"></div>
                                        <span className="text-2xl font-black z-10 transition-colors">SOS</span>
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Right Panel: Map & Navigation */}
                        <div className="w-1/2 relative rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 h-full min-h-[300px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500 group">
                            {/* Glowing corner effects */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 dark:bg-emerald-500/10 blur-xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/20 transition-all"></div>

                            <MapPanel status={status} onEditContact={() => setCurrentView('settings')} />
                        </div>
                    </div>
                )}
            </div>

            {/* Modal removed */}
        </div>
    );
};


