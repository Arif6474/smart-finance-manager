import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Account from '@/models/Account';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { checkSubscription } from '@/lib/subscriptionUtils';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const type = searchParams.get('type');
        const accountId = searchParams.get('accountId');

        let query: any = { userId: decoded.userId };
        if (category) query.category = category;
        if (type) query.type = type;
        if (accountId) query.accountId = accountId;

        const transactions = await Transaction.find(query)
            .sort({ date: -1, createdAt: -1 })
            .populate('accountId', 'name')
            .populate('toAccountId', 'name');

        return NextResponse.json(transactions);
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
        const userId = decoded.userId;

        // Check subscription status
        const subStatus = await checkSubscription(userId);
        if (!subStatus.isAllowed) {
            return NextResponse.json({ error: subStatus.reason }, { status: 403 });
        }

        const { accountId, type, amount, category, description, date, toAccountId } = await req.json();

        if (!accountId || !type || !amount || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const transaction = await Transaction.create({
            userId: decoded.userId,
            accountId,
            type,
            amount,
            category,
            description,
            date: date || new Date(),
            toAccountId: type === 'Transfer' ? toAccountId : undefined,
        });

        // Update account balance
        const account = await Account.findById(accountId);
        if (type === 'Income') {
            account.balance += amount;
        } else if (type === 'Expense') {
            account.balance -= amount;
        } else if (type === 'Transfer' && toAccountId) {
            account.balance -= amount;
            const targetAccount = await Account.findById(toAccountId);
            targetAccount.balance += amount;
            await targetAccount.save();
        }
        await account.save();

        return NextResponse.json(transaction, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const body = await req.json();
        const oldTx = await Transaction.findById(id);
        if (!oldTx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

        // 1. Revert old balance changes
        const oldAcc = await Account.findById(oldTx.accountId);
        if (oldAcc) {
            if (oldTx.type === 'Income') oldAcc.balance -= oldTx.amount;
            else if (oldTx.type === 'Expense' || oldTx.type === 'Transfer') oldAcc.balance += oldTx.amount;
            await oldAcc.save();
        }
        if (oldTx.type === 'Transfer' && oldTx.toAccountId) {
            const oldTargetAcc = await Account.findById(oldTx.toAccountId);
            if (oldTargetAcc) {
                oldTargetAcc.balance -= oldTx.amount;
                await oldTargetAcc.save();
            }
        }

        // 2. Apply new changes
        const updatedTx = await Transaction.findByIdAndUpdate(id, body, { new: true });

        // 3. Apply new balance changes
        const newAcc = await Account.findById(updatedTx.accountId);
        if (newAcc) {
            if (updatedTx.type === 'Income') newAcc.balance += updatedTx.amount;
            else if (updatedTx.type === 'Expense' || updatedTx.type === 'Transfer') newAcc.balance -= updatedTx.amount;
            await newAcc.save();
        }
        if (updatedTx.type === 'Transfer' && updatedTx.toAccountId) {
            const newTargetAcc = await Account.findById(updatedTx.toAccountId);
            if (newTargetAcc) {
                newTargetAcc.balance += updatedTx.amount;
                await newTargetAcc.save();
            }
        }

        return NextResponse.json(updatedTx);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const tx = await Transaction.findById(id);
        if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

        // Revert balance changes before deleting
        const acc = await Account.findById(tx.accountId);
        if (acc) {
            if (tx.type === 'Income') acc.balance -= tx.amount;
            else if (tx.type === 'Expense' || tx.type === 'Transfer') acc.balance += tx.amount;
            await acc.save();
        }
        if (tx.type === 'Transfer' && tx.toAccountId) {
            const targetAcc = await Account.findById(tx.toAccountId);
            if (targetAcc) {
                targetAcc.balance -= tx.amount;
                await targetAcc.save();
            }
        }

        await Transaction.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
