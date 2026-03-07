import React, { useState, useEffect } from 'react';
import { Save, Phone, Shield, User, Bell, Eye, Clock, Smile, Layout } from 'lucide-react';
import { useDriverStore } from '@/app/lib/store/useDriverStore';
import { AiMood, AlarmSetting, CameraMode } from '@/app/types';

export const SettingsView: React.FC = () => {
    const {
        emergencyContact, setEmergencyContact,
        aiSensitivity, setAiSensitivity,
        aiMood, setAiMood,
        alarmSettings, setAlarmSettings,
        cameraMode, setCameraMode
    } = useDriverStore();

    const [tempContact, setTempContact] = useState('');
    const [tempSensitivity, setTempSensitivity] = useState(5);
    const [tempMood, setTempMood] = useState<AiMood>('friendly');
    const [tempAlarm, setTempAlarm] = useState<AlarmSetting>({ enabled: false, time: '', condition: '' });
    const [tempCameraMode, setTempCameraMode] = useState<CameraMode>('dual');

    const [activeTab, setActiveTab] = useState<'emergency' | 'ai' | 'alarm' | 'mood'>('emergency');
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        setTempContact(emergencyContact || '');
        setTempSensitivity(aiSensitivity || 5);
        setTempMood(aiMood || 'friendly');
        setTempAlarm(alarmSettings || { enabled: false, time: '', condition: '' });
        setTempCameraMode(cameraMode || 'dual');
    }, [emergencyContact, aiSensitivity, aiMood, alarmSettings, cameraMode]);

    const handleSave = () => {
        setEmergencyContact(tempContact);
        setAiSensitivity(tempSensitivity);
        setAiMood(tempMood);
        setAlarmSettings(tempAlarm);
        setCameraMode(tempCameraMode);
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
                        onClick={() => setActiveTab('ai')}
                        className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'ai' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Eye className="w-4 h-4" />
                        AI Vision
                    </button>

                    <button
                        onClick={() => setActiveTab('alarm')}
                        className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'alarm' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Clock className="w-4 h-4" />
                        Alarm Setting
                    </button>

                    <button
                        onClick={() => setActiveTab('mood')}
                        className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'mood' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Smile className="w-4 h-4" />
                        AI Mood
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

                    {activeTab === 'ai' && (
                        <div className="flex flex-col h-full animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className="mb-8">
                                <h4 className="text-3xl font-bold text-white mb-3">AI Vision Sensitivity</h4>
                                <p className="text-slate-400">
                                    Adjust how strictly the AI detects drowsiness. Lower values are stricter, higher values are more lenient. Useful for different eye shapes.
                                </p>
                            </div>

                            <div className="flex-1 space-y-8">
                                <div className="group max-w-xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                                            Sensitivity Level: <span className="text-white text-base ml-2">{tempSensitivity}</span>
                                        </label>
                                        <span className="text-xs text-slate-500 font-medium">{tempSensitivity <= 3 ? 'Stricter' : tempSensitivity >= 8 ? 'More Lenient' : 'Balanced'}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={tempSensitivity}
                                        onChange={(e) => setTempSensitivity(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 border border-slate-700 focus:outline-none"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
                                        <span>Highly Sensitive (1)</span>
                                        <span>Balanced (5)</span>
                                        <span>Lenient Calibration (10)</span>
                                    </div>
                                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                        <p className="text-sm text-blue-200/80 leading-relaxed">
                                            <strong>Pro Tip:</strong> If you naturally have narrower eyes and the AI triggers too frequently, try increasing the leniency level towards 8-10.
                                        </p>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-white/5">
                                        <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">
                                            Camera View Mode
                                        </label>
                                        <div className="grid grid-cols-2 gap-4 max-w-md">
                                            <button
                                                onClick={() => setTempCameraMode('single')}
                                                className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${tempCameraMode === 'single' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'}`}
                                            >
                                                Driver Only (Single)
                                            </button>
                                            <button
                                                onClick={() => setTempCameraMode('dual')}
                                                className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${tempCameraMode === 'dual' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'}`}
                                            >
                                                Road + Driver (Dual)
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-2">
                                            Dual mode allows you to see both the road and your face simultaneously.
                                        </p>
                                    </div>
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

                    {activeTab === 'alarm' && (
                        <div className="flex flex-col h-full animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className="mb-8">
                                <h4 className="text-3xl font-bold text-white mb-3">Alarm Setting</h4>
                                <p className="text-slate-400">
                                    Set up alerts based on time or specific conditions during your trip.
                                </p>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <button
                                        onClick={() => setTempAlarm({ ...tempAlarm, enabled: !tempAlarm.enabled })}
                                        className={`w-12 h-6 rounded-full transition-all relative ${tempAlarm.enabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${tempAlarm.enabled ? 'left-7' : 'left-1'}`} />
                                    </button>
                                    <span className="text-sm font-medium text-white">Enable Alarm</span>
                                </div>

                                <div className={`space-y-6 transition-opacity ${tempAlarm.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                    <div className="max-w-xs">
                                        <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                                            Alarm Time
                                        </label>
                                        <input
                                            type="time"
                                            value={tempAlarm.time || ''}
                                            onChange={(e) => setTempAlarm({ ...tempAlarm, time: e.target.value })}
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                                            Condition / Trigger (Manual or Voice AI)
                                        </label>
                                        <textarea
                                            value={tempAlarm.condition || ''}
                                            onChange={(e) => setTempAlarm({ ...tempAlarm, condition: e.target.value })}
                                            placeholder="e.g. Bangunkan saya jika saya terlihat sangat mengantuk"
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all h-24 resize-none"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-2">
                                            * You can also set this via Live Call AI directions.
                                        </p>
                                    </div>
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

                    {activeTab === 'mood' && (
                        <div className="flex flex-col h-full animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className="mb-8">
                                <h4 className="text-3xl font-bold text-white mb-3">AI Mood Personalization</h4>
                                <p className="text-slate-400">
                                    Customize how the AI communicates with you during your trip.
                                </p>
                            </div>

                            <div className="flex-1 space-y-4">
                                <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">
                                    Select Communication Style
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { id: 'friendly', label: 'Friendly', desc: 'Warm and conversational' },
                                        { id: 'formal', label: 'Formal', desc: 'Polite and professional' },
                                        { id: 'alert', label: 'Alert', desc: 'Direct and focus-oriented' }
                                    ].map((mood) => (
                                        <button
                                            key={mood.id}
                                            onClick={() => setTempMood(mood.id as AiMood)}
                                            className={`p-4 rounded-xl border transition-all text-left ${tempMood === mood.id
                                                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-600/10'
                                                : 'bg-slate-950/30 border-white/5 text-slate-400 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="font-bold mb-1">{mood.label}</div>
                                            <div className="text-[11px] opacity-60">{mood.desc}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                    <p className="text-sm text-indigo-200/80 leading-relaxed">
                                        <strong>Note:</strong> Gaya komunikasi ini akan diterapkan saat Anda menggunakan fitur Live Call AI. Ini juga bisa diubah langsung melalui suara saat panggilan aktif.
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
