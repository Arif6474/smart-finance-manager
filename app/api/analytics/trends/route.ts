import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { searchParams } = new URL(req.url);
        const monthsParam = searchParams.get('months') || '6';
        let numMonths = parseInt(monthsParam, 10);

        // Cap at 12 months max for performance
        if (numMonths > 12) numMonths = 12;

        const now = new Date();
        const startDate = startOfMonth(subMonths(now, numMonths - 1));

        // Aggregate income and expense by month
        const trends = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(decoded.userId),
                    type: { $in: ['Income', 'Expense'] },
                    date: { $gte: startDate, $lte: endOfMonth(now) }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0]
                        }
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0]
                        }
                    }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // MongoDB returns month numbers 1-12. Let's map them to a complete array ensuring empty months are filled with 0.
        // E.g. we want all 6 months even if a month had no transactions

        const finalData = [];
        for (let i = numMonths - 1; i >= 0; i--) {
            const targetMonth = subMonths(now, i);
            const y = targetMonth.getFullYear();
            const m = targetMonth.getMonth() + 1; // 1-12

            const found = trends.find(t => t._id.year === y && t._id.month === m);

            finalData.push({
                month: format(targetMonth, 'MMM'),
                fullDate: format(targetMonth, 'yyyy-MM'),
                Income: found ? found.income : 0,
                Expense: found ? found.expense : 0
            });
        }

        return NextResponse.json(finalData);
    } catch (error: any) {
        console.error("Error generating trends analytics:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
