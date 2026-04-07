import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { credential } = await req.json();

        if (!credential) {
            return NextResponse.json({ error: 'Missing credential' }, { status: 400 });
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { email, name, picture } = payload;

        if (!email) {
            return NextResponse.json({ error: 'Email not provided' }, { status: 400 });
        }

        // Find existing user or create new one
        let user = await User.findOne({ email });

        if (!user) {
            // Create new Google user
            user = await User.create({
                email,
                name: name || 'User',
                image: picture || '',
                authProvider: 'google',
                // No password for Google users
            });
        } else if (user.authProvider === 'local') {
            // User exists but signed up with local auth, don't auto-login
            return NextResponse.json(
                {
                    error: 'This email is associated with a local account. Please log in with your password.',
                },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = signToken({ userId: user._id, email: user.email });

        const response = NextResponse.json({
            message: 'Logged in successfully',
            user: { id: user._id, name: user.name, email: user.email },
        });

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Google auth error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
