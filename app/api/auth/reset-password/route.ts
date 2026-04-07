import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }
        console.log('Token:', token);
        console.log('Password:', password);
        // Hash the token from the URL to compare with the one in DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(token.trim())
            .digest('hex');

        console.log('Reset Password - Input Token From Client:', token.trim());
        console.log('Reset Password - Computed Hash:', hashedToken);

        // Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            console.log('Reset Failed: User not found or token expired');
            // Check if token exists but is expired
            const expiredUser = await User.findOne({ resetPasswordToken: hashedToken });
            if (expiredUser) {
                console.log('Token exists in DB but expired at:', expiredUser.resetPasswordExpires);
                console.log('Current server time:', new Date());
            } else {
                console.log('Token NOT found in DB. Stored hash does not match computed hash.');
            }
            return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
        }

        // Update password (pre-save hook will hash it)
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return NextResponse.json({ message: 'Password has been reset successfully' });
    } catch (error: any) {
        console.error('Reset Password API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
