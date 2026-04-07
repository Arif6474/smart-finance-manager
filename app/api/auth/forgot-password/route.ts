import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        // For security, always return success even if email doesn't exist
        // to prevent email enumeration attacks
        if (!user) {
            return NextResponse.json({ message: 'If an account exists with that email, a reset link has been sent.' });
        }

        // Generate reset token
        const resetTokenRaw = crypto.randomBytes(32).toString('hex');
        
        // Hash the token for database storage
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetTokenRaw.trim())
            .digest('hex');

        // Update user directy to bypass potential Mongoose model caching issues
        await User.findOneAndUpdate(
            { _id: user._id },
            {
                $set: {
                    resetPasswordToken: hashedToken,
                    resetPasswordExpires: new Date(Date.now() + 3600000)
                }
            }
        );
        
        console.log('Forgot Password - Database updated via findOneAndUpdate');

        // Create reset URL
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetTokenRaw}`;

        // Send email
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_SENDER || 'SmartFinance <onboarding@resend.dev>',
            to: [email],
            subject: 'Password Reset Request - SmartFinance',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 24px;">
                        Hello ${user.name},<br><br>
                        We received a request to reset your password for your SmartFinance account. 
                        If you didn't make this request, you can safely ignore this email.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #0ea5e9; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                            Reset My Password
                        </a>
                    </div>
                    <p style="color: #64748b; font-size: 14px;">
                        The link will expire in 1 hour. If the button above doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="color: #0ea5e9; font-size: 14px; word-break: break-all;">
                        ${resetUrl}
                    </p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                        &copy; ${new Date().getFullYear()} SmartFinance. All rights reserved.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ message: 'If an account exists with that email, a reset link has been sent.' });
    } catch (error: any) {
        console.error('Forgot Password API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
