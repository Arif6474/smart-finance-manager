import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';
import { getSubscriptionDetails } from '@/lib/subscriptionUtils';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const subscription = await getSubscriptionDetails(decoded.userId);

        return NextResponse.json(subscription, { status: 200 });
    } catch (error: any) {
        console.error('Error checking trial:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
