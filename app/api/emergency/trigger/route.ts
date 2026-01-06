import { NextResponse } from 'next/server';

export async function POST() {
    // TODO: Secure this endpoint (Auth/Session check)

    console.log(" [EMERGENCY] SOS Triggered at " + new Date().toISOString());

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    // For PoC, we might hardcode the destination or get it from user profile in DB
    // Assuming a Mock or env variable for destination for now? 
    // Just using a placeholder or logging if not set.
    const toNumber = process.env.EMERGENCY_CONTACT_NUMBER;

    if (!accountSid || !authToken || !fromNumber || !toNumber) {
        console.warn("Twilio credentials or Emergency Contact missing.");
        return NextResponse.json({
            success: false,
            message: "Emergency protocol failed: Missing configuration."
        }, { status: 500 });
    }

    // try {
    //     const client = require('twilio')(accountSid, authToken);

    //     await client.calls.create({
    //         url: 'http://demo.twilio.com/docs/voice.xml', // Replace with TwiML bin or proper URL
    //         to: toNumber,
    //         from: fromNumber
    //     });

    //     return NextResponse.json({
    //         success: true,
    //         message: "Emergency protocol initiated. Call dispatched."
    //     });

    // } catch (error) {
    //     console.error("Twilio Error:", error);
    //     return NextResponse.json({
    //         success: false,
    //         message: "Failed to Dispatch Emergency Call"
    //     }, { status: 500 });
    // }

    // MOCK RESPONSE FOR BUILD
    return NextResponse.json({
        success: true,
        message: "Emergency protocol initiated. Call dispatched. (MOCKED - dependency disabled)"
    });
}
