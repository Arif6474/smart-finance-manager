import { NextResponse, NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from './db';

export async function checkAdminAccess(req: NextRequest) {
    try {
        await dbConnect();

        // Get token from cookies
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return {
                isAdmin: false,
                error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
                userId: null,
                user: null,
            };
        }

        // Verify token
        let userId;
        try {
            const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key');
            userId = decoded.userId;
        } catch {
            return {
                isAdmin: false,
                error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }),
                userId: null,
                user: null,
            };
        }

        // Fetch user and check level
        const user = await User.findById(userId);
        if (!user) {
            return {
                isAdmin: false,
                error: NextResponse.json({ error: 'User not found' }, { status: 404 }),
                userId: null,
                user: null,
            };
        }

        const isAdmin = user.level === 'admin' || user.level === 'superAdmin';

        if (!isAdmin) {
            return {
                isAdmin: false,
                error: NextResponse.json(
                    { error: 'Access Denied: Admin only' },
                    { status: 403 }
                ),
                userId,
                user,
            };
        }

        return {
            isAdmin: true,
            error: null,
            userId,
            user,
        };
    } catch (error: any) {
        return {
            isAdmin: false,
            error: NextResponse.json({ error: error.message }, { status: 500 }),
            userId: null,
            user: null,
        };
    }
}
