import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import PaymentRequest from '@/models/PaymentRequest';
import { verify } from 'jsonwebtoken';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Get user from token (check header first, then cookies)
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

        let decoded: any;
        try {
            decoded = verify(token, process.env.JWT_SECRET || 'fallback_secret');
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.userId;

        // Fetch user from database to check level
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user is admin or superAdmin
        const adminStatus = currentUser.level === 'admin' || currentUser.level === 'superAdmin';

        let paymentRequests;
        if (adminStatus) {
            // Admins can see all payment requests
            paymentRequests = await PaymentRequest.find()
                .sort({ createdAt: -1 })
                .populate('userId', 'name email phone');
        } else {
            // Regular users only see their own requests
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

        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
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
            userEmail: user.email,
            userName: user.name,
            paymentMethod: method,
            transactionId,
            senderNumber: senderNumber || '',
            screenshotUrl: screenshotUrl || '',
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
