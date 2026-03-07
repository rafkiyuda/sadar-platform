'use client';
import React, { useState } from 'react';
import {
    FileText,
    TrendingUp,
    Users,
    AlertTriangle,
    Navigation,
    ChevronRight,
    ArrowLeft,
    Target,
    Download,
    Calendar,
    UserCheck,
    UserX,
    Star
} from 'lucide-react';

// --- Types ---
type ScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E';

interface Driver {
    id: number;
    name: string;
    score: number;
    grade: ScoreGrade;
    totalKm: number;
    trips: number;
    alerts: number;
}

// --- Mock Data ---
const topDrivers: Driver[] = [
    { id: 1, name: 'Dimas Fariz', score: 95, grade: 'A', totalKm: 3504, trips: 28, alerts: 0 },
    { id: 2, name: 'Alfian Yudistira', score: 82, grade: 'A', totalKm: 2890, trips: 22, alerts: 2 },
    { id: 3, name: 'Wilis Bagio', score: 78, grade: 'B', totalKm: 3100, trips: 25, alerts: 3 },
    { id: 4, name: 'Adi Tjandra', score: 68, grade: 'C', totalKm: 2400, trips: 19, alerts: 5 },
    { id: 5, name: 'Risman Satria', score: 66, grade: 'C', totalKm: 2200, trips: 17, alerts: 6 },
];

const worstDrivers: Driver[] = [
    { id: 6, name: 'Totok Budiman', score: 20, grade: 'E', totalKm: 980, trips: 9, alerts: 18 },
    { id: 7, name: 'Gustian Riswanto', score: 35, grade: 'D', totalKm: 1200, trips: 12, alerts: 14 },
    { id: 8, name: 'Warsito Sugeng', score: 48, grade: 'D', totalKm: 1500, trips: 13, alerts: 11 },
    { id: 9, name: 'Hagan Putra', score: 62, grade: 'C', totalKm: 1800, trips: 15, alerts: 7 },
    { id: 10, name: 'Dwi Agung', score: 66, grade: 'C', totalKm: 2050, trips: 16, alerts: 6 },
];

const weeklyData = [
    { day: '01 Mar', km: 430, target: 500 },
    { day: '02 Mar', km: 350, target: 500 },
    { day: '03 Mar', km: 310, target: 500 },
    { day: '04 Mar', km: 600, target: 500 },
    { day: '05 Mar', km: 470, target: 500 },
    { day: '06 Mar', km: 520, target: 500 },
    { day: '07 Mar', km: 490, target: 500 },
];

interface FuelRow {
    date: string;
    plate: string;
    initPct: number;
    initVol: number;
    finalPct: number;
    finalVol: number;
    fillCount: number;
    fillVol: number;
    deductCount: number;
    deductVol: number;
    usage: number;
    km: number;
    driveTime: string;
    idleTime: string;
    actualEff: number;
    stdEff: number;
    status: 'Efisien' | 'Tidak Efisien';
}

const fuelData: FuelRow[] = [
    { date: '09 Okt 2023', plate: 'DemoFuel', initPct: 51.75, initVol: 51.75, finalPct: 16.08, finalVol: 16.08, fillCount: 0, fillVol: 0, deductCount: 1, deductVol: 11.7, usage: 23.98, km: 336.16, driveTime: '10:48:00', idleTime: '13:12:00', actualEff: 14.02, stdEff: 3, status: 'Efisien' },
    { date: '10 Okt 2023', plate: 'DemoFuel', initPct: 16.08, initVol: 16.08, finalPct: 51.75, finalVol: 51.75, fillCount: 1, fillVol: 79.53, deductCount: 1, deductVol: 7.31, usage: 36.55, km: 311.76, driveTime: '13:35:00', idleTime: '10:25:00', actualEff: 8.53, stdEff: 3, status: 'Efisien' },
    { date: '11 Okt 2023', plate: 'DemoFuel', initPct: 51.75, initVol: 51.75, finalPct: 16.08, finalVol: 16.08, fillCount: 0, fillVol: 0, deductCount: 1, deductVol: 11.7, usage: 23.98, km: 336.16, driveTime: '10:48:00', idleTime: '13:12:00', actualEff: 14.02, stdEff: 3, status: 'Efisien' },
    { date: '09 Okt 2023', plate: 'DemoFuel2', initPct: 45.98, initVol: 32.18, finalPct: 45.98, finalVol: 32.18, fillCount: 1, fillVol: 18.4, deductCount: 0, deductVol: 0, usage: 18.4, km: 150.79, driveTime: '05:18:00', idleTime: '18:42:00', actualEff: 8.19, stdEff: 13, status: 'Tidak Efisien' },
    { date: '10 Okt 2023', plate: 'DemoFuel2', initPct: 45.98, initVol: 32.18, finalPct: 45.98, finalVol: 32.18, fillCount: 1, fillVol: 18.4, deductCount: 0, deductVol: 0, usage: 18.4, km: 150.79, driveTime: '05:18:00', idleTime: '18:42:00', actualEff: 8.0, stdEff: 13, status: 'Tidak Efisien' },
    { date: '09 Okt 2023', plate: 'DemoFuel3', initPct: 36.93, initVol: 36.93, finalPct: 39.32, finalVol: 39.32, fillCount: 1, fillVol: 8.62, deductCount: 1, deductVol: 6.23, usage: 18.09, km: 342.39, driveTime: '00:37:00', idleTime: '23:23:00', actualEff: 2.1, stdEff: 2, status: 'Efisien' },
    { date: '10 Okt 2023', plate: 'DemoFuel3', initPct: 39.32, initVol: 39.32, finalPct: 36.93, finalVol: 36.93, fillCount: 2, fillVol: 33.03, deductCount: 1, deductVol: 14.83, usage: 20.6, km: 342.39, driveTime: '10:54:00', idleTime: '13:06:00', actualEff: 16.0, stdEff: 2, status: 'Efisien' },
];

// --- Helper: Grade Badge ---
const gradeColors: Record<ScoreGrade, string> = {
    A: 'bg-emerald-500 text-white',
    B: 'bg-green-500 text-white',
    C: 'bg-orange-400 text-white',
    D: 'bg-orange-600 text-white',
    E: 'bg-red-500 text-white',
};

const GradeBadge: React.FC<{ grade: ScoreGrade; size?: 'sm' | 'md' | 'lg' }> = ({ grade, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-14 h-14 text-2xl',
    };
    return (
        <div className={`rounded-full font-black flex items-center justify-center flex-shrink-0 ${gradeColors[grade]} ${sizeClasses[size]} shadow-sm`}>
            {grade}
        </div>
    );
};

// --- Helper: Avatar Icon ---
const DriverAvatar: React.FC<{ isWorst?: boolean; size?: 'sm' | 'lg' }> = ({ isWorst = false, size = 'sm' }) => {
    const sizeClass = size === 'lg' ? 'w-20 h-20' : 'w-8 h-8';
    const iconSize = size === 'lg' ? 'w-10 h-10' : 'w-4 h-4';
    const color = isWorst ? 'text-red-400 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-500/10' : 'text-blue-500 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-500/10';
    return (
        <div className={`${sizeClass} rounded-full border-2 ${color} flex items-center justify-center flex-shrink-0`}>
            {isWorst ? <UserX className={iconSize} /> : <UserCheck className={iconSize} />}
        </div>
    );
};

// --- Sub-components ---
const SummaryCard: React.FC<{ label: string; value: string; unit: string; icon: React.ElementType; color: string; bg: string }> = ({ label, value, unit, icon: Icon, color, bg }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-200">
        <div className={`p-3 rounded-xl ${bg} flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                {value} <span className="text-sm font-medium text-slate-400">{unit}</span>
            </p>
        </div>
    </div>
);

// --- Driver Score Detail Panel ---
const DriverDetailPanel: React.FC<{ driver: Driver; onBack: () => void }> = ({ driver, onBack }) => (
    <div className="bg-slate-50 dark:bg-slate-950 flex-1 flex items-center justify-center animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm w-[340px] overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Detail Skor Pengemudi</h2>
            </div>
            {/* Back Button */}
            <div className="px-5 pt-5">
                <button
                    onClick={onBack}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </button>
            </div>
            {/* Avatar & Name */}
            <div className="flex flex-col items-center py-8 gap-3">
                <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-200 dark:border-blue-700 flex items-center justify-center">
                    <UserCheck className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{driver.name}</h3>
            </div>
            {/* Total Distance */}
            <div className="mx-5 mb-4 p-5 border border-slate-100 dark:border-slate-800 rounded-2xl text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Perjalanan</p>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                    {driver.totalKm.toLocaleString('id-ID')} <span className="text-base font-medium text-slate-400">Km</span>
                </p>
            </div>
            {/* Score Card */}
            <div className="mx-5 mb-6 p-5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl">
                <p className="text-sm text-center text-slate-600 dark:text-slate-400 mb-3 font-medium">Skor Pengemudi</p>
                <div className="flex items-center divide-x divide-emerald-200 dark:divide-emerald-500/30">
                    <div className="flex-1 flex flex-col items-center gap-1">
                        <p className="text-4xl font-black text-slate-800 dark:text-slate-100">{driver.score.toFixed(2)}</p>
                        <p className="text-xs font-semibold text-slate-500">Total Skor</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1">
                        <GradeBadge grade={driver.grade} size="lg" />
                        <p className="text-xs font-semibold text-slate-500">Indeks Skor</p>
                    </div>
                </div>
            </div>
            {/* Extra Stats */}
            <div className="px-5 pb-6 grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{driver.trips}</p>
                    <p className="text-xs text-slate-500">Total Trip</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-orange-500">{driver.alerts}</p>
                    <p className="text-xs text-slate-500">Peringatan</p>
                </div>
            </div>
        </div>
    </div>
);

// --- Leaderboard Panel ---
const LeaderboardPanel: React.FC<{
    title: string;
    subtitle: string;
    drivers: Driver[];
    isWorst?: boolean;
    onSelectDriver: (d: Driver) => void;
}> = ({ title, subtitle, drivers, isWorst = false, onSelectDriver }) => {
    const [topDriver, ...rest] = drivers;
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col">
            <div className="mb-5">
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{title}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
            </div>
            {/* Top Driver */}
            <button
                onClick={() => onSelectDriver(topDriver)}
                className="flex flex-col items-center mb-5 group hover:opacity-90 transition-opacity"
            >
                <DriverAvatar isWorst={isWorst} size="lg" />
                <div className="flex items-center gap-2 mt-3">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{topDriver.name}</span>
                    <GradeBadge grade={topDriver.grade} size="sm" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">{topDriver.score}</span>
                </div>
            </button>
            {/* Others */}
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800 flex-1">
                {rest.map((d) => (
                    <button
                        key={d.id}
                        onClick={() => onSelectDriver(d)}
                        className="flex items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 -mx-2 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <DriverAvatar isWorst={isWorst} />
                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">{d.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <GradeBadge grade={d.grade} size="sm" />
                            <span className="font-bold text-sm text-slate-600 dark:text-slate-300 w-6 text-right">{d.score}</span>
                        </div>
                    </button>
                ))}
            </div>
            <button className="mt-5 w-full py-2.5 bg-[#1a3b6e] hover:bg-[#1a3b6e]/90 text-white rounded-xl text-sm font-bold transition-colors">
                Lihat Lebih Banyak
            </button>
        </div>
    );
};

// --- Distance Chart with Tooltip ---
const DistanceChart: React.FC<{ data: typeof weeklyData; target: number }> = ({ data, target }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; item: typeof weeklyData[0] } | null>(null);
    const [editTarget, setEditTarget] = useState(false);
    const [targetVal, setTargetVal] = useState(target);

    const maxKm = Math.max(...data.map(d => d.km), targetVal) + 100;
    const minKm = 150;
    const range = maxKm - minKm;
    const chartH = 220;
    const chartW = 100; // percentage
    const pad = { top: 20, right: 20, bottom: 20, left: 0 };

    const toY = (km: number) => pad.top + ((maxKm - km) / range) * (chartH - pad.top - pad.bottom);
    const toX = (i: number) => (i / (data.length - 1)) * 100;

    const points = data.map((d, i) => ({ x: toX(i), y: toY(d.km), data: d }));
    const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
    const areaD = `${pathD} L100,${chartH - pad.bottom} L0,${chartH - pad.bottom} Z`;
    const targetY = toY(targetVal);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-1">
                <div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Total Jarak Mengemudi</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">7 Hari Terakhir</p>
                </div>
                <button
                    onClick={() => setEditTarget(!editTarget)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-300 dark:border-emerald-600 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                >
                    <Target className="w-3.5 h-3.5" />
                    Atur Target
                </button>
            </div>
            {editTarget && (
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-500">Target (Km):</span>
                    <input
                        type="number"
                        value={targetVal}
                        onChange={e => setTargetVal(Number(e.target.value))}
                        className="w-24 px-2 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <button onClick={() => setEditTarget(false)} className="text-xs px-2 py-1 bg-emerald-500 text-white rounded-lg font-semibold">OK</button>
                </div>
            )}

            {/* Legend */}
            <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-2.5 rounded bg-blue-400 opacity-40" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Total Jarak Mengemudi</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0.5 bg-orange-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Target</span>
                </div>
            </div>

            {/* Chart */}
            <div className="relative" style={{ height: `${chartH}px` }}>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-slate-400 pr-2 pointer-events-none" style={{ width: '44px' }}>
                    {[650, 550, 450, 350, 250].map(v => (
                        <span key={v}>{v}</span>
                    ))}
                </div>

                <div className="absolute left-12 right-0 top-0 bottom-0">
                    <svg className="w-full h-full overflow-visible" viewBox={`0 0 100 ${chartH}`} preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[0.2, 0.4, 0.6, 0.8].map(f => (
                            <line key={f} x1="0" y1={pad.top + f * (chartH - pad.top - pad.bottom)} x2="100" y2={pad.top + f * (chartH - pad.top - pad.bottom)} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3,3" />
                        ))}

                        {/* Area fill */}
                        <path d={areaD} fill="url(#areaGrad)" />

                        {/* Line */}
                        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Target line */}
                        <line x1="0" y1={targetY} x2="100" y2={targetY} stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3" />

                        {/* Data points + hover zones */}
                        {points.map((p, i) => (
                            <g key={i}>
                                <circle cx={p.x} cy={p.y} r="1.5" fill="#3b82f6" stroke="white" strokeWidth="0.8" />
                                <rect
                                    x={p.x - 8} y={0} width={16} height={chartH}
                                    fill="transparent"
                                    onMouseEnter={(e) => {
                                        const rect = (e.target as SVGElement).closest('svg')!.getBoundingClientRect();
                                        setTooltip({ x: p.x, y: p.y, item: p.data });
                                    }}
                                    onMouseLeave={() => setTooltip(null)}
                                    style={{ cursor: 'crosshair' }}
                                />
                            </g>
                        ))}
                    </svg>

                    {/* Tooltip */}
                    {tooltip && (
                        <div
                            className="absolute z-10 bg-slate-800 dark:bg-slate-700 text-white rounded-xl px-3 py-2 shadow-lg text-xs pointer-events-none"
                            style={{
                                left: `calc(${tooltip.x}% - 60px)`,
                                top: `${(tooltip.y / chartH) * 100 - 35}%`,
                                minWidth: '130px'
                            }}
                        >
                            <p className="font-bold mb-1">{tooltip.item.day}</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                                <span>Total Jarak : <strong>{tooltip.item.km} Km</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                                <span>Target : <strong>{targetVal} Km</strong></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-12 right-0 flex justify-between text-[10px] text-slate-400 pt-1">
                    {data.map(d => <span key={d.day}>{d.day.split(' ')[0]} {d.day.split(' ')[1]}</span>)}
                </div>
            </div>

            {/* Y-axis title */}
            <p className="text-[10px] text-slate-400 mt-2">Total Jarak (Km)</p>
        </div>
    );
};

// --- Fuel Table ---
const FuelTable: React.FC = () => {
    const [filterPlate, setFilterPlate] = useState('Semua');
    const plates = ['Semua', ...Array.from(new Set(fuelData.map(r => r.plate)))];
    const filtered = filterPlate === 'Semua' ? fuelData : fuelData.filter(r => r.plate === filterPlate);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Detail Efisiensi BBM Armada</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Data rincian konsumsi bahan bakar per unit kendaraan</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Filter Kendaraan:</span>
                    <select
                        value={filterPlate}
                        onChange={e => setFilterPlate(e.target.value)}
                        className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#325a6c]/50"
                    >
                        {plates.map(p => <option key={p}>{p}</option>)}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Tanggal</th>
                            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Plat Nomor</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Awal %</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Awal Vol(L)</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Akhir %</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Akhir Vol(L)</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Pengisian #</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Pengisian Vol(L)</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Kurang #</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Kurang Vol(L)</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Penggunaan(L)</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Jarak(Km)</th>
                            <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Durasi Tempuh</th>
                            <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Durasi Diam</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Eff. Aktual</th>
                            <th className="px-4 py-3 text-right font-semibold whitespace-nowrap">Eff. Standar</th>
                            <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filtered.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{row.date}</td>
                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">{row.plate}</td>
                                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.initPct}</td>
                                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.initVol}</td>
                                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.finalPct}</td>
                                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.finalVol}</td>
                                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.fillCount}</td>
                                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.fillVol}</td>
                                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.deductCount}</td>
                                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.deductVol}</td>
                                <td className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">{row.usage}</td>
                                <td className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">{row.km}</td>
                                <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-mono">{row.driveTime}</td>
                                <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-mono">{row.idleTime}</td>
                                <td className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">{row.actualEff}</td>
                                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{row.stdEff}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${row.status === 'Efisien' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20'}`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Main Component ---
export const LaporanBos: React.FC = () => {
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [period, setPeriod] = useState<'Hari Ini' | 'Minggu Ini' | 'Bulan Ini'>('Bulan Ini');

    if (selectedDriver) {
        return (
            <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
                <DriverDetailPanel driver={selectedDriver} onBack={() => setSelectedDriver(null)} />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="p-6 max-w-screen-2xl mx-auto space-y-6">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            Laporan Monitoring Pengemudi
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Ringkasan hasil monitoring untuk supervisor & bos</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {(['Hari Ini', 'Minggu Ini', 'Bulan Ini'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${period === p ? 'bg-[#1a3b6e] text-white border-[#1a3b6e] shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                {p}
                            </button>
                        ))}
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard label="Total Jarak Armada" value="18,245" unit="km" icon={Navigation} color="text-blue-600" bg="bg-blue-50 dark:bg-blue-500/10" />
                    <SummaryCard label="Skor Rata-rata" value="72.4" unit="/ 100" icon={Star} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-500/10" />
                    <SummaryCard label="Pengemudi Aktif" value="12" unit="unit" icon={Users} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-500/10" />
                    <SummaryCard label="Total Peringatan" value="48" unit="kejadian" icon={AlertTriangle} color="text-rose-600" bg="bg-rose-50 dark:bg-rose-500/10" />
                </div>

                {/* Leaderboards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LeaderboardPanel
                        title="Pengemudi Terbaik"
                        subtitle={`5 Data Teratas Di ${period}.`}
                        drivers={topDrivers}
                        onSelectDriver={setSelectedDriver}
                    />
                    <LeaderboardPanel
                        title="Pengemudi Terburuk"
                        subtitle={`5 Data Terendah Di ${period}.`}
                        drivers={worstDrivers}
                        isWorst
                        onSelectDriver={setSelectedDriver}
                    />
                </div>

                {/* Distance Chart */}
                <DistanceChart data={weeklyData} target={500} />

                {/* Fuel Table */}
                <FuelTable />

            </div>
        </div>
    );
};
