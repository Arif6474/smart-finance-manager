import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactRequest from '@/models/ContactRequest';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, email, phone, message } = await req.json();

        if (!name || !email || !phone || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Get IP address
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

        const contactRequest = await ContactRequest.create({
            name,
            email,
            phone,
            message,
            ipAddress,
        });

        return NextResponse.json(
            { message: 'Contact request submitted successfully', id: contactRequest._id },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        
        // Verify if user is admin
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === 'string') {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await User.findById((decoded as any).userId);
        if (!user || (user.level !== 'admin' && user.level !== 'superAdmin')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get query parameters for filtering
        const url = new URL(req.url);
        const status = url.searchParams.get('status');
        const sortBy = url.searchParams.get('sort') || '-createdAt';

        const filter = status ? { status } : {};
        const contactRequests = await ContactRequest.find(filter).sort(sortBy).lean();

        return NextResponse.json(contactRequests, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
