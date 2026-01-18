export type DriverStatus = 'ALERT' | 'DROWSY' | 'CRITICAL' | 'NO_FACE';

export interface DrowsinessEvent {
    status: DriverStatus;
    timestamp: number;
    ear?: number;
    confidence?: number;
}

export interface TripStats {
    distance: number;
    drowsyCount: number;
    callDuration: number;
}

export interface DriverState {
    status: DriverStatus;
    isMonitoring: boolean;
    ear: number; // Current Eye Aspect Ratio
    lastAlertTimestamp: number;
    emergencyContact?: string; // Optional initially
    tripStats: TripStats; // New trip stats

    setStatus: (status: DriverStatus) => void;
    setEAR: (ear: number) => void;
    setIsMonitoring: (isMonitoring: boolean) => void;
    triggerAlert: () => void;
    setEmergencyContact: (contact: string) => void;

    // New actions for trip reporting
    incrementDistance: (amount: number) => void;
    incrementDrowsyCount: () => void;
    incrementCallDuration: (seconds: number) => void;
    resetTrip: () => void;
}

