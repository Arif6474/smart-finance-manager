import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Reminder from '@/models/Reminder';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const body = await req.json();

        const reminder = await Reminder.findOneAndUpdate(
            { _id: params.id, userId: decoded.userId },
            { $set: body },
            { new: true }
        );

        if (!reminder) {
            return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
        }

        return NextResponse.json(reminder);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);

        const reminder = await Reminder.findOneAndDelete({
            _id: params.id,
            userId: decoded.userId
        });

        if (!reminder) {
            return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Reminder deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
