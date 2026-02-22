import React, { useEffect, useState } from 'react';
import { ScanFace, CheckCircle2 } from 'lucide-react';

interface CalibrationViewProps {
    onComplete: () => void;
}

export const CalibrationView: React.FC<CalibrationViewProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('Menyiapkan pemindai...');

    useEffect(() => {
        const stages = [
            { time: 500, text: 'Memindai struktur wajah...', progress: 25 },
            { time: 1500, text: 'Menganalisis baseline mata...', progress: 60 },
            { time: 2500, text: 'Menyimpan profil kalibrasi...', progress: 90 },
            { time: 3000, text: 'Kalibrasi Selesai!', progress: 100 }
        ];

        let timeouts: NodeJS.Timeout[] = [];

        stages.forEach(stage => {
            timeouts.push(setTimeout(() => {
                setStatusText(stage.text);
                setProgress(stage.progress);
                if (stage.progress === 100) {
                    setTimeout(onComplete, 800);
                }
            }, stage.time));
        });

        return () => timeouts.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#fafaf9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-center relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl max-w-sm w-full">
                <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                    {/* Scanning box */}
                    <div className="absolute inset-0 border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl"></div>

                    {/* Scanning line animation */}
                    <div
                        className="absolute left-0 w-full h-1 bg-blue-500 blur-[1px] shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-300 ease-linear rounded-full"
                        style={{ top: `${progress}%`, transition: progress === 100 ? 'none' : 'top 0.3s ease-out', opacity: progress === 100 ? 0 : 1 }}
                    ></div>

                    {progress === 100 ? (
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-in zoom-in duration-300" />
                    ) : (
                        <ScanFace className="w-16 h-16 text-slate-400 dark:text-slate-500 animate-pulse" />
                    )}
                </div>

                <h2 className="text-xl font-bold mb-2 text-[#325a6c] dark:text-white transition-colors">Kalibrasi Detektor</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 h-5 transition-all">{statusText}</p>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};
