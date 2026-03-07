export type DriverStatus = 'ALERT' | 'DROWSY' | 'CRITICAL' | 'NO_FACE';
export type AiMood = 'friendly' | 'formal' | 'alert';
export type CameraMode = 'single' | 'dual';

export interface AlarmSetting {
    enabled: boolean;
    time?: string;
    condition?: string;
}

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
    baselineEar: number | null; // Calibrated natural EAR
    lastAlertTimestamp: number;
    emergencyContact?: string; // Optional initially
    tripStats: TripStats; // New trip stats
    aiSensitivity: number; // Sensitivity from 1 (Strict) to 10 (Lenient)

    // New Features
    aiMood: AiMood;
    alarmSettings: AlarmSetting;
    cameraMode: CameraMode;

    setStatus: (status: DriverStatus) => void;
    setEAR: (ear: number) => void;
    setBaselineEar: (ear: number) => void;
    setIsMonitoring: (isMonitoring: boolean) => void;
    triggerAlert: () => void;
    setEmergencyContact: (contact: string) => void;
    setAiSensitivity: (sensitivity: number) => void;

    // New actions for trip reporting
    incrementDistance: (amount: number) => void;
    incrementDrowsyCount: () => void;
    incrementCallDuration: (seconds: number) => void;
    resetTrip: () => void;

    // New actions for Features
    setAiMood: (mood: AiMood) => void;
    setAlarmSettings: (settings: AlarmSetting) => void;
    setCameraMode: (mode: CameraMode) => void;
}

