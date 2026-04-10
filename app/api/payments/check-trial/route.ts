import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Initialize trial if not set
        if (!user.trialStartDate) {
            user.trialStartDate = new Date();
            await user.save();
        }

        // Check if trial is expired
        const trialEndDate = new Date(user.trialStartDate);
        trialEndDate.setDate(trialEndDate.getDate() + 14);
        const isTrialExpired = new Date() > trialEndDate;

        // Check if Pro subscription is still valid
        const isProActive =
            user.plan === 'pro' &&
            user.subscriptionExpiryDate &&
            new Date() < new Date(user.subscriptionExpiryDate);

        // Determine current plan status
        let currentPlan = 'free';
        let daysRemaining = 0;
        let expiryDate = null;

        if (isProActive) {
            currentPlan = 'pro';
            const msRemaining = new Date(user.subscriptionExpiryDate).getTime() - new Date().getTime();
            daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
            expiryDate = new Date(user.subscriptionExpiryDate);
        } else if (!isTrialExpired && user.plan === 'free') {
            currentPlan = 'free-trial';
            const msRemaining = trialEndDate.getTime() - new Date().getTime();
            daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
            expiryDate = trialEndDate;
        }

        return NextResponse.json(
            {
                currentPlan,
                isTrialExpired,
                isProActive,
                daysRemaining,
                expiryDate,
                trialStartDate: user.trialStartDate,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error checking trial:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
