import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DriverState, DriverStatus } from '@/app/types';

// Extend the interface locally if I can't access types.ts, OR I should request to see types.ts first.
// Wait, I should update types.ts first to be safe.


export const useDriverStore = create<DriverState>()(
    persist(
        (set) => ({
            status: 'NO_FACE', // Default state
            isMonitoring: false,
            ear: 0,
            lastAlertTimestamp: 0,
            emergencyContact: '',

            tripStats: {
                distance: 0,
                drowsyCount: 0,
                callDuration: 0,
            },

            setStatus: (status: DriverStatus) => set({ status }),
            setEAR: (ear: number) => set({ ear }),
            setIsMonitoring: (isMonitoring: boolean) => set({ isMonitoring }),

            triggerAlert: () => set({ lastAlertTimestamp: Date.now() }),
            setEmergencyContact: (contact: string) => set({ emergencyContact: contact }),

            incrementDistance: (amount: number) =>
                set((state) => ({
                    tripStats: {
                        ...state.tripStats,
                        distance: state.tripStats.distance + amount,
                    },
                })),
            incrementDrowsyCount: () =>
                set((state) => ({
                    tripStats: {
                        ...state.tripStats,
                        drowsyCount: state.tripStats.drowsyCount + 1,
                    },
                })),
            incrementCallDuration: (seconds: number) =>
                set((state) => ({
                    tripStats: {
                        ...state.tripStats,
                        callDuration: state.tripStats.callDuration + seconds,
                    },
                })),
            resetTrip: () =>
                set({
                    tripStats: {
                        distance: 0,
                        drowsyCount: 0,
                        callDuration: 0,
                    },
                }),
        }),
        {
            name: 'sadar-storage', // unique name
            partialize: (state) => ({
                emergencyContact: state.emergencyContact,
                tripStats: state.tripStats // persist trip stats too
            }),
        }
    )
);

