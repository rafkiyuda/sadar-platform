export const EAR_THRESHOLD_DROWSY = 0.25;
export const EAR_THRESHOLD_CRITICAL = 0.20;
export const TIME_WINDOW_MS = 2000; // Window to confirm drowsiness
export const BLINK_IGNORE_MS = 300; // Ignore blinks shorter than this

export const STATUS_COLORS = {
    ALERT: 'bg-green-500',
    DROWSY: 'bg-yellow-500',
    CRITICAL: 'bg-red-600',
    NO_FACE: 'bg-gray-500',
};

export const STATUS_MESSAGES = {
    ALERT: 'Driver is Alert. Safe driving.',
    DROWSY: 'Drowsiness Detected. Stay focused.',
    CRITICAL: 'CRITICAL FATIGUE. PULL OVER NOW!',
    NO_FACE: 'Face not detected. Adjust camera.',
};
