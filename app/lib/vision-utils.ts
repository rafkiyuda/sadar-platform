// Landmark indices for MediaPipe Face Mesh
// Left eye indices: [33, 160, 158, 133, 153, 144]
// Right eye indices: [362, 385, 387, 263, 373, 380]
// EAR points:
// P1: 33 (left corner), P4: 133 (right corner)
// P2: 160, P6: 144
// P3: 158, P5: 153

export const LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144];
export const RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380];

interface Point {
    x: number;
    y: number;
    z: number;
}

// Euclidian distance between two 3D points
function distance(p1: Point, p2: Point) {
    return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2)
    );
}

// Calculate EAR for a single eye
export function calculateEyeAspectRatio(landmarks: Point[], indices: number[]) {
    // indices[0] is P1 (left c), indices[3] is P4 (right c)
    // indices[1] is P2, indices[5] is P6
    // indices[2] is P3, indices[4] is P5

    const p1 = landmarks[indices[0]];
    const p2 = landmarks[indices[1]];
    const p3 = landmarks[indices[2]];
    const p4 = landmarks[indices[3]];
    const p5 = landmarks[indices[4]];
    const p6 = landmarks[indices[5]];

    const vertical1 = distance(p2, p6);
    const vertical2 = distance(p3, p5);
    const horizontal = distance(p1, p4);

    // Avoid division by zero
    if (horizontal === 0) return 0;

    const ear = (vertical1 + vertical2) / (2.0 * horizontal);
    return ear;
}
