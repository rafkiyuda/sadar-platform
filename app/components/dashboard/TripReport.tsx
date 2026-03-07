import React, { useState, useCallback } from 'react';
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

// ── Per-tab chart data ──────────────────────────────────────────────────────
interface TabData {
    label: string;
    unit: string;
    description: string;
    color: string;         // stroke colour
    gradId: string;        // <linearGradient> id
    gradStart: string;
    yLabels: string[];
    bars: number[];        // background bar heights %
    dots: { cx: string; cy: string }[];
    linePath: string;
    areaPath: string;
}

const TAB_DATA: TabData[] = [
    {
        label: 'Skor Safety',
        unit: '%',
        description: 'Skor keselamatan berkendara 0-100',
        color: '#325a6c',
        gradId: 'gradSkor',
        gradStart: '#325a6c',
        yLabels: ['100', '75', '50', '25', '0'],
        bars: [40, 70, 45, 90, 65, 80, 50, 95],
        dots: [
            { cx: '0%', cy: '83%' }, { cx: '14.28%', cy: '66%' },
            { cx: '28.57%', cy: '40%' }, { cx: '42.85%', cy: '53%' },
            { cx: '57.14%', cy: '26%' }, { cx: '71.42%', cy: '33%' },
            { cx: '85.71%', cy: '13%' }, { cx: '100%', cy: '30%' },
        ],
        linePath: 'M0,250 Q60,180 120,200 T240,120 T360,160 T480,80 T600,100 T720,40 T840,90',
        areaPath: 'M0,250 Q60,180 120,200 T240,120 T360,160 T480,80 T600,100 T720,40 T840,90 L840,300 L0,300 Z',
    },
    {
        label: 'Jarak (km)',
        unit: 'km',
        description: 'Total jarak tempuh harian selama 30 hari',
        color: '#6366f1',
        gradId: 'gradJarak',
        gradStart: '#6366f1',
        yLabels: ['200', '150', '100', '50', '0'],
        bars: [60, 50, 80, 55, 70, 45, 90, 65],
        dots: [
            { cx: '0%', cy: '55%' }, { cx: '14.28%', cy: '70%' },
            { cx: '28.57%', cy: '25%' }, { cx: '42.85%', cy: '60%' },
            { cx: '57.14%', cy: '40%' }, { cx: '71.42%', cy: '75%' },
            { cx: '85.71%', cy: '18%' }, { cx: '100%', cy: '48%' },
        ],
        linePath: 'M0,165 Q60,210 120,75 T240,180 T360,120 T480,225 T600,55 T720,145 T840,180',
        areaPath: 'M0,165 Q60,210 120,75 T240,180 T360,120 T480,225 T600,55 T720,145 T840,180 L840,300 L0,300 Z',
    },
    {
        label: 'Konsumsi BBM',
        unit: 'L',
        description: 'Konsumsi bahan bakar harian (liter)',
        color: '#f59e0b',
        gradId: 'gradBBM',
        gradStart: '#f59e0b',
        yLabels: ['50L', '37L', '25L', '12L', '0L'],
        bars: [70, 55, 65, 45, 80, 35, 60, 50],
        dots: [
            { cx: '0%', cy: '38%' }, { cx: '14.28%', cy: '55%' },
            { cx: '28.57%', cy: '42%' }, { cx: '42.85%', cy: '70%' },
            { cx: '57.14%', cy: '22%' }, { cx: '71.42%', cy: '80%' },
            { cx: '85.71%', cy: '45%' }, { cx: '100%', cy: '58%' },
        ],
        linePath: 'M0,114 Q60,165 120,126 T240,210 T360,66 T480,240 T600,135 T720,174 T840,150',
        areaPath: 'M0,114 Q60,165 120,126 T240,210 T360,66 T480,240 T600,135 T720,174 T840,150 L840,300 L0,300 Z',
    },
    {
        label: 'Alert Kantuk',
        unit: 'kejadian',
        description: 'Jumlah kejadian tanda kantuk terdeteksi',
        color: '#ef4444',
        gradId: 'gradAlert',
        gradStart: '#ef4444',
        yLabels: ['10', '7', '5', '2', '0'],
        bars: [20, 40, 15, 60, 30, 55, 10, 45],
        dots: [
            { cx: '0%', cy: '72%' }, { cx: '14.28%', cy: '44%' },
            { cx: '28.57%', cy: '83%' }, { cx: '42.85%', cy: '22%' },
            { cx: '57.14%', cy: '60%' }, { cx: '71.42%', cy: '28%' },
            { cx: '85.71%', cy: '88%' }, { cx: '100%', cy: '50%' },
        ],
        linePath: 'M0,216 Q60,132 120,249 T240,66 T360,180 T480,84 T600,264 T720,90 T840,210',
        areaPath: 'M0,216 Q60,132 120,249 T240,66 T360,180 T480,84 T600,264 T720,90 T840,210 L840,300 L0,300 Z',
    },
];

export const TripReport: React.FC = () => {
    const [timeRange, setTimeRange] = useState('30 Days');
    const [activeTab, setActiveTab] = useState(0);
    const [chartKey, setChartKey] = useState(0); // force SVG re-animation on tab switch

    const handleTabChange = useCallback((i: number) => {
        setActiveTab(i);
        setChartKey(k => k + 1);
    }, []);

    const tab = TAB_DATA[activeTab];

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
        <div className="flex-1 p-8 overflow-y-auto bg-[#fafaf9] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 animate-in fade-in duration-700 transition-colors">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight dark:text-orange-400 transition-colors" style={{ color: '#325a6c' }}>
                        Dashboard Monitoring Pengemudi
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">Analisis Kinerja & Keselamatan Armada Real-time</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Terakhir Update</span>
                        <div className="text-xl font-mono font-bold dark:text-orange-300 transition-colors" style={{ color: '#325a6c' }}>18:32:05</div>
                    </div>
                    <button className="relative group p-3 rounded-2xl text-white transition-all active:scale-95 bg-[#325a6c] dark:bg-[#325a6c]/80 dark:hover:bg-[#325a6c]">
                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Activity className="w-6 h-6 animate-pulse" />
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
                {cards.map((card, idx) => (
                    <div key={idx}
                        className="bg-white dark:bg-slate-900/60 backdrop-blur-sm rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all duration-300 flex flex-col justify-between h-[180px] shadow-sm group animate-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider leading-relaxed w-2/3">
                                {card.label}
                            </span>
                            <div className={`p-3 rounded-2xl ${card.iconBg} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative`}>
                                <div className="absolute inset-0 bg-white/30 dark:bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <card.icon className={`relative z-10 w-5 h-5 ${card.iconColor}`} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-baseline gap-1.5 mb-2">
                                <span className="text-3xl font-extrabold tracking-tight dark:text-slate-100 transition-colors" style={{ color: '#325a6c' }}>
                                    {card.value}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{card.unit}</span>
                            </div>

                            <div className={`flex items-center gap-1.5 text-[10px] font-bold ${card.trendUp ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit border border-emerald-100 dark:border-emerald-500/20' : 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 rounded-full w-fit border border-orange-100 dark:border-orange-500/20'}`}>
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
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 flex flex-col shadow-sm relative overflow-hidden transition-colors">
                    {/* Background subtle decoration */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-slate-50 dark:bg-slate-800 blur-3xl opacity-50 pointer-events-none transition-colors"></div>

                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-[#325a6c15] dark:bg-orange-500/10">
                                <TrendingUp className="w-6 h-6 text-[#325a6c] dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-[#325a6c] dark:text-slate-100">Tren Keselamatan & Efisiensi</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Analisis 30 Hari Terakhir</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-sm">
                            <Calendar className="w-4 h-4" />
                            30 Hari
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mb-8 relative z-10 bg-transparent">
                        {TAB_DATA.map((t, i) => (
                            <button
                                key={t.label}
                                onClick={() => handleTabChange(i)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${i === activeTab
                                        ? 'text-white shadow-md'
                                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                style={i === activeTab ? { backgroundColor: t.color, borderColor: t.color } : {}}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Chart description */}
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 -mt-4 italic">{tab.description}</p>

                    {/* Rich Graph Area */}
                    <div key={chartKey} className="relative w-full h-[320px] border-l-2 border-b-2 border-slate-100 ml-2 mb-2 pr-4 pt-4 mt-auto rounded-bl-lg">
                        {/* Interactive Hover Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#325a6c]/5 to-transparent opacity-50"></div>

                        {/* Animated Grid Lines */}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={`h-${i}`} className="absolute w-full border-t border-slate-200/60" style={{ top: `${i * 25}%`, left: 0 }}></div>
                        ))}
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={`v-${i}`} className="absolute h-full border-r border-dashed border-slate-200/40" style={{ left: `${i * 14.28}%`, top: 0 }}></div>
                        ))}

                        {/* Background Data Bars (per tab) */}
                        <div className="absolute inset-0 flex items-end justify-between px-4 opacity-10 pointer-events-none">
                            {tab.bars.map((height, i) => (
                                <div
                                    key={`bar-${i}`}
                                    className="w-12 rounded-t-lg animate-in slide-in-from-bottom-8"
                                    style={{ height: `${height}%`, animationDelay: `${i * 100}ms`, backgroundColor: tab.color }}
                                />
                            ))}
                        </div>

                        {/* SVG Path (Rich Area Chart) — re-mounts on chartKey change */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible p-4 drop-shadow-sm">
                            <defs>
                                <linearGradient id={tab.gradId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={tab.gradStart} stopOpacity="0.7" />
                                    <stop offset="50%" stopColor={tab.gradStart} stopOpacity="0.25" />
                                    <stop offset="100%" stopColor={tab.gradStart} stopOpacity="0.03" />
                                </linearGradient>
                            </defs>

                            {/* Area Fill */}
                            <path
                                d={tab.areaPath}
                                fill={`url(#${tab.gradId})`}
                                className="animate-in fade-in"
                                style={{ animationDuration: '1.2s', animationDelay: '0.2s' }}
                                preserveAspectRatio="none"
                            />

                            {/* Animated Stroke */}
                            <path
                                d={tab.linePath}
                                fill="none"
                                stroke={tab.color}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="1800"
                                strokeDashoffset="1800"
                                style={{
                                    animation: 'dash 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                                    animationDelay: '0.1s'
                                }}
                                preserveAspectRatio="none"
                            />

                            {/* Data Points / Dots */}
                            {tab.dots.map((dot, idx) => (
                                <g key={idx} className="group/dot cursor-pointer animate-in fade-in" style={{ animationDelay: `${900 + idx * 60}ms`, animationFillMode: 'both' }}>
                                    <circle cx={dot.cx} cy={dot.cy} r="6" fill="#ffffff" stroke={tab.color} strokeWidth="3" />
                                    <circle cx={dot.cx} cy={dot.cy} r="16" fill="transparent" stroke={tab.color} strokeWidth="2" opacity="0.4" className="invisible group-hover/dot:visible animate-ping" style={{ animationDuration: '1.5s' }} />
                                </g>
                            ))}
                        </svg>

                        {/* Y-Axis Labels (per tab) */}
                        <div className="absolute -left-12 top-0 h-full flex flex-col justify-between text-[11px] font-bold text-slate-400 py-4">
                            {tab.yLabels.map(l => <span key={l}>{l}</span>)}
                        </div>

                        {/* X-Axis Labels */}
                        <div className="absolute -bottom-8 left-0 w-full flex justify-between text-[11px] font-bold text-slate-400 px-4">
                            <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span>
                            <span>Jum</span><span>Sab</span><span>Min</span><span>Hari Ini</span>
                        </div>
                    </div>
                </div>

                {/* Right: Map / Events */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col shadow-sm relative overflow-hidden transition-colors" style={{ animationDelay: '1000ms', animationFillMode: 'both' }}>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-[#325a6c15] dark:bg-orange-500/10">
                                <MapPin className="w-5 h-5 text-[#325a6c] dark:text-orange-400" />
                            </div>
                            <h3 className="font-bold text-lg text-[#325a6c] dark:text-slate-100">Lokasi Armada</h3>
                        </div>
                        <div className="flex gap-2 text-[10px] font-bold">
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif</span>
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 dark:bg-orange-500/10 rounded-lg text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div> Alert</span>
                        </div>
                    </div>

                    {/* Mock Map Representation (Grid) */}
                    <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-2xl relative overflow-hidden bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] shadow-inner animate-in fade-in transition-colors" style={{ animationDelay: '1200ms', animationDuration: '1s' }}>

                        {/* Interactive overlay element */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/60 dark:from-slate-950/60 to-transparent pointer-events-none z-0"></div>

                        {/* Jakarta Node */}
                        <div className="absolute top-1/3 left-1/4 flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="relative">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm z-10 relative border-2 border-white dark:border-slate-800"></div>
                                <div className="absolute inset-0 bg-emerald-500/30 animate-ping rounded-full"></div>
                            </div>
                            <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-sm -mt-1 transition-colors">
                                Unit A-01 (JKT)
                            </div>
                        </div>

                        {/* Bekasi Node */}
                        <div className="absolute top-1/2 left-[70%] flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="relative">
                                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm z-10 relative border-2 border-white dark:border-slate-800"></div>
                                <div className="absolute inset-0 bg-orange-500/30 animate-ping rounded-full"></div>
                            </div>
                            <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-orange-200 dark:border-orange-500/30 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-sm -mt-1 flex flex-col items-center transition-colors">
                                <span>Unit B-03 (BKS)</span>
                                <span className="text-[8px] text-orange-500 dark:text-orange-400 font-bold uppercase tracking-wide">Drowsy Alert</span>
                            </div>
                        </div>

                        {/* Tangerang Node */}
                        <div className="absolute bottom-[40%] left-[15%] flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm border-2 border-white dark:border-slate-800"></div>
                            <div className="px-2 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[9px] text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                Unit D-04 (TNG)
                            </div>
                        </div>

                        {/* Depok Node */}
                        <div className="absolute bottom-[30%] left-[50%] flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm border-2 border-white dark:border-slate-800"></div>
                            <div className="px-2 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[9px] text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                Unit C-05 (DPK)
                            </div>
                        </div>

                        {/* Info Box Overlay */}
                        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-md w-40 transition-colors">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                                <Activity className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Area Liputan</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                                    <span>Total Unit</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-bold">12</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                                    <span>Online</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">9</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                                    <span>Peringatan</span>
                                    <span className="text-orange-600 dark:text-orange-400 font-bold">2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
