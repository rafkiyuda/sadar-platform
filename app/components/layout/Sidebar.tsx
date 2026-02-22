'use client';
import { Home, Layers, Settings, Power, FileText, Sun, Moon, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface SidebarProps {
    onSettingsClick: () => void;
    onViewChange: (view: 'dashboard' | 'report' | 'settings' | 'chat') => void;
    currentView: 'dashboard' | 'report' | 'settings' | 'chat';
}

export const Sidebar: React.FC<SidebarProps> = ({ onSettingsClick, onViewChange, currentView }) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="w-24 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center py-8 gap-8 shrink-0 relative z-20 h-full transition-colors duration-300">
            <div className="text-orange-600 mb-4 bg-orange-50 dark:bg-orange-500/10 p-3 rounded-2xl shadow-sm">
                <Layers className="w-8 h-8" />
            </div>

            <nav className="flex-1 flex flex-col gap-4 w-full px-3">
                <button
                    onClick={() => onViewChange('dashboard')}
                    className={`p-3 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all duration-200 ${currentView === 'dashboard' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-semibold">Beranda</span>
                </button>

                <button
                    onClick={() => onViewChange('chat')}
                    className={`p-3 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all duration-200 ${currentView === 'chat' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-[10px] font-semibold">Chat</span>
                </button>

                <button
                    onClick={() => onViewChange('report')}
                    className={`p-3 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all duration-200 ${currentView === 'report' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    <FileText className="w-6 h-6" />
                    <span className="text-[10px] font-semibold">Laporan</span>
                </button>

                <button
                    onClick={() => onViewChange('settings')}
                    className={`p-3 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all duration-200 ${currentView === 'settings' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-semibold">Pengaturan</span>
                </button>
            </nav>

            <div className="flex flex-col gap-4 mb-4">
                {mounted && (
                    <button
                        onClick={toggleTheme}
                        className="p-3 text-slate-400 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all duration-200"
                    >
                        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        <span className="text-[10px] font-semibold">{theme === 'dark' ? 'Terang' : 'Gelap'}</span>
                    </button>
                )}

                <button className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all duration-200">
                    <Power className="w-6 h-6" />
                    <span className="text-[10px] font-semibold">Keluar</span>
                </button>
            </div>
        </div>
    );
};
