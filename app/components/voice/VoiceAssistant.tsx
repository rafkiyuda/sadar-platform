import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Activity } from 'lucide-react';
import { useMultimodalLive } from '@/app/hooks/useMultimodalLive';

import { useDriverStore } from '@/app/lib/store/useDriverStore';

interface VoiceAssistantProps {
    apiKey: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = React.memo(({ apiKey }) => {
    const { currentAddress, setCurrentAddress } = useDriverStore();
    const { connect, disconnect, status, volume, errorMessage } = useMultimodalLive(apiKey, currentAddress);
    const [isActive, setIsActive] = useState(false);
    const incrementCallDuration = useDriverStore((state) => state.incrementCallDuration);

    const fetchAddress = async (lat: number, lng: number) => {
        if (currentAddress) return; // Already have it

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
            );
            const data = await response.json();
            if (data.status === 'OK' && data.results && data.results[0]) {
                const address = data.results[0].formatted_address;
                console.log("Resolved Address:", address);
                setCurrentAddress(address);
            } else {
                console.error("Geocoding API Error:", data.status, data.error_message);
                setCurrentAddress(null);
            }
        } catch (error) {
            console.error("Geocoding failed:", error);
            setCurrentAddress(null);
        }
    };

    useEffect(() => {
        if (navigator.geolocation && !currentAddress) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    useDriverStore.getState().setCurrentCoords(coords);
                    fetchAddress(coords.lat, coords.lng);
                },
                (error) => {
                    console.error("Error fetching location for voice assistant:", error);
                }
            );
        }
    }, [apiKey, currentAddress]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'connected') {
            interval = setInterval(() => {
                incrementCallDuration(1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, incrementCallDuration]);

    const toggleConnection = () => {
        if (status === 'connected' || status === 'connecting') {
            disconnect();
            setIsActive(false);
        } else {
            connect();
            setIsActive(true);
        }
    };


    // calculate visualizer scale based on volume
    // volume is usually 0.0 to 1.0 (rms)
    const scale = 1 + Math.min(volume * 5, 0.5);
    const glowIntensity = Math.min(volume * 20, 1);

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={toggleConnection}
                className={`relative group w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${status === 'connected'
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                    : status === 'connecting'
                        ? 'bg-orange-400 animate-pulse'
                        : 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/30'
                    }`}
            >
                {/* Ping animation when active */}
                {status === 'connected' && (
                    <span
                        className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20"
                        style={{ transform: `scale(${scale * 1.5})`, transition: 'transform 0.1s' }}
                    ></span>
                )}

                {/* Glow Ring */}
                {status === 'connected' && (
                    <div
                        className="absolute inset-0 rounded-full blur-xl bg-white transition-opacity duration-75"
                        style={{ opacity: glowIntensity * 0.5 }}
                    />
                )}

                <div className="relative z-10">
                    {status === 'connected' ? (
                        <Mic className="w-8 h-8 text-white fill-current" />
                    ) : (
                        <MicOff className="w-8 h-8 text-white/90" />
                    )}
                </div>
            </button>

            <div className={`text-sm font-bold tracking-wider transition-colors ${status === 'connected' ? 'text-emerald-600' :
                status === 'connecting' ? 'text-orange-500' : 'text-slate-400'
                }`}>
                {status === 'connected' ? 'LIVE CALL ACTIVE' :
                    status === 'connecting' ? 'CONNECTING...' : 'START LIVE CALL'}
            </div>

            {/* Debug Location Display */}
            <div className="text-[10px] text-slate-400 max-w-[200px] text-center mt-2 font-mono">
                {currentAddress || "Waiting for GPS..."}
            </div>

            {/* Error Message */}
            {errorMessage && (status === 'disconnected' || status === 'error') && (
                <div className="text-center max-w-xs absolute top-24 z-50">
                    <div className="text-xs text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200 shadow-md">
                        {errorMessage}
                    </div>
                </div>
            )}
        </div>
    );
});
