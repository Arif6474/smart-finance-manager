import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        await dbConnect();

        // 1. Auth check
        const token = cookies().get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = verifyToken(token);
        const { fromAccountId, toAccountId, amount, description } = await req.json();

        // 2. Validation
        if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid transfer details' }, { status: 400 });
        }

        if (fromAccountId === toAccountId) {
            return NextResponse.json({ error: 'Source and destination accounts must be different' }, { status: 400 });
        }

        // 3. Perform transfer within a transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Find accounts and check ownership
            const fromAccount = await Account.findOne({ _id: fromAccountId, userId: decoded.userId }).session(session);
            const toAccount = await Account.findOne({ _id: toAccountId, userId: decoded.userId }).session(session);

            if (!fromAccount || !toAccount) {
                throw new Error('One or both accounts not found or unauthorized');
            }

            if (fromAccount.balance < amount) {
                throw new Error('Insufficient balance in source account');
            }

            // Update balances
            fromAccount.balance -= amount;
            toAccount.balance += amount;

            await fromAccount.save({ session });
            await toAccount.save({ session });

            // Create transfer transaction
            await Transaction.create([{
                userId: decoded.userId,
                accountId: fromAccountId,
                toAccountId: toAccountId,
                type: 'Transfer',
                amount: amount,
                category: 'Transfer',
                description: description || `Transfer from ${fromAccount.name} to ${toAccount.name}`,
                date: new Date()
            }], { session });

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ message: 'Transfer successful' });
        } catch (innerError: any) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ error: innerError.message }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Transfer API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
