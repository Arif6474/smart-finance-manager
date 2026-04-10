import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { getSubscriptionDetails } from '@/lib/subscriptionUtils';

export async function GET() {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const subscription = await getSubscriptionDetails(decoded.userId);

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                level: user.level,
                plan: user.plan,
                trialStartDate: user.trialStartDate,
                subscriptionExpiryDate: user.subscriptionExpiryDate,
                subscription: subscription
            }
        });
    } catch (error: any) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { name, phone } = await req.json();

        if (!name || name.trim() === '') {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            { name: name.trim(), phone: phone?.trim() },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone
            }
        });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
