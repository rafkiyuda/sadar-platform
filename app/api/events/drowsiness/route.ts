import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { status, timestamp } = body;

        console.log(` [EVENT] Driver Status Change: ${status} at ${new Date(timestamp).toISOString()}`);

        // Save to Database (Postgres/Supabase)
        const { error } = await supabase
            .from('drowsiness_events')
            .insert({ status, timestamp: new Date(timestamp).toISOString() });

        if (error) {
            console.error("Supabase error:", error);
            // We don't block the response on DB error for the client, but we log it.
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }
}
