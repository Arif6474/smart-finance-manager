import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { id } = params;
        const data = await req.json();

        if (data.nextBillingDate) {
            data.nextBillingDate = new Date(data.nextBillingDate);
        }

        const sub = await Subscription.findOneAndUpdate(
            { _id: id, userId: decoded.userId },
            { $set: data },
            { new: true }
        ).populate('accountId', 'name');

        if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json(sub);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { id } = params;

        const sub = await Subscription.findOneAndDelete({ _id: id, userId: decoded.userId });
        if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
