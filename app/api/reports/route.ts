import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
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

        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        // 1. Get 6-month historical data (Monthly)
        const monthlyTransactions = await Transaction.find({
            userId,
            date: { $gte: sixMonthsAgo }
        }).sort({ date: 1 });

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const historyData = [];

        for (let i = 0; i < 6; i++) {
            const date = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
            const monthLabel = monthNames[date.getMonth()];

            const monthIncome = monthlyTransactions
                .filter(t => {
                    const d = new Date(t.date);
                    return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear() && t.type === 'Income';
                })
                .reduce((acc, curr) => acc + curr.amount, 0);

            const monthExpense = monthlyTransactions
                .filter(t => {
                    const d = new Date(t.date);
                    return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear() && t.type === 'Expense';
                })
                .reduce((acc, curr) => acc + curr.amount, 0);

            historyData.push({
                name: monthLabel,
                income: monthIncome,
                expense: monthExpense
            });
        }

        // 2. Get category-wise data (current month)
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthExpenses = monthlyTransactions.filter(t =>
            new Date(t.date) >= startOfCurrentMonth && t.type === 'Expense'
        );

        const categoryMap: { [key: string]: number } = {};
        currentMonthExpenses.forEach(t => {
            categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        });

        const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
            name,
            value
        })).sort((a, b) => b.value - a.value);

        return NextResponse.json({
            historyData,
            categoryData
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
