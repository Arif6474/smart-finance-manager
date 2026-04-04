import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PayableReceivable from '@/models/PayableReceivable';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import console from 'console';

export async function GET() {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const data = await PayableReceivable.find({ userId: decoded.userId }).sort({ dueDate: 1 });

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const body = await req.json();
        const {
            type, person, amount, category, description, dueDate,
            isLoan, totalPrincipal, interestRate, termMonths, startDate, accountId
        } = body;

        let loanData = {};
        if (isLoan) {
            let emi = body.emiAmount;
            if (!emi && totalPrincipal && interestRate && termMonths) {
                const r = interestRate / 12 / 100;
                const n = termMonths;
                emi = Math.round((totalPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
            }

            loanData = {
                isLoan: true,
                totalPrincipal,
                interestRate,
                termMonths,
                emiAmount: emi,
                startDate: startDate || dueDate || new Date(),
                remainingPrincipal: totalPrincipal,
                paidMonths: 0
            };
        }

        const entry = await PayableReceivable.create({
            userId: decoded.userId,
            type,
            person,
            amount: isLoan ? (loanData as any).emiAmount : amount, // If loan, amount is the EMI
            category: category || 'Other',
            description,
            dueDate: isLoan ? (startDate || dueDate || new Date()) : dueDate,
            status: 'Pending',
            accountId: accountId || undefined,
            ...loanData
        });

        return NextResponse.json(entry, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const body = await req.json();
        const updated = await PayableReceivable.findByIdAndUpdate(id, body, { new: true });

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await PayableReceivable.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
