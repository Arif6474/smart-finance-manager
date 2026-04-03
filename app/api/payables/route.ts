import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PayableReceivable from '@/models/PayableReceivable';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import console from 'console';

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
        const { type, person, amount, category, description, dueDate } = await req.json();
        console.log({ type, person, amount, category, description, dueDate })
        const entry = await PayableReceivable.create({
            userId: decoded.userId,
            type,
            person,
            amount,
            category: category || 'Other',
            description,
            dueDate,
            status: 'Pending'
        });
        console.log(entry, 'entry')
        return NextResponse.json(entry, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const body = await req.json();
        const updated = await PayableReceivable.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await PayableReceivable.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
