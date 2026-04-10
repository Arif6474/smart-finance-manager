import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Goal from '@/models/Goal';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { checkSubscription } from '@/lib/subscriptionUtils';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);

        const goals = await Goal.find({ userId: decoded.userId }).sort({ createdAt: -1 });

        return NextResponse.json(goals);
    } catch (error: any) {
        console.error("Error fetching goals:", error);
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

        const { name, targetAmount, currentAmount, deadline, color, icon } = await req.json();

        if (!name || !targetAmount) {
            return NextResponse.json({ error: 'Name and Target Amount are required' }, { status: 400 });
        }

        const newGoal = new Goal({
            userId: decoded.userId,
            name,
            targetAmount: Number(targetAmount),
            currentAmount: currentAmount ? Number(currentAmount) : 0,
            deadline: deadline ? new Date(deadline) : undefined,
            color,
            icon
        });

        await newGoal.save();

        return NextResponse.json(newGoal, { status: 201 });
    } catch (error: any) {
        console.error("Error creating goal:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
