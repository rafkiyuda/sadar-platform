import React from 'react';
import { Home, Layers, Settings, Power } from 'lucide-react';

interface SidebarProps {
    onSettingsClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSettingsClick }) => {
    return (
        <div className="w-20 bg-slate-950 border-r border-white/5 flex flex-col items-center py-8 gap-8 shrink-0 relative z-20">
            <div className="text-blue-500 mb-4">
                <Layers className="w-8 h-8" />
            </div>

            <nav className="flex-1 flex flex-col gap-6 w-full px-2">
                <button className="p-4 bg-blue-600/20 text-blue-400 rounded-xl flex justify-center items-center transition hover:bg-blue-600/40">
                    <Home className="w-6 h-6" />
                </button>
                <button
                    onClick={onSettingsClick}
                    className="p-4 text-slate-400 hover:text-white rounded-xl flex justify-center items-center transition hover:bg-white/10"
                >
                    <Settings className="w-6 h-6" />
                </button>
            </nav>

            <button className="p-4 text-red-500 hover:bg-red-500/10 rounded-xl flex justify-center items-center transition mb-4">
                <Power className="w-6 h-6" />
            </button>
        </div>
    );
};
