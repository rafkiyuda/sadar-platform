import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    const { message, location } = await request.json();
    // Use NEXT_PUBLIC_GEMINI_API_KEY to match user's .env setup
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-2.0-flash-exp to match the multimodal live capabilities
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        let prompt = message;
        if (location && location.lat && location.lng) {
            prompt = `[System: User is at Lat ${location.lat}, Lng ${location.lng}] ${message}`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`[GEMINI] Received message: ${message}`);
        console.log(`[GEMINI] Response: ${text}`);

        return NextResponse.json({
            reply: text
        });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
    }
}
