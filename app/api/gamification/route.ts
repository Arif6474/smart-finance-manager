import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        throw new Error('Invalid token');
    }
}

// GET: Fetch user's gamification stats
export async function GET() {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const user = await User.findById(decoded.userId).select('streakCount lastActiveDate healthScore badges name');

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Update streak based on daily activity
export async function POST() {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const user = await User.findById(decoded.userId);

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let shouldUpdate = false;

        if (!user.lastActiveDate) {
            // First time active
            user.streakCount = 1;
            user.lastActiveDate = today;
            shouldUpdate = true;
        } else {
            const lastActive = new Date(user.lastActiveDate);
            const lastActiveDateOnly = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

            const diffTime = Math.abs(today.getTime() - lastActiveDateOnly.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day
                user.streakCount += 1;
                user.lastActiveDate = today;
                shouldUpdate = true;

                // Add Badge logic for streaks
                if (user.streakCount === 7 && !user.badges.includes('7_DAY_STREAK')) {
                    user.badges.push('7_DAY_STREAK');
                } else if (user.streakCount === 30 && !user.badges.includes('30_DAY_STREAK')) {
                    user.badges.push('30_DAY_STREAK');
                }
            } else if (diffDays > 1) {
                // Streak broken
                user.streakCount = 1;
                user.lastActiveDate = today;
                shouldUpdate = true;
            }
            // If diffDays === 0, already active today, do nothing.
        }

        if (shouldUpdate) {
            await user.save();
        }

        return NextResponse.json({
            streakCount: user.streakCount,
            healthScore: user.healthScore,
            badges: user.badges
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
