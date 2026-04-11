import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import PaymentRequest from '@/models/PaymentRequest';
import { verify } from 'jsonwebtoken';
import { PLANS } from '@/lib/paymentConfig';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        // Get user from token
        let token = req.headers.get('authorization')?.split(' ')[1];
        
        // Handle cases where frontend sends "null" or "undefined" as a string
        if (token === 'null' || token === 'undefined') {
            token = undefined;
        }

        if (!token) {
            const cookies = req.headers.get('cookie');
            if (cookies) {
                const tokenMatch = cookies.match(/token=([^;]+)/);
                if (tokenMatch) {
                    token = tokenMatch[1];
                }
            }
        }

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const adminId = decoded.userId;

        // Check if user is admin or superAdmin from DB
        const currentUser = await User.findById(adminId);
        if (!currentUser || (currentUser.level !== 'admin' && currentUser.level !== 'superAdmin')) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const paymentRequest = await PaymentRequest.findById(params.id);
        if (!paymentRequest) {
            return NextResponse.json({ error: 'Payment request not found' }, { status: 404 });
        }

        const user = await User.findById(paymentRequest.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Determine plan duration
        const plan = Object.values(PLANS).find(p => p.id === paymentRequest.planId) || PLANS.MONTHLY;
        const extensionDays = plan.duration;

        // Calculate new expiry date
        // If current subscription is still active, add to it. Otherwise, start from now.
        const currentExpiry = user.subscriptionExpiryDate ? new Date(user.subscriptionExpiryDate) : new Date();
        const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
        
        const newExpiryDate = new Date(baseDate);
        newExpiryDate.setDate(newExpiryDate.getDate() + extensionDays);

        await User.findByIdAndUpdate(paymentRequest.userId, {
            plan: 'pro',
            subscriptionExpiryDate: newExpiryDate,
        });

        paymentRequest.status = 'approved';
        paymentRequest.approvedAt = new Date();
        paymentRequest.approvedBy = adminId;
        await paymentRequest.save();

        return NextResponse.json(
            { message: 'Payment approved successfully', paymentRequest },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error approving payment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
