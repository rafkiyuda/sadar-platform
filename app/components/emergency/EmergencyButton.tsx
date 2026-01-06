import React, { useState } from 'react';
import { Phone, AlertTriangle, Edit2 } from 'lucide-react';
import { useDriverStore } from '@/app/lib/store/useDriverStore';

interface EmergencyButtonProps {
    onEditContact: () => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onEditContact }) => {
    const [showModal, setShowModal] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const { emergencyContact } = useDriverStore();
    const contactNumber = emergencyContact || "Emergency Services";

    const handleConfirm = async () => {
        setIsCalling(true);
        try {
            const response = await fetch('/api/emergency/trigger', {
                method: 'POST',
                body: JSON.stringify({ contact: contactNumber })
            });

            if (!response.ok) {
                throw new Error('Emergency call failed');
            }

            // Mock delay for UI feedback
            setTimeout(() => {
                setIsCalling(false);
                setShowModal(false);
                alert(`Calling ${contactNumber}... (Call Dispatched)`);
            }, 2000);
        } catch (error) {
            console.error("Failed to trigger emergency", error);
            setIsCalling(false);
            alert("Failed to trigger emergency call. Please try again.");
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95"
            >
                <Phone className="w-6 h-6" />
                EMERGENCY SOS
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-gray-900 border border-red-500/50 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-red-500/20 p-4 rounded-full mb-4">
                                <AlertTriangle className="w-12 h-12 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Confirm SOS?</h3>
                            <p className="text-gray-400 mb-6 flex items-center justify-center gap-2">
                                Calling <span className="text-white font-bold">{contactNumber}</span>
                                <button
                                    onClick={() => { setShowModal(false); onEditContact(); }}
                                    className="text-blue-400 hover:text-blue-300 p-1"
                                    title="Edit Number"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </p>

                            <div className="flex w-full gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-gray-800 text-white rounded-lg font-semibold"
                                    disabled={isCalling}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold animate-pulse"
                                    disabled={isCalling}
                                >
                                    {isCalling ? "Calling..." : "CALL NOW"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
