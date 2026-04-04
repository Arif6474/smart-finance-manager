import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { searchParams } = new URL(req.url);
        const daysParam = searchParams.get('days') || '30';
        const days = parseInt(daysParam, 10);

        const now = new Date();
        const startDate = startOfDay(subDays(now, days - 1)); // including today

        // 1. Get current total balance
        const accounts = await Account.find({ userId: decoded.userId });
        const currentTotalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

        // 2. Fetch all transactions in the time window (we only care about Income and Expense)
        const transactions = await Transaction.find({
            userId: decoded.userId,
            type: { $in: ['Income', 'Expense'] },
            date: { $gte: startDate, $lte: endOfDay(now) }
        });

        // 3. Reverse Iteration Algorithm
        const history = [];
        let runningBalance = currentTotalBalance;

        for (let i = 0; i < days; i++) {
            // Target date iterating backwards
            const targetDate = subDays(now, i);
            const targetDateStart = startOfDay(targetDate);
            const targetDateEnd = endOfDay(targetDate);

            // Push current running balance to output for this day
            history.unshift({
                date: format(targetDate, 'MMM dd'),
                fullDate: format(targetDate, 'yyyy-MM-dd'),
                balance: runningBalance
            });

            // Calculate the impact of transactions on *this* day to find out what the balance was *before* this day started.
            // Wait, if we want the balance at the END of (targetDate - 1), we subtract Income that happened on targetDate and add Expense that happened on targetDate.
            const txsOnTargetDate = transactions.filter(tx => tx.date >= targetDateStart && tx.date <= targetDateEnd);

            let dailyIncome = 0;
            let dailyExpense = 0;

            txsOnTargetDate.forEach(tx => {
                if (tx.type === 'Income') dailyIncome += tx.amount;
                if (tx.type === 'Expense') dailyExpense += tx.amount;
            });

            // Adjust running balance for the NEXT iteration (which is the day BEFORE)
            runningBalance = runningBalance - dailyIncome + dailyExpense;
        }

        return NextResponse.json(history);
    } catch (error: any) {
        console.error("Error generating net worth analytics:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
