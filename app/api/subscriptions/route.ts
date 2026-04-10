import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { checkSubscription } from '@/lib/subscriptionUtils';

// GET all subscriptions for user
export async function GET() {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);

        // Fetch subscriptions, populate account Name to show in UI
        const subscriptions = await Subscription.find({ userId: decoded.userId })
            .populate('accountId', 'name')
            .sort({ nextBillingDate: 1 });

        return NextResponse.json(subscriptions);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// CREATE new subscription
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

        const data = await req.json();

        // Convert dates from string to Object
        const newSub = new Subscription({
            ...data,
            userId: decoded.userId,
            nextBillingDate: new Date(data.nextBillingDate)
        });

        await newSub.save();

        // Populate account for immediately returning complete object
        await newSub.populate('accountId', 'name');

        return NextResponse.json(newSub, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
