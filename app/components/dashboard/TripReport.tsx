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
        <div className="flex-1 p-8 overflow-y-auto bg-[#fafaf9] font-sans text-slate-800 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: '#325a6c' }}>
                        Dashboard Monitoring Pengemudi
                    </h2>
                    <p className="text-slate-500 font-medium tracking-wide">Analisis Kinerja & Keselamatan Armada Real-time</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Terakhir Update</span>
                        <div className="text-xl font-mono font-bold" style={{ color: '#325a6c' }}>18:32:05</div>
                    </div>
                    <button className="relative group p-3 rounded-2xl text-white transition-all active:scale-95" style={{ backgroundColor: '#325a6c' }}>
                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Activity className="w-6 h-6 animate-pulse" />
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
                {cards.map((card, idx) => (
                    <div key={idx}
                        className="bg-white rounded-[2rem] p-6 border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-[180px] shadow-sm group animate-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider leading-relaxed w-2/3">
                                {card.label}
                            </span>
                            <div className={`p-3 rounded-2xl ${card.iconBg} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative`}>
                                <div className="absolute inset-0 bg-white/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <card.icon className={`relative z-10 w-5 h-5 ${card.iconColor}`} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-baseline gap-1.5 mb-2">
                                <span className="text-3xl font-extrabold tracking-tight" style={{ color: '#325a6c' }}>
                                    {card.value}
                                </span>
                                <span className="text-xs text-slate-500 font-bold">{card.unit}</span>
                            </div>

                            <div className={`flex items-center gap-1.5 text-[10px] font-bold ${card.trendUp ? 'text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit border border-emerald-100' : 'text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full w-fit border border-orange-100'}`}>
                                {card.trendUp ? <ArrowUpRight className="w-3 h-3 animate-bounce" style={{ animationDuration: '2s' }} /> : <ArrowDownRight className="w-3 h-3" />}
                                <span>{card.trend}</span>
                                <span className="font-medium ml-0.5">{card.trendLabel}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid: Graph & Map/List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>

                {/* Left: Trend Graph */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col shadow-sm relative overflow-hidden">
                    {/* Background subtle decoration */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-slate-50 blur-3xl opacity-50 pointer-events-none"></div>

                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl" style={{ backgroundColor: '#325a6c15' }}>
                                <TrendingUp className="w-6 h-6" style={{ color: '#325a6c' }} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg" style={{ color: '#325a6c' }}>Tren Keselamatan & Efisiensi</h3>
                                <p className="text-xs text-slate-500">Analisis 30 Hari Terakhir</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition shadow-sm">
                            <Calendar className="w-4 h-4" />
                            30 Hari
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                        {['Skor Safety', 'Jarak (km)', 'Konsumsi BBM', 'Alert Kantuk'].map((tab, i) => (
                            <button key={tab} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${i === 0
                                ? 'text-white shadow-md'
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                                style={i === 0 ? { backgroundColor: '#325a6c', borderColor: '#2b4d5c' } : {}}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Rich Graph Area */}
                    <div className="relative w-full h-[320px] border-l-2 border-b-2 border-slate-100 ml-2 mb-2 pr-4 pt-4 mt-auto rounded-bl-lg">
                        {/* Interactive Hover Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#325a6c]/5 to-transparent opacity-50"></div>

                        {/* Animated Grid Lines */}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={`h-${i}`} className="absolute w-full border-t border-slate-200/60 transition-all duration-700 hover:border-[#325a6c]/20" style={{ top: `${i * 25}%`, left: 0 }}></div>
                        ))}
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={`v-${i}`} className="absolute h-full border-r border-dashed border-slate-200/40" style={{ left: `${i * 14.28}%`, top: 0 }}></div>
                        ))}

                        {/* Background Data Bars (Visual Filler) */}
                        <div className="absolute inset-0 flex items-end justify-between px-4 opacity-10 pointer-events-none">
                            {[40, 70, 45, 90, 65, 80, 50, 95].map((height, i) => (
                                <div key={`bar-${i}`} className="w-12 bg-[#325a6c] rounded-t-lg animate-in slide-in-from-bottom-8" style={{ height: `${height}%`, animationDelay: `${i * 100}ms` }}></div>
                            ))}
                        </div>

                        {/* SVG Path (Rich Area Chart) */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible p-4 drop-shadow-sm">
                            <defs>
                                <linearGradient id="chartGradientCustom" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#325a6c" stopOpacity="0.8" />
                                    <stop offset="50%" stopColor="#325a6c" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#325a6c" stopOpacity="0.05" />
                                </linearGradient>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#2b4d5c" />
                                    <stop offset="50%" stopColor="#4a86a0" />
                                    <stop offset="100%" stopColor="#325a6c" />
                                </linearGradient>
                            </defs>

                            {/* Area Fill */}
                            <path
                                d="M0,250 Q60,180 120,200 T240,120 T360,160 T480,80 T600,100 T720,40 T840,90 L840,300 L0,300 Z"
                                fill="url(#chartGradientCustom)"
                                className="animate-in fade-in"
                                style={{ animationDuration: '1.5s', animationDelay: '0.4s' }}
                                preserveAspectRatio="none"
                            />

                            {/* Thick Gradient Stroke */}
                            <path
                                d="M0,250 Q60,180 120,200 T240,120 T360,160 T480,80 T600,100 T720,40 T840,90"
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="1500"
                                strokeDashoffset="1500"
                                style={{
                                    animation: 'dash 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                                    animationDelay: '0.2s'
                                }}
                                preserveAspectRatio="none"
                            />

                            {/* Data Points / Dots */}
                            {[
                                { cx: "0%", cy: "83%" }, { cx: "14.28%", cy: "66%" }, { cx: "28.57%", cy: "40%" },
                                { cx: "42.85%", cy: "53%" }, { cx: "57.14%", cy: "26%" }, { cx: "71.42%", cy: "33%" },
                                { cx: "85.71%", cy: "13%" }, { cx: "100%", cy: "30%" }
                            ].map((dot, idx) => (
                                <g key={idx} className="group/dot cursor-pointer animate-in fade-in" style={{ animationDelay: `${1200 + (idx * 50)}ms`, animationFillMode: 'both' }}>
                                    <circle cx={dot.cx} cy={dot.cy} r="6" fill="#ffffff" stroke="#325a6c" strokeWidth="3" className="group-hover/dot:r-8 group-hover/dot:stroke-[#4a86a0] transition-all duration-300 shadow-lg" />
                                    <circle cx={dot.cx} cy={dot.cy} r="16" fill="transparent" stroke="#325a6c" strokeWidth="2" opacity="0.4" className="invisible group-hover/dot:visible animate-ping" style={{ animationDuration: '1.5s' }} />
                                </g>
                            ))}
                        </svg>

                        {/* Y-Axis Labels */}
                        <div className="absolute -left-12 top-0 h-full flex flex-col justify-between text-[11px] font-bold text-slate-400 py-4">
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                            <span>25%</span>
                            <span>0%</span>
                        </div>

                        {/* X-Axis Labels */}
                        <div className="absolute -bottom-8 left-0 w-full flex justify-between text-[11px] font-bold text-slate-400 px-4">
                            <span>Sen</span>
                            <span>Sel</span>
                            <span>Rab</span>
                            <span>Kam</span>
                            <span>Jum</span>
                            <span>Sab</span>
                            <span>Min</span>
                            <span>Hari Ini</span>
                        </div>
                    </div>
                </div>

                {/* Right: Map / Events */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col shadow-sm relative overflow-hidden" style={{ animationDelay: '1000ms', animationFillMode: 'both' }}>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl" style={{ backgroundColor: '#325a6c15' }}>
                                <MapPin className="w-5 h-5" style={{ color: '#325a6c' }} />
                            </div>
                            <h3 className="font-bold text-lg" style={{ color: '#325a6c' }}>Lokasi Armada</h3>
                        </div>
                        <div className="flex gap-2 text-[10px] font-bold">
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 rounded-lg text-orange-600 border border-orange-100"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div> Alert</span>
                        </div>
                    </div>

                    {/* Mock Map Representation (Grid) */}
                    <div className="flex-1 bg-slate-50 rounded-2xl relative overflow-hidden bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] shadow-inner animate-in fade-in" style={{ animationDelay: '1200ms', animationDuration: '1s' }}>

                        {/* Interactive overlay element */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent pointer-events-none z-0"></div>

                        {/* Jakarta Node */}
                        <div className="absolute top-1/3 left-1/4 flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="relative">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm z-10 relative border-2 border-white"></div>
                                <div className="absolute inset-0 bg-emerald-500/30 animate-ping rounded-full"></div>
                            </div>
                            <div className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 shadow-sm -mt-1">
                                Unit A-01 (JKT)
                            </div>
                        </div>

                        {/* Bekasi Node */}
                        <div className="absolute top-1/2 left-[70%] flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="relative">
                                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm z-10 relative border-2 border-white"></div>
                                <div className="absolute inset-0 bg-orange-500/30 animate-ping rounded-full"></div>
                            </div>
                            <div className="px-3 py-1 bg-white rounded-lg border border-orange-200 text-[10px] font-bold text-slate-700 shadow-sm -mt-1 flex flex-col items-center">
                                <span>Unit B-03 (BKS)</span>
                                <span className="text-[8px] text-orange-500 font-bold uppercase tracking-wide">Drowsy Alert</span>
                            </div>
                        </div>

                        {/* Tangerang Node */}
                        <div className="absolute bottom-[40%] left-[15%] flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm border-2 border-white"></div>
                            <div className="px-2 py-1 bg-white rounded border border-slate-200 text-[9px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Unit D-04 (TNG)
                            </div>
                        </div>

                        {/* Depok Node */}
                        <div className="absolute bottom-[30%] left-[50%] flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm border-2 border-white"></div>
                            <div className="px-2 py-1 bg-white rounded border border-slate-200 text-[9px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Unit C-05 (DPK)
                            </div>
                        </div>

                        {/* Info Box Overlay */}
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur border border-slate-100 p-4 rounded-2xl shadow-md w-40">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                <Activity className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-bold text-slate-700">Area Liputan</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>Total Unit</span>
                                    <span className="text-slate-800 font-bold">12</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>Online</span>
                                    <span className="text-emerald-600 font-bold">9</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>Peringatan</span>
                                    <span className="text-orange-600 font-bold">2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
