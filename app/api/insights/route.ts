import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import Budget from '@/models/Budget';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { generateFinancialInsights, FinancialDataSummary } from '@/lib/ai';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const userIdObj = new mongoose.Types.ObjectId(decoded.userId);

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

        // 1. Get Total Balance
        const accounts = await Account.find({ userId: decoded.userId });
        const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

        // 2. Get Monthly Transactions
        const monthlyTransactions = await Transaction.find({
            userId: decoded.userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        let totalIncomeThisMonth = 0;
        let totalExpenseThisMonth = 0;
        const spendingByCategory: Record<string, number> = {};

        monthlyTransactions.forEach(t => {
            if (t.type === 'Income') {
                totalIncomeThisMonth += t.amount;
            } else if (t.type === 'Expense') {
                totalExpenseThisMonth += t.amount;
                spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + t.amount;
            }
        });

        // 3. Get Active Budgets & Usage
        const budgets = await Budget.find({
            userId: decoded.userId,
            month: currentMonth,
            year: currentYear,
            isActive: true
        });

        const formattedBudgets = budgets.map(b => ({
            category: b.category,
            limit: b.limit,
            spent: spendingByCategory[b.category] || 0
        }));

        // Provide context to AI
        const dataSummary: FinancialDataSummary = {
            totalBalance,
            month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
            totalIncomeThisMonth,
            totalExpenseThisMonth,
            spendingByCategory,
            budgets: formattedBudgets
        };

        // Call Gemini
        const insights = await generateFinancialInsights(dataSummary);

        return NextResponse.json(insights);
    } catch (error: any) {
        console.error("Error in insights route:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
