import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, email, password, confirmPassword, phone } = await req.json();

        if (!name || !email || !password || !confirmPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const user = await User.create({ 
            name, 
            email, 
            password, 
            phone,
            trialStartDate: new Date()
        });

        const token = signToken({ userId: user._id, email: user.email });

        const response = NextResponse.json(
            { message: 'User created successfully',
                 user: { id: user._id, name: user.name, email: user.email, phone: user.phone, level: user.level } },
            { status: 201 }
        );

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
