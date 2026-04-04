import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import Budget from '@/models/Budget';
import ScoreHistory from '@/models/ScoreHistory';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        throw new Error('Invalid token');
    }
}

// POST: Calculate and update the Financial Health Score
export async function POST() {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // 1. Calculate Savings Score (Weight: 40%)
        // Positive net worth, and how much is saved relative to expenses
        const accounts = await Account.find({ userId });
        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

        // Get this month's transactions
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const expenses = await Transaction.aggregate([
            { $match: { userId: user._id, type: 'Expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const monthlyExpense = expenses[0]?.total || 1; // Prevent div by 0

        // Ideally, savings should cover 3+ months of expenses
        const emergencyRatio = totalBalance / monthlyExpense;
        // Cap saving score at 40
        let savingsScore = 0;
        if (emergencyRatio >= 3) savingsScore = 40;
        else if (emergencyRatio >= 1) savingsScore = 20 + (emergencyRatio * 6);
        else savingsScore = emergencyRatio * 20;

        // 2. Calculate Debt Score (Weight: 30%)
        // Get all loans where user is the debtor
        const loans = await (await import('@/models/PayableReceivable')).default.find({
            userId, isLoan: true, type: 'Payable', status: { $ne: 'Paid' }
        });
        const totalEMI = loans.reduce((sum, loan) => sum + (loan.emiAmount || 0), 0);

        const incomes = await Transaction.aggregate([
            { $match: { userId: user._id, type: 'Income', date: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const monthlyIncome = incomes[0]?.total || 1;

        // Lower debt-to-income ratio is better. If EMI > 50% of income, score is 0.
        const dtiRatio = totalEMI / monthlyIncome;
        let debtScore = 30; // Max 30 points
        if (dtiRatio > 0.5) debtScore = 0;
        else debtScore = 30 - (dtiRatio * 60);

        // 3. Calculate Budget Score (Weight: 30%)
        // How closely the user sticks to their budgets
        const budgets = await Budget.find({ userId });
        let budgetScore = 0;
        if (budgets.length === 0) {
            // Give 15 points if they have no budgets, to not punish them completely but not max out
            budgetScore = 15;
        } else {
            let budgetAdherence = 0;
            budgets.forEach(b => {
                if (b.spentAmount <= b.amount) budgetAdherence++;
            });
            budgetScore = (budgetAdherence / budgets.length) * 30;
        }

        // Final Score
        const totalScore = Math.min(100, Math.max(0, Math.round(savingsScore + debtScore + budgetScore)));

        // Update User and save History
        user.healthScore = totalScore;

        // Check for Health Score badges
        if (totalScore >= 80 && !user.badges.includes('EXCELLENT_FINANCES')) {
            user.badges.push('EXCELLENT_FINANCES');
        }

        await user.save();

        // Log to history
        await ScoreHistory.create({
            userId,
            score: totalScore,
            breakdown: {
                savingsScore: Math.round(savingsScore),
                budgetScore: Math.round(budgetScore),
                debtScore: Math.round(debtScore)
            }
        });

        return NextResponse.json({
            healthScore: totalScore,
            breakdown: {
                savingsScore: Math.round(savingsScore),
                budgetScore: Math.round(budgetScore),
                debtScore: Math.round(debtScore)
            },
            badges: user.badges
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
