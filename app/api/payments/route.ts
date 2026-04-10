import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import PaymentRequest from '@/models/PaymentRequest';
import { verify } from 'jsonwebtoken';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Get user from token
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.userId;

        // Check if user is admin (you can add an isAdmin field to User model)
        // For now, we'll assume users can only see their own payment requests
        const isAdmin = process.env.ADMIN_IDS?.includes(userId) || false;

        let paymentRequests;
        if (isAdmin) {
            paymentRequests = await PaymentRequest.find()
                .sort({ createdAt: -1 })
                .populate('userId', 'name email phone');
        } else {
            paymentRequests = await PaymentRequest.find({ userId }).sort({ createdAt: -1 });
        }

        return NextResponse.json({ paymentRequests }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching payment requests:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Get user from token (from cookies)
        const cookies = req.headers.get('cookie');
        if (!cookies || !cookies.includes('token=')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Extract token from cookie
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (!tokenMatch) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = tokenMatch[1];
        let userId;

        try {
            const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key');
            userId = decoded.userId;
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Parse form data
        const formData = await req.formData();
        const method = formData.get('method') as string;
        const transactionId = formData.get('transactionId') as string;
        const senderNumber = formData.get('senderNumber') as string;
        const screenshotFile = formData.get('screenshot') as File | null;

        // Validate inputs
        if (!method || !transactionId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!['bkash', 'nagad', 'bank'].includes(method)) {
            return NextResponse.json(
                { error: 'Invalid payment method' },
                { status: 400 }
            );
        }

        // Check for duplicate submissions (prevent spam)
        const recentPayment = await PaymentRequest.findOne({
            userId,
            transactionId,
            createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last 1 hour
        });

        if (recentPayment) {
            return NextResponse.json(
                { error: 'Duplicate submission. Please wait before submitting again.' },
                { status: 400 }
            );
        }

        // Handle screenshot upload (if provided)
        let screenshotUrl = null;
        if (screenshotFile) {
            // In production, you'd upload to cloud storage (AWS S3, etc.)
            // For now, we'll just store the filename
            screenshotUrl = `uploads/${Date.now()}-${screenshotFile.name}`;
        }

        // Create payment request
        const paymentRequest = await PaymentRequest.create({
            userId,
            method,
            transactionId,
            senderNumber: senderNumber || null,
            screenshotUrl,
            status: 'pending',
        });

        return NextResponse.json(
            {
                message: 'Payment submitted successfully',
                paymentRequest,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error submitting payment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
