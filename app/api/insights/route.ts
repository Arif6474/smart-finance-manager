import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import Budget from '@/models/Budget';
import AiInsight from '@/models/AiInsight';
import Subscription from '@/models/Subscription';
import PayableReceivable from '@/models/PayableReceivable';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { generateFinancialInsights, FinancialDataSummary } from '@/lib/ai';

const getWeeklyRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    
    const nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    
    return { start: monday, end: nextMonday };
};

export async function GET(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { start, end } = getWeeklyRange();

        // Check for the latest insight within the current week
        const existingInsight = await AiInsight.findOne({
            userId: decoded.userId,
            createdAt: { $gte: start, $lt: end }
        }).sort({ createdAt: -1 });

        return NextResponse.json({ insight: existingInsight || null });
    } catch (error: any) {
        console.error("Error in GET insights route:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { start, end } = getWeeklyRange();

        // 1. Check if already generated this week
        const existingInsight = await AiInsight.findOne({
            userId: decoded.userId,
            createdAt: { $gte: start, $lt: end }
        });

        if (existingInsight) {
            return NextResponse.json({ 
                error: 'Weekly limit reached. You can only generate one report per week.',
                insight: existingInsight 
            }, { status: 429 });
        }

        // 2. Prepare Financial Summary
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

        // Get Total Balance
        const accounts = await Account.find({ userId: decoded.userId });
        const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

        // Get Monthly Transactions
        const monthlyTransactions = await Transaction.find({
            userId: decoded.userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // Get Significant Transactions (Expense only, Top 5)
        const significantTransactions = await Transaction.find({
            userId: decoded.userId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
            type: 'Expense'
        }).sort({ amount: -1 }).limit(5);

        // Fetch Subscriptions
        const subscriptions = await Subscription.find({
            userId: decoded.userId,
            isActive: true
        });

        // Fetch Payables & Receivables due this month or pending
        const upcomingItems = await PayableReceivable.find({
            userId: decoded.userId,
            $or: [
                { status: 'Pending' },
                { status: 'Partial' }
            ],
            dueDate: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const upcomingPayables = upcomingItems
            .filter(item => item.type === 'Payable')
            .map(item => ({
                person: item.person,
                amount: item.amount - (item.paidAmount || 0),
                dueDate: item.dueDate.toISOString().split('T')[0],
                status: item.status
            }));

        const upcomingReceivables = upcomingItems
            .filter(item => item.type === 'Receivable')
            .map(item => ({
                person: item.person,
                amount: item.amount - (item.paidAmount || 0),
                dueDate: item.dueDate.toISOString().split('T')[0],
                status: item.status
            }));

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

        // Get Active Budgets & Usage
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

        // Context summary for AI
        const dataSummary: FinancialDataSummary = {
            totalBalance,
            month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
            totalIncomeThisMonth,
            totalExpenseThisMonth,
            spendingByCategory,
            budgets: formattedBudgets,
            significantTransactions: significantTransactions.map(t => ({
                description: t.description,
                amount: t.amount,
                date: t.date.toISOString().split('T')[0],
                category: t.category
            })),
            subscriptions: subscriptions.map(s => ({
                name: s.name,
                amount: s.amount,
                frequency: s.frequency
            })),
            upcomingPayables,
            upcomingReceivables
        };

        // Call OpenAI
        const { insights, summary } = await generateFinancialInsights(dataSummary);

        // 3. Save as today's report
        const newReport = await AiInsight.create({
            userId: decoded.userId,
            insights,
            summary,
            createdAt: new Date()
        });

        return NextResponse.json({ insight: newReport });
    } catch (error: any) {
        console.error("Error in POST insights route:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
