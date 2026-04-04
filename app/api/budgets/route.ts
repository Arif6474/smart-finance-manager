import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Budget from '@/models/Budget';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const monthOffset = parseInt(searchParams.get('monthOffset') || '0', 10);

        const decoded: any = verifyToken(token);
        const now = new Date();
        now.setMonth(now.getMonth() + monthOffset);

        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // Fetch all budgets for the current user and month
        const budgets = await Budget.find({
            userId: decoded.userId,
            month: currentMonth,
            year: currentYear,
            isActive: true
        });

        // Calculate spent amount for each budget category
        const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

        const spentStats = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(decoded.userId),
                    type: 'Expense',
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: '$category',
                    totalSpent: { $sum: '$amount' }
                }
            }
        ]);

        const statsMap = spentStats.reduce((acc: any, curr: any) => {
            acc[curr._id] = curr.totalSpent;
            return acc;
        }, {});

        const budgetsWithSpent = budgets.map(b => ({
            ...b.toObject(),
            spent: statsMap[b.category] || 0
        }));

        // Also return categories that have spending but NO budget
        const budgetsCategories = budgets.map(b => b.category);
        const additionalStats = spentStats
            .filter(s => !budgetsCategories.includes(s._id))
            .map(s => ({
                category: s._id,
                limit: 0,
                spent: s.totalSpent,
                isUnbudgeted: true
            }));

        return NextResponse.json([...budgetsWithSpent, ...additionalStats]);
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
        const { category, limit, targetMonths = 1, monthOffset = 0 } = await req.json();

        if (!category) {
            return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }

        const parsedLimit = limit ? Number(limit) : 0;

        const now = new Date();
        let baseMonth = now.getMonth() + 1 + monthOffset;
        let baseYear = now.getFullYear();

        const budgets = [];
        for (let i = 0; i < targetMonths; i++) {
            let m = baseMonth + i;
            let y = baseYear;
            while (m > 12) {
                m -= 12;
                y += 1;
            }
            while (m < 1) {
                m += 12;
                y -= 1;
            }

            const budget = await Budget.findOneAndUpdate(
                { userId: decoded.userId, category, month: m, year: y },
                { limit: parsedLimit, isActive: true },
                { upsert: true, new: true }
            );
            budgets.push(budget);
        }

        return NextResponse.json(budgets.length === 1 ? budgets[0] : budgets);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { id } = await req.json();

        await Budget.findOneAndDelete({ _id: id, userId: decoded.userId });

        return NextResponse.json({ message: 'Budget deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
