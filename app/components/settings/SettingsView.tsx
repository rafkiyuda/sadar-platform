import React, { useState, useEffect } from 'react';
import { Save, Phone, Shield, User, Bell } from 'lucide-react';
import { useDriverStore } from '@/app/lib/store/useDriverStore';

export const SettingsView: React.FC = () => {
    const { emergencyContact, setEmergencyContact } = useDriverStore();
    const [tempContact, setTempContact] = useState('');
    const [activeTab, setActiveTab] = useState<'general' | 'emergency'>('emergency');
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        setTempContact(emergencyContact || '');
    }, [emergencyContact]);

    const handleSave = () => {
        setEmergencyContact(tempContact);
        setNotification('Settings saved successfully!');
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-slate-950 via-[#0f172a] to-[#1e3a8a]/20 flex flex-col items-center justify-center">

            <div className="bg-slate-900/50 border border-white/5 w-full max-w-4xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row min-h-[600px] backdrop-blur-md">

                {/* Visual Sidebar */}
                <div className="md:w-1/4 bg-slate-950/50 border-r border-white/5 p-6 flex flex-col gap-2">
                    <h3 className="text-xl font-extrabold text-white mb-6 tracking-tight flex items-center gap-2">
                        <span className="p-1.5 bg-blue-600 rounded-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </span>
                        Settings
                    </h3>

                    <button
                        onClick={() => setActiveTab('emergency')}
                        className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'emergency' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Phone className="w-4 h-4" />
                        Emergency Contact
                    </button>

                    <button
                        disabled
                        className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 text-slate-600 cursor-not-allowed group opacity-50"
                    >
                        <User className="w-4 h-4 group-hover:text-slate-500" />
                        Account
                    </button>

                    <button
                        disabled
                        className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 text-slate-600 cursor-not-allowed group opacity-50"
                    >
                        <Bell className="w-4 h-4 group-hover:text-slate-500" />
                        Notifications
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-10 relative flex flex-col">

                    {notification && (
                        <div className="absolute top-6 right-6 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-lg text-sm animate-in fade-in slide-in-from-top-2">
                            {notification}
                        </div>
                    )}

                    {activeTab === 'emergency' && (
                        <div className="flex flex-col h-full animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className="mb-8">
                                <h4 className="text-3xl font-bold text-white mb-3">Emergency Contact</h4>
                                <p className="text-slate-400">
                                    Set up a trusted contact to be notified when drowsy or in case of emergency.
                                </p>
                            </div>

                            <div className="flex-1 space-y-8">
                                <div className="group max-w-md">
                                    <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-300 transition-colors">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={tempContact}
                                            onChange={(e) => setTempContact(e.target.value)}
                                            placeholder="e.g. 08123456789"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 transition-all shadow-inner text-lg"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-2">
                                        <Shield className="w-3 h-3" />
                                        The number will be used for SMS alerts and emergency calls.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
