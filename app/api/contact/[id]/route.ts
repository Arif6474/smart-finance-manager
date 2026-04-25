import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactRequest from '@/models/ContactRequest';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import User from '@/models/User';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

        const { status } = await req.json();
        
        if (!['new', 'read', 'resolved'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const contactRequest = await ContactRequest.findByIdAndUpdate(
            params.id,
            { status },
            { new: true }
        );

        if (!contactRequest) {
            return NextResponse.json({ error: 'Contact request not found' }, { status: 404 });
        }

        return NextResponse.json(contactRequest, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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

        const contactRequest = await ContactRequest.findByIdAndDelete(params.id);

        if (!contactRequest) {
            return NextResponse.json({ error: 'Contact request not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Contact request deleted' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
