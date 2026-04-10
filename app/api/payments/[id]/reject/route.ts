import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PaymentRequest from '@/models/PaymentRequest';
import { verify } from 'jsonwebtoken';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        // Get user from token
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const adminId = decoded.userId;

        // Check if admin
        const isAdmin = process.env.ADMIN_IDS?.includes(adminId);
        if (!isAdmin) {
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
