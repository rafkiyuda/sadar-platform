import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DriverState, DriverStatus, AiMood, AlarmSetting, CameraMode } from '@/app/types';

// Extend the interface locally if I can't access types.ts, OR I should request to see types.ts first.
// Wait, I should update types.ts first to be safe.


export const useDriverStore = create<DriverState>()(
    persist(
        (set) => ({
            status: 'NO_FACE', // Default state
            isMonitoring: false,
            ear: 0,
            baselineEar: null,
            lastAlertTimestamp: 0,
            emergencyContact: '',

            tripStats: {
                distance: 0,
                drowsyCount: 0,
                callDuration: 0,
            },
            aiSensitivity: 5, // Default sensitivity (1-10)
            aiMood: 'friendly', // Default mood
            alarmSettings: { enabled: false }, // Default alarm
            cameraMode: 'dual', // Default camera mode
            currentAddress: null, // Initial location
            currentCoords: null, // Initial coordinates

            setStatus: (status: DriverStatus) => set({ status }),
            setEAR: (ear: number) => set({ ear }),
            setBaselineEar: (ear: number) => set({ baselineEar: ear }),
            setIsMonitoring: (isMonitoring: boolean) => set({ isMonitoring }),
            setAiSensitivity: (sensitivity: number) => set({ aiSensitivity: sensitivity }),

            triggerAlert: () => set({ lastAlertTimestamp: Date.now() }),
            setEmergencyContact: (contact: string) => set({ emergencyContact: contact }),

            setAiMood: (mood: AiMood) => set({ aiMood: mood }),
            setAlarmSettings: (settings: AlarmSetting) => set({ alarmSettings: settings }),
            setCameraMode: (mode: CameraMode) => set({ cameraMode: mode }),
            setCurrentAddress: (address: string | null) => set({ currentAddress: address }),
            setCurrentCoords: (coords: { lat: number; lng: number } | null) => set({ currentCoords: coords }),

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
                tripStats: state.tripStats, // persist trip stats too
                aiMood: state.aiMood,
                alarmSettings: state.alarmSettings,
                cameraMode: state.cameraMode,
            }),
        }
    )
);

