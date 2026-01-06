import React, { useState, useEffect } from 'react';
import { X, Save, Phone } from 'lucide-react';
import { useDriverStore } from '@/app/lib/store/useDriverStore';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { emergencyContact, setEmergencyContact } = useDriverStore();
    const [tempContact, setTempContact] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTempContact(emergencyContact || '');
        }
    }, [isOpen, emergencyContact]);

    const handleSave = () => {
        setEmergencyContact(tempContact);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-gray-900 border border-blue-500/30 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="bg-blue-600/20 p-2 rounded-lg"><Phone className="w-5 h-5 text-blue-400" /></span>
                    Settings
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Emergency Contact Number
                        </label>
                        <input
                            type="tel"
                            value={tempContact}
                            onChange={(e) => setTempContact(e.target.value)}
                            placeholder="e.g. 08123456789"
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            This number will be displayed when you trigger SOS.
                        </p>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 mt-4"
                    >
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
