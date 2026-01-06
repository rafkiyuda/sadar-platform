
export const blobToJSON = (blob: Blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                const json = JSON.parse(reader.result as string);
                resolve(json);
            } else {
                reject("oops");
            }
        };
        reader.readAsText(blob);
    });

export function base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Convert Float32 AudioBuffer to Int16 PCM ArrayBuffer
export function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
}

// Downsample buffer to 16kHz
export function downsampleTo16kHz(buffer: Float32Array, sampleRate: number): Float32Array {
    if (sampleRate === 16000) return buffer;
    const compression = sampleRate / 16000;
    const length = buffer.length / compression;
    const result = new Float32Array(length);
    let index = 0, j = 0;
    while (index < length) {
        result[index] = buffer[Math.floor(j)];
        j += compression;
        index++;
    }
    return result;
}
