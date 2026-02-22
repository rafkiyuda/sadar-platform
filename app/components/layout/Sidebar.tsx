import { Home, Layers, Settings, Power, FileText } from 'lucide-react';

interface SidebarProps {
    onSettingsClick: () => void;
    onViewChange: (view: 'dashboard' | 'report' | 'settings') => void;
    currentView: 'dashboard' | 'report' | 'settings';
}

export const Sidebar: React.FC<SidebarProps> = ({ onSettingsClick, onViewChange, currentView }) => {
    return (
        <div className="w-24 bg-white border-r border-slate-100 shadow-sm flex flex-col items-center py-8 gap-8 shrink-0 relative z-20 h-full">
            <div className="text-orange-600 mb-4 bg-orange-50 p-3 rounded-2xl shadow-sm">
                <Layers className="w-8 h-8" />
            </div>

            <nav className="flex-1 flex flex-col gap-4 w-full px-3">
                <button
                    onClick={() => onViewChange('dashboard')}
                    className={`p-3 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all duration-200 ${currentView === 'dashboard' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-semibold">Beranda</span>
                </button>

                <button
                    onClick={() => onViewChange('report')}
                    className={`p-3 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all duration-200 ${currentView === 'report' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <FileText className="w-6 h-6" />
                    <span className="text-[10px] font-semibold">Laporan</span>
                </button>

                <button
                    onClick={() => onViewChange('settings')}
                    className={`p-3 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all duration-200 ${currentView === 'settings' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-semibold">Pengaturan</span>
                </button>
            </nav>

            <button className="p-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl flex flex-col justify-center items-center gap-1 transition-all duration-200 mb-4">
                <Power className="w-6 h-6" />
                <span className="text-[10px] font-semibold">Keluar</span>
            </button>
        </div>
    );
};
