import { Home, Layers, Settings, Power, FileText } from 'lucide-react';

interface SidebarProps {
    onSettingsClick: () => void; // Deprecated, but keeping for compatibility if needed, though we will verify usage.
    onViewChange: (view: 'dashboard' | 'report' | 'settings') => void;
    currentView: 'dashboard' | 'report' | 'settings';
}

export const Sidebar: React.FC<SidebarProps> = ({ onSettingsClick, onViewChange, currentView }) => {
    return (
        <div className="w-20 bg-slate-950 border-r border-white/5 flex flex-col items-center py-8 gap-8 shrink-0 relative z-20">
            <div className="text-blue-500 mb-4">
                <Layers className="w-8 h-8" />
            </div>

            <nav className="flex-1 flex flex-col gap-6 w-full px-2">
                <button
                    onClick={() => onViewChange('dashboard')}
                    className={`p-4 rounded-xl flex justify-center items-center transition ${currentView === 'dashboard' ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/40' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                    <Home className="w-6 h-6" />
                </button>

                <button
                    onClick={() => onViewChange('report')}
                    className={`p-4 rounded-xl flex justify-center items-center transition ${currentView === 'report' ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/40' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                    <FileText className="w-6 h-6" />
                </button>

                <button
                    onClick={() => onViewChange('settings')}
                    className={`p-4 rounded-xl flex justify-center items-center transition ${currentView === 'settings' ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/40' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
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
