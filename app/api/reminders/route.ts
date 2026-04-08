import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Reminder from '@/models/Reminder';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { searchParams } = new URL(req.url);
        const all = searchParams.get('all') === 'true';
        const limit = parseInt(searchParams.get('limit') || '0', 10);

        let query: any = { userId: decoded.userId };
        if (!all) {
            query.status = 'Pending';
            // Only show upcoming reminders or recently passed ones that are still pending
            // For dashboard we might want only upcoming
        }

        let reminders = Reminder.find(query).sort({ remindAt: 1 });
        if (limit > 0) {
            reminders = reminders.limit(limit);
        }

        const results = await reminders;
        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const body = await req.json();

        const reminder = await Reminder.create({
            ...body,
            userId: decoded.userId
        });

        return NextResponse.json(reminder, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
