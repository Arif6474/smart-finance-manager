import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PayableReceivable from '@/models/PayableReceivable';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const data = await PayableReceivable.find({ userId: decoded.userId }).sort({ dueDate: 1 });

        return NextResponse.json(data);
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
        const { type, person, amount, description, dueDate } = await req.json();

        const entry = await PayableReceivable.create({
            userId: decoded.userId,
            type,
            person,
            amount,
            description,
            dueDate,
        });

        return NextResponse.json(entry, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
