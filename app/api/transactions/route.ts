import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Account from '@/models/Account';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const type = searchParams.get('type');
        const accountId = searchParams.get('accountId');

        let query: any = { userId: decoded.userId };
        if (category) query.category = category;
        if (type) query.type = type;
        if (accountId) query.accountId = accountId;

        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .populate('accountId', 'name')
            .populate('toAccountId', 'name');

        return NextResponse.json(transactions);
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
        const { accountId, type, amount, category, description, date, toAccountId } = await req.json();

        if (!accountId || !type || !amount || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const transaction = await Transaction.create({
            userId: decoded.userId,
            accountId,
            type,
            amount,
            category,
            description,
            date: date || new Date(),
            toAccountId: type === 'Transfer' ? toAccountId : undefined,
        });

        // Update account balance
        const account = await Account.findById(accountId);
        if (type === 'Income') {
            account.balance += amount;
        } else if (type === 'Expense') {
            account.balance -= amount;
        } else if (type === 'Transfer' && toAccountId) {
            account.balance -= amount;
            const targetAccount = await Account.findById(toAccountId);
            targetAccount.balance += amount;
            await targetAccount.save();
        }
        await account.save();

        return NextResponse.json(transaction, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
