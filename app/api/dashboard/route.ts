import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const userId = decoded.userId;

        // Get total balance
        const accounts = await Account.find({ userId });
        const totalBalance = accounts.reduce((acc: number, curr: any) => acc + curr.balance, 0);

        // Get recent transactions
        const recentTransactions = await Transaction.find({ userId })
            .sort({ date: -1 })
            .limit(5)
            .populate('accountId', 'name');

        // Get monthly stats (simplified for now)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyTransactions = await Transaction.find({
            userId,
            date: { $gte: startOfMonth }
        });

        const income = monthlyTransactions
            .filter(t => t.type === 'Income')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const expense = monthlyTransactions
            .filter(t => t.type === 'Expense')
            .reduce((acc, curr) => acc + curr.amount, 0);

        return NextResponse.json({
            totalBalance,
            income,
            expense,
            recentTransactions,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
