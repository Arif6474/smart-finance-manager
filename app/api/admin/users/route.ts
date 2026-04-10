import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { checkAdminAccess } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
    try {
        const { isAdmin, error } = await checkAdminAccess(req);
        
        if (!isAdmin) {
            return error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch all users with pagination
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const users = await User.find({})
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments();

        return NextResponse.json(
            {
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
