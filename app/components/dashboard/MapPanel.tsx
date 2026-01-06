import React from 'react';
import { MapPin, Coffee, Navigation } from 'lucide-react';
import { EmergencyButton } from '../emergency/EmergencyButton';

interface MapPanelProps {
    status: string;
    onEditContact: () => void;
}

export const MapPanel: React.FC<MapPanelProps> = ({ status, onEditContact }) => {
    return (
        <div className="h-full w-full relative bg-slate-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/106.8272, -6.1751,14,0,60/800x600?access_token=Pk.eyJ1IjoibW9jayIsImEiOiJjamZ5In0.1')] bg-cover bg-center opacity-70 grayscale-[30%]"
                style={{ backgroundColor: '#1f2937' }}>
                {/* Fallback pattern if image fails */}
                <div className="w-full h-full opacity-20 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            {/* Navigation Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="bg-slate-900/90 p-3 rounded-xl text-white shadow-lg backdrop-blur-sm border border-white/10 hover:bg-blue-600 transition">
                    <Navigation className="w-6 h-6" />
                </button>
            </div>

            {/* Current Location Marker (Center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10 relative"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        You're Here
                    </div>
                </div>
            </div>

            {/* Recommendation UI (Bottom Overlay) */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 bg-slate-900/90 backdrop-blur-xl text-white p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-500/20 p-3 rounded-full">
                            <Coffee className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Rekomendasi Lokasi</p>
                            <h4 className="text-lg font-bold">Rest Area KM 57</h4>
                            <p className="text-sm text-gray-400">500m • 2 min</p>
                        </div>
                    </div>
                    <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition">
                        NAVIGATE
                    </button>
                </div>

                <div className="shrink-0">
                    <EmergencyButton onEditContact={onEditContact} />
                </div>
            </div>

            {/* Show only if drowsy */}
            {(status === 'DROWSY' || status === 'CRITICAL') && (
                <div className="absolute top-4 left-4 right-16">
                    <div className="bg-red-500/90 text-white px-4 py-3 rounded-xl shadow-lg border border-red-400 backdrop-blur-sm animate-pulse flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <span className="font-bold">Nearest Safe Stop found! Please pull over.</span>
                    </div>
                </div>
            )}
        </div>
    );
};
