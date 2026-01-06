export type DriverStatus = 'ALERT' | 'DROWSY' | 'CRITICAL' | 'NO_FACE';

export interface DrowsinessEvent {
    status: DriverStatus;
    timestamp: number;
    ear?: number;
    confidence?: number;
}

export interface DriverState {
    status: DriverStatus;
    isMonitoring: boolean;
    ear: number; // Current Eye Aspect Ratio
    lastAlertTimestamp: number;
    emergencyContact?: string; // Optional initially
    setStatus: (status: DriverStatus) => void;
    setEAR: (ear: number) => void;
    setIsMonitoring: (isMonitoring: boolean) => void;
    triggerAlert: () => void;
    setEmergencyContact: (contact: string) => void;
}
