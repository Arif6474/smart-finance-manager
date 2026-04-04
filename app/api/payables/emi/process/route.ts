import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';


import PayableReceivable from '@/models/PayableReceivable';
import Transaction from '@/models/Transaction';
import Account from '@/models/Account';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const now = new Date();
        console.log('EMI Process: Checking for due loans. Current time:', now);

        const dueLoans = await PayableReceivable.find({
            isLoan: true,
            status: { $ne: 'Paid' },
            dueDate: { $lte: now }
        });

        console.log(`EMI Process: Found ${dueLoans.length} due loans`);

        if (dueLoans.length === 0) {
            return NextResponse.json({ message: 'No EMIs due for processing.' });
        }

        let processedCount = 0;

        for (const loan of dueLoans) {
            try {
                console.log(`EMI Process: Processing loan ${loan._id} for ${loan.person}, EMI: ${loan.emiAmount}`);

                // 1. Calculate Interest and Principal components
                const monthlyRate = (loan.interestRate || 0) / 12 / 100;
                const interestComponent = Math.round((loan.remainingPrincipal || 0) * monthlyRate);
                const principalComponent = (loan.emiAmount || 0) - interestComponent;

                // 2. Create Transaction (Income or Expense based on loan type)
                console.log(`EMI Process: loan.accountId = "${loan.accountId}" (type: ${typeof loan.accountId})`);
                if (loan.accountId) {
                    const account = await Account.findById(loan.accountId);
                    console.log(`EMI Process: Account lookup result:`, account ? `Found "${account.name}" balance=${account.balance}` : 'NOT FOUND');
                    if (account) {
                        const isPayable = loan.type === 'Payable';
                        const tType = isPayable ? 'Expense' : 'Income';
                        const tDesc = isPayable ? `EMI Payment: ${loan.person}` : `EMI Received: ${loan.person}`;
                        const transaction = new Transaction({
                            userId: loan.userId,
                            accountId: loan.accountId,
                            type: tType,
                            amount: loan.emiAmount,
                            category: 'EMI',
                            description: tDesc,
                            date: loan.dueDate
                        });
                        
                        if (isPayable) {
                            account.balance -= loan.emiAmount;
                        } else {
                            account.balance += loan.emiAmount;
                        }
                        
                        await account.save();
                        console.log(`EMI Process: Account balance updated to ${account.balance}`);
                        await transaction.save();
                        console.log(`EMI Process: Transaction saved for ${loan.emiAmount} as ${tType}`);
                    } else {
                        console.warn(`EMI Process: Account ${loan.accountId} not found, skipping transaction`);
                    }
                } else {
                    console.log(`EMI Process: No account linked for ${loan.person}, updating loan stats only`);
                }

                // 3. Update Loan Stats
                loan.remainingPrincipal = (loan.remainingPrincipal || 0) - principalComponent;
                loan.paidMonths = (loan.paidMonths || 0) + 1;

                // Calculate next due date (Add 1 month)
                const nextDate = new Date(loan.dueDate);
                nextDate.setMonth(nextDate.getMonth() + 1);
                loan.dueDate = nextDate;

                // Check if loan is completed
                if (loan.paidMonths >= loan.termMonths || (loan.remainingPrincipal || 0) <= 0) {
                    loan.status = 'Paid';
                    loan.remainingPrincipal = 0;
                }

                await loan.save();
                processedCount++;
                console.log(`EMI Process: Successfully updated loan ${loan._id}`);
            } catch (err) {
                console.error(`EMI Process: Failed to process EMI for ${loan._id}:`, err);
            }
        }

        return NextResponse.json({ message: `Successfully processed ${processedCount} EMIs.` });
    } catch (error: any) {
        console.error('EMI Process Critical Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
