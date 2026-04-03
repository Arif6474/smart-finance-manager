import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const userId = decoded.userId;

        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || 'monthly'; // weekly, monthly, yearly
        const dateParam = searchParams.get('date');
        const referenceDate = dateParam ? new Date(dateParam) : new Date();

        let startDate: Date;
        let endDate: Date;
        let groupingFormat: 'day' | 'month' = 'day';

        if (range === 'weekly') {
            // Get the start of the week (Sunday)
            startDate = new Date(referenceDate);
            startDate.setDate(referenceDate.getDate() - referenceDate.getDay());
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
        } else if (range === 'monthly') {
            startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
            endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);
        } else if (range === 'yearly') {
            startDate = new Date(referenceDate.getFullYear(), 0, 1);
            endDate = new Date(referenceDate.getFullYear(), 11, 31, 23, 59, 59, 999);
            groupingFormat = 'month';
        } else {
            return NextResponse.json({ error: 'Invalid range' }, { status: 400 });
        }

        const transactions = await Transaction.find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        const historyData = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        if (groupingFormat === 'day') {
            const daysCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            for (let i = 0; i <= daysCount; i++) {
                const currentDay = new Date(startDate);
                currentDay.setDate(startDate.getDate() + i);

                const dayIncome = transactions
                    .filter(t => {
                        const d = new Date(t.date);
                        return d.getDate() === currentDay.getDate() &&
                            d.getMonth() === currentDay.getMonth() &&
                            d.getFullYear() === currentDay.getFullYear() &&
                            t.type === 'Income';
                    })
                    .reduce((acc, curr) => acc + curr.amount, 0);

                const dayExpense = transactions
                    .filter(t => {
                        const d = new Date(t.date);
                        return d.getDate() === currentDay.getDate() &&
                            d.getMonth() === currentDay.getMonth() &&
                            d.getFullYear() === currentDay.getFullYear() &&
                            t.type === 'Expense';
                    })
                    .reduce((acc, curr) => acc + curr.amount, 0);

                historyData.push({
                    name: range === 'weekly' ? dayNames[currentDay.getDay()] : currentDay.getDate().toString(),
                    income: dayIncome,
                    expense: dayExpense
                });
            }
        } else {
            // Yearly - group by month
            for (let i = 0; i < 12; i++) {
                const currentMonth = i;
                const monthIncome = transactions
                    .filter(t => new Date(t.date).getMonth() === currentMonth && t.type === 'Income')
                    .reduce((acc, curr) => acc + curr.amount, 0);

                const monthExpense = transactions
                    .filter(t => new Date(t.date).getMonth() === currentMonth && t.type === 'Expense')
                    .reduce((acc, curr) => acc + curr.amount, 0);

                historyData.push({
                    name: monthNames[currentMonth],
                    income: monthIncome,
                    expense: monthExpense
                });
            }
        }

        // Category breakdown for the selected period
        const categoryMap: { [key: string]: number } = {};
        transactions.filter(t => t.type === 'Expense').forEach(t => {
            categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        });

        const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
            name,
            value
        })).sort((a, b) => b.value - a.value);

        return NextResponse.json({
            range,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            historyData,
            categoryData
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
