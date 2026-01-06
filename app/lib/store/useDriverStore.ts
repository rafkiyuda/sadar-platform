import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DriverState, DriverStatus } from '@/app/types';

export const useDriverStore = create<DriverState>()(
    persist(
        (set) => ({
            status: 'NO_FACE', // Default state
            isMonitoring: false,
            ear: 0,
            lastAlertTimestamp: 0,
            emergencyContact: '',

            setStatus: (status: DriverStatus) => set({ status }),
            setEAR: (ear: number) => set({ ear }),
            setIsMonitoring: (isMonitoring: boolean) => set({ isMonitoring }),

            triggerAlert: () => set({ lastAlertTimestamp: Date.now() }),
            setEmergencyContact: (contact: string) => set({ emergencyContact: contact }),
        }),
        {
            name: 'sadar-storage', // unique name
            partialize: (state) => ({ emergencyContact: state.emergencyContact }), // only persist settings
        }
    )
);
