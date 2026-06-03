import React, { useEffect, useState } from 'react';
import { MapPin, Coffee, Navigation, Locate } from 'lucide-react';
import { EmergencyButton } from '../emergency/EmergencyButton';
import { useDriverStore } from '@/app/lib/store/useDriverStore';

interface MapPanelProps {
    status: string;
    onEditContact: () => void;
}

export const MapPanel: React.FC<MapPanelProps> = ({ status, onEditContact }) => {
    const { currentCoords } = useDriverStore();
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [isNavigating, setIsNavigating] = useState(false);
    const [recommendation, setRecommendation] = useState({ name: "Mencari Rest Area...", distance: "Scanning..." });

    useEffect(() => {
        if (currentCoords) {
            setLoadingLocation(false);
            // POC Recommendation: Kopi Nako Alam Sutera
            setRecommendation({ 
                name: "Kopi Nako Alam Sutera", 
                distance: "450 m • 2 min" 
            });
        }
    }, [currentCoords]);

    const location = currentCoords || (loadingLocation ? null : { lat: -6.2307, lng: 106.6575 });

    const mapSrc = location
        ? isNavigating 
            ? `https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&origin=${location.lat},${location.lng}&destination=Kopi+Nako+Alam+Sutera&mode=driving&zoom=15`
            : `https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=Binus+University+Alam+Sutera&center=${location.lat},${location.lng}&zoom=16`
        : "";

    return (
        <div className="h-full w-full relative bg-slate-50 dark:bg-slate-900 rounded-[2rem] overflow-hidden group transition-colors duration-300">
            {/* Map Background */}
            {location ? (
                <div className="h-full w-full relative">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={mapSrc}
                        key={isNavigating ? "nav" : "search"} // Force iframe reload on mode change
                        className="dark:opacity-80 transition-opacity duration-300"
                    ></iframe>
                    
                    {/* Navigation Overlay */}
                    {isNavigating && (
                        <div className="absolute top-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top duration-500">
                           <div className="bg-white/20 p-1.5 rounded-full animate-pulse">
                               <Navigation className="w-4 h-4" />
                           </div>
                           <div>
                               <div className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Navigating To</div>
                               <div className="text-xs font-bold leading-none">{recommendation.name}</div>
                           </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-colors duration-300">
                    <div className="flex flex-col items-center animate-pulse">
                        <MapPin className="w-10 h-10 text-orange-300 dark:text-orange-500 mb-2" />
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">Locating Vehicle...</span>
                    </div>
                </div>
            )}

            {/* Gradient Overlay for text readability (Light Mode) */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/80 dark:from-slate-950/90 to-transparent pointer-events-none transition-colors duration-300"></div>

            {/* Top Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button 
                    onClick={() => setIsNavigating(!isNavigating)}
                    className={`p-3 rounded-2xl shadow-sm backdrop-blur-sm border transition group/btn ${
                        isNavigating 
                        ? 'bg-emerald-600 text-white border-emerald-500' 
                        : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-orange-500/20'
                    }`}>
                    <Navigation className={`w-6 h-6 ${isNavigating ? 'animate-bounce' : 'group-hover/btn:rotate-45'} transition-transform`} />
                </button>
                <button className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-2xl text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-sm border border-slate-100 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                    <Locate className="w-6 h-6" />
                </button>
            </div>

            {/* Recommendation UI (Bottom Overlay) */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row gap-4 items-end z-10">
                <div className="flex-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-slate-800 dark:text-slate-100 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-lg transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-500/20 animate-ping rounded-2xl opacity-50"></div>
                            <Coffee className="w-6 h-6 text-emerald-600 dark:text-emerald-400 relative z-10" />
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-0.5">Rekomendasi Istirahat</p>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">{recommendation.name}</h4>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                <Navigation className="w-3 h-3" />
                                {recommendation.distance}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsNavigating(!isNavigating)}
                        className={`${
                            isNavigating 
                            ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 dark:shadow-emerald-900/40'
                        } px-6 py-3 rounded-2xl font-bold text-sm transition shadow-md active:scale-95`}>
                        {isNavigating ? 'SELESAI' : 'NAVIGASI'}
                    </button>
                </div>

                <div className="shrink-0">
                    <EmergencyButton onEditContact={onEditContact} />
                </div>
            </div>

            {/* Drowsiness Alert Overlay */}
            {(status === 'DROWSY' || status === 'CRITICAL') && (
                <div className="absolute top-4 left-4 right-16 z-20">
                    <div className="bg-red-500/90 text-white px-4 py-3 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.4)] border border-red-400 dark:border-red-600 backdrop-blur-sm animate-pulse flex items-center gap-3">
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

