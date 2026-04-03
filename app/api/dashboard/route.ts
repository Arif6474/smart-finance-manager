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

        // Get 7-day daily stats for chart
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const lastSevenDaysTransactions = await Transaction.find({
            userId,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: 1 });

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const chartData = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(sevenDaysAgo.getDate() + i);
            const dayName = days[date.getDay()];

            const dayIncome = lastSevenDaysTransactions
                .filter(t => new Date(t.date).toDateString() === date.toDateString() && t.type === 'Income')
                .reduce((acc, curr) => acc + curr.amount, 0);

            const dayExpense = lastSevenDaysTransactions
                .filter(t => new Date(t.date).toDateString() === date.toDateString() && t.type === 'Expense')
                .reduce((acc, curr) => acc + curr.amount, 0);

            chartData.push({
                name: dayName,
                income: dayIncome,
                expense: dayExpense
            });
        }

        return NextResponse.json({
            totalBalance,
            income,
            expense,
            recentTransactions,
            chartData
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
