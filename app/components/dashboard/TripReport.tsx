import React, { useState } from 'react';
import {
    Navigation,
    Clock,
    Zap,
    AlertTriangle,
    Activity,
    MapPin,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    TrendingUp,
    ShieldCheck,
    Gauge
} from 'lucide-react';

export const TripReport: React.FC = () => {
    // Dummy Data State (Static for now as requested)
    const [timeRange, setTimeRange] = useState('30 Days');

    // Card Data Configuration matching the SADAR context (Driving Safety)
    const cards = [
        {
            label: 'Total Jarak Tempuh',
            value: '1.245',
            unit: 'km',
            trend: '12.5%',
            trendUp: true,
            trendLabel: 'dari minggu lalu',
            icon: Navigation,
            iconBg: 'bg-blue-600',
            iconColor: 'text-white'
        },
        {
            label: 'Waktu Berkendara',
            value: '48.5',
            unit: 'jam',
            trend: '5.2%',
            trendUp: true,
            trendLabel: 'dari minggu lalu',
            icon: Clock,
            iconBg: 'bg-indigo-600',
            iconColor: 'text-white'
        },
        {
            label: 'Skor Keselamatan',
            value: '94',
            unit: '/ 100',
            trend: '2.1%',
            trendUp: true,
            trendLabel: 'peningkatan',
            icon: ShieldCheck,
            iconBg: 'bg-emerald-600',
            iconColor: 'text-white'
        },
        {
            label: 'Peringatan Kantuk',
            value: '3',
            unit: 'kejadian',
            trend: '10%',
            trendUp: false, // Down is good for alerts, but let's visually show red arrow down implies reduction (good) or increase (bad)? 
            // Usually green arrow UP is good. Red arrow UP is bad. Green arrow DOWN is good.
            // Simplified: Red text for bad trend. 3 events is low, maybe trend is down 50%?
            trendLabel: 'lebih rendah',
            icon: AlertTriangle,
            iconBg: 'bg-orange-500',
            iconColor: 'text-white'
        },
        {
            label: 'Efisiensi BBM',
            value: '14.2',
            unit: 'km/L',
            trend: '0.8%',
            trendUp: true,
            trendLabel: 'lebih hemat',
            icon: Zap,
            iconBg: 'bg-yellow-500',
            iconColor: 'text-white'
        },
        {
            label: 'Kecepatan Rata-rata',
            value: '62',
            unit: 'km/j',
            trend: '1.8%',
            trendUp: true,
            trendLabel: 'stabil',
            icon: Gauge,
            iconBg: 'bg-purple-600',
            iconColor: 'text-white'
        }
    ];

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-[#0f172a] font-sans text-slate-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Dashboard Monitoring Pengemudi
                    </h2>
                    <p className="text-slate-400">Analisis Kinerja & Keselamatan Armada Real-time</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Terakhir Update</span>
                        <div className="text-white text-xl font-mono font-bold">18:32:05</div>
                    </div>
                    <button className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 active:scale-95">
                        <Activity className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-[#1e293b] rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all flex flex-col justify-between h-[180px] shadow-lg group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider leading-relaxed w-2/3">
                                {card.label}
                            </span>
                            <div className={`p-3 rounded-xl ${card.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-baseline gap-1.5 mb-2">
                                <span className="text-3xl font-bold text-white tracking-tight">
                                    {card.value}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">{card.unit}</span>
                            </div>

                            <div className={`flex items-center gap-1.5 text-xs font-bold ${card.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                {card.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                <span>{card.trend}</span>
                                <span className="text-slate-500 font-medium ml-0.5">{card.trendLabel}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid: Graph & Map/List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Trend Graph */}
                <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-700/50 p-8 flex flex-col shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Tren Keselamatan & Efisiensi</h3>
                                <p className="text-xs text-slate-500">Analisis 30 Hari Terakhir</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 transition">
                            <Calendar className="w-4 h-4" />
                            30 Hari
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {['Skor Safety', 'Jarak (km)', 'Konsumsi BBM', 'Alert Kantuk'].map((tab, i) => (
                            <button key={tab} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${i === 0
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                                }`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Dummy Graph Area */}
                    <div className="relative w-full h-[320px] border-l border-b border-slate-700/50 ml-2 mb-2 p-4">
                        {/* Grid Lines */}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="absolute w-full border-t border-dashed border-slate-700/30" style={{ top: `${i * 25}%`, left: 0 }}></div>
                        ))}
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                            <div key={i} className="absolute h-full border-r border-dashed border-slate-700/30" style={{ left: `${i * 9.09}%`, top: 0 }}></div>
                        ))}

                        {/* SVG Path (Dummy Data) */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible p-4">
                            <defs>
                                <linearGradient id="chartGradientGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,150 Q50,130 100,140 T200,100 T300,120 T400,80 T500,90 T600,60 T700,90 T800,50 T900,80 L900,300 L0,300 Z"
                                fill="url(#chartGradientGreen)"
                                className="opacity-30"
                            />

                            <path
                                d="M0,150 Q50,130 100,140 T200,100 T300,120 T400,80 T500,90 T600,60 T700,90 T800,50 T900,80"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="drop-shadow-lg"
                            />
                            {/* Dots */}
                            {[
                                { cx: 100, cy: 140 }, { cx: 200, cy: 100 }, { cx: 300, cy: 120 }, { cx: 400, cy: 80 },
                                { cx: 500, cy: 90 }, { cx: 600, cy: 60 }, { cx: 700, cy: 90 }, { cx: 800, cy: 50 }
                            ].map((dot, idx) => (
                                <g key={idx} className="group/dot cursor-pointer">
                                    <circle cx={dot.cx} cy={dot.cy} r="4" fill="#1e293b" stroke="#10b981" strokeWidth="2" className="group-hover/dot:r-6 transition-all" />
                                    <circle cx={dot.cx} cy={dot.cy} r="12" fill="transparent" stroke="#10b981" strokeWidth="1" opacity="0.3" className="invisible group-hover/dot:visible animate-ping" />
                                </g>
                            ))}
                        </svg>

                        {/* Y-Axis Labels */}
                        <div className="absolute -left-12 top-0 h-full flex flex-col justify-between text-[11px] font-bold text-slate-500 py-4">
                            <span>100</span>
                            <span>75</span>
                            <span>50</span>
                            <span>25</span>
                            <span>0</span>
                        </div>
                    </div>
                </div>

                {/* Right: Map / Events */}
                <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 p-6 flex flex-col shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <MapPin className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="font-bold text-white text-lg">Lokasi Armada</h3>
                        </div>
                        <div className="flex gap-2 text-[10px] font-bold">
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-md text-emerald-400 border border-emerald-500/10"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Aktif</span>
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 rounded-md text-red-400 border border-red-500/10"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Alert</span>
                        </div>
                    </div>

                    {/* Mock Map Representation (Grid) */}
                    <div className="flex-1 bg-[#0f172a] rounded-xl border border-slate-700/50 relative overflow-hidden bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] shadow-inner">

                        {/* Jakarta Node */}
                        <div className="absolute top-1/3 left-1/4 flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="relative">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10 relative border-2 border-[#0f172a]"></div>
                                <div className="absolute inset-0 bg-emerald-500/50 animate-ping rounded-full"></div>
                            </div>
                            <div className="px-3 py-1 bg-slate-900/90 rounded-lg border border-slate-600/50 text-[10px] font-bold text-white shadow-xl backdrop-blur-sm -mt-1">
                                Unit A-01 (JKT)
                            </div>
                        </div>

                        {/* Bekasi Node */}
                        <div className="absolute top-1/2 left-[70%] flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="relative">
                                <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-10 relative border-2 border-[#0f172a]"></div>
                                <div className="absolute inset-0 bg-red-500/50 animate-ping rounded-full"></div>
                            </div>
                            <div className="px-3 py-1 bg-slate-900/90 rounded-lg border border-red-500/30 text-[10px] font-bold text-white shadow-xl backdrop-blur-sm -mt-1 flex flex-col items-center">
                                <span>Unit B-03 (BKS)</span>
                                <span className="text-[8px] text-red-400 font-bold uppercase tracking-wide">Drowsy Alert</span>
                            </div>
                        </div>

                        {/* Tangerang Node */}
                        <div className="absolute bottom-[40%] left-[15%] flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] border-2 border-[#0f172a]"></div>
                            <div className="px-2 py-1 bg-slate-900/80 rounded border border-slate-700 text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                Unit D-04 (TNG)
                            </div>
                        </div>

                        {/* Depok Node */}
                        <div className="absolute bottom-[30%] left-[50%] flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] border-2 border-[#0f172a]"></div>
                            <div className="px-2 py-1 bg-slate-900/80 rounded border border-slate-700 text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                Unit C-05 (DPK)
                            </div>
                        </div>

                        {/* Info Box Overlay */}
                        <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl w-40">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                                <Activity className="w-3 h-3 text-blue-400" />
                                <span className="text-xs font-bold text-white">Coverage Area</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-slate-400">
                                    <span>Total Unit</span>
                                    <span className="text-white font-bold">12</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400">
                                    <span>Online</span>
                                    <span className="text-emerald-400 font-bold">9</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400">
                                    <span>Alerts</span>
                                    <span className="text-red-400 font-bold">2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
