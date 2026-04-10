import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Account from '@/models/Account';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { checkSubscription } from '@/lib/subscriptionUtils';

export async function GET() {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const accounts = await Account.find({ userId: decoded.userId }).sort({ createdAt: -1 });

        return NextResponse.json(accounts);
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
        const userId = decoded.userId;

        // Check subscription status
        const subStatus = await checkSubscription(userId);
        if (!subStatus.isAllowed) {
            return NextResponse.json({ error: subStatus.reason }, { status: 403 });
        }

        const { name, type, balance } = await req.json();

        if (!name || !type) {
            return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
        }

        const account = await Account.create({
            userId: decoded.userId,
            name,
            type,
            balance: balance || 0,
        });

        return NextResponse.json(account, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
