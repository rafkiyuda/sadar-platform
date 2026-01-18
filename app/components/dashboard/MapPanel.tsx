import React, { useEffect, useState } from 'react';
import { MapPin, Coffee, Navigation, Locate } from 'lucide-react';
import { EmergencyButton } from '../emergency/EmergencyButton';

interface MapPanelProps {
    status: string;
    onEditContact: () => void;
}

export const MapPanel: React.FC<MapPanelProps> = ({ status, onEditContact }) => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [recommendation, setRecommendation] = useState({ name: "Mencari Rest Area...", distance: "Scanning..." });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLoadingLocation(false);
                    // Mock recommendation update after location found
                    setRecommendation({ name: "Rest Area Terdekat", distance: "2.5 km • 5 min" });
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    setLoadingLocation(false);
                    // Fallback to Jakarta
                    setLocation({ lat: -6.2088, lng: 106.8456 });
                }
            );
        } else {
            setLoadingLocation(false);
            setLocation({ lat: -6.2088, lng: 106.8456 });
        }
    }, []);

    const mapSrc = location
        ? `https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=rest+area&center=${location.lat},${location.lng}&zoom=14`
        : "";

    return (
        <div className="h-full w-full relative bg-slate-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl group">
            {/* Map Background */}
            {location ? (
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(20%) contrast(1.2) invert(90%) hue-rotate(180deg)' }} // Dark mode hack for embed
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapSrc}
                ></iframe>
            ) : (
                <div className="h-full w-full flex items-center justify-center bg-slate-800">
                    <div className="flex flex-col items-center animate-pulse">
                        <MapPin className="w-10 h-10 text-slate-500 mb-2" />
                        <span className="text-slate-400 font-mono text-sm">Locating Vehicle...</span>
                    </div>
                </div>
            )}

            {/* Dark Overlay Gradient for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none"></div>

            {/* Top Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="bg-slate-900/90 p-3 rounded-xl text-white shadow-lg backdrop-blur-sm border border-white/10 hover:bg-blue-600 transition group/btn">
                    <Navigation className="w-6 h-6 group-hover/btn:rotate-45 transition-transform" />
                </button>
                <button className="bg-slate-900/90 p-3 rounded-xl text-white shadow-lg backdrop-blur-sm border border-white/10 hover:bg-emerald-600 transition">
                    <Locate className="w-6 h-6" />
                </button>
            </div>

            {/* Recommendation UI (Bottom Overlay) */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row gap-4 items-end z-10">
                <div className="flex-1 bg-slate-900/90 backdrop-blur-xl text-white p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-500/20 p-3 rounded-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-emerald-500/20 animate-ping rounded-full"></div>
                            <Coffee className="w-6 h-6 text-emerald-500 relative z-10" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-0.5">Rekomendasi Istirahat</p>
                            <h4 className="text-lg font-bold text-white leading-tight">{recommendation.name}</h4>
                            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                                <Navigation className="w-3 h-3" />
                                {recommendation.distance}
                            </p>
                        </div>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-600/20 border border-emerald-500/50">
                        NAVIGATE
                    </button>
                </div>

                <div className="shrink-0">
                    <EmergencyButton onEditContact={onEditContact} />
                </div>
            </div>

            {/* Drowsiness Alert Overlay */}
            {(status === 'DROWSY' || status === 'CRITICAL') && (
                <div className="absolute top-4 left-4 right-16 z-20">
                    <div className="bg-red-500/90 text-white px-4 py-3 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.4)] border border-red-400 backdrop-blur-sm animate-pulse flex items-center gap-3">
                        <div className="bg-white p-1.5 rounded-full">
                            <MapPin className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                            <div className="font-bold text-sm">Peringatan Bahaya!</div>
                            <div className="text-xs text-red-100">Silakan menepi di rest area terdekat.</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

