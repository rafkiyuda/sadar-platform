import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    const { message } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'Gemini API Key not configured' }, { status: 500 });
    }

    try {
        // const genAI = new GoogleGenerativeAI(apiKey);
        // const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // const result = await model.generateContent(message);
        // const response = await result.response;
        // const text = response.text();

        const text = "AI Assistant is currently disabled pending environment setup.";

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
