import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PaymentRequest from '@/models/PaymentRequest';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';

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

        const { rejectionReason } = await req.json();

        const paymentRequest = await PaymentRequest.findById(params.id);
        if (!paymentRequest) {
            return NextResponse.json({ error: 'Payment request not found' }, { status: 404 });
        }

        // Reject payment
        paymentRequest.status = 'rejected';
        paymentRequest.rejectionReason = rejectionReason || 'Payment not verified';
        await paymentRequest.save();

        return NextResponse.json(
            { message: 'Payment rejected', paymentRequest },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error rejecting payment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
