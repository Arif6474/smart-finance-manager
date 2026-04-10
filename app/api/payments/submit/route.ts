import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PaymentRequest from '@/models/PaymentRequest';
import { verify } from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Get user from token
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.userId;

        const { paymentMethod, transactionId, senderNumber, userEmail, userName } = await req.json();

        // Validate inputs
        if (!paymentMethod || !transactionId) {
            return NextResponse.json(
                { error: 'Payment method and transaction ID are required' },
                { status: 400 }
            );
        }

        if (!['bkash', 'nagad', 'bank'].includes(paymentMethod)) {
            return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
        }

        // Check for duplicate pending submissions from same user in last 24 hours
        const existingRequest = await PaymentRequest.findOne({
            userId,
            status: 'pending',
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });

        if (existingRequest) {
            return NextResponse.json(
                { error: 'You already have a pending payment request. Please wait for approval.' },
                { status: 400 }
            );
        }

        // Create payment request
        const paymentRequest = await PaymentRequest.create({
            userId,
            userEmail,
            userName,
            paymentMethod,
            transactionId,
            senderNumber: senderNumber || '',
            status: 'pending',
        });

        return NextResponse.json(
            {
                message: 'Payment request submitted successfully. Your request is under review.',
                paymentRequest,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Payment submission error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
