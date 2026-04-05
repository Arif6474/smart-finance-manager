import mongoose from 'mongoose';

const payableReceivableSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['Payable', 'Receivable'], required: true },
        person: { type: String, required: true },
        amount: { type: Number, required: true },
        category: {
            type: String,
            enum: ['Bill', 'Loan', 'EMI', 'Subscription', 'Personal', 'Rent', 'Other'],
            default: 'Other'
        },
        description: { type: String },
        dueDate: { type: Date },
        status: { type: String, enum: ['Pending', 'Paid', 'Partial'], default: 'Pending' },
        accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
        paidAmount: { type: Number, default: 0 },

        // Loan-specific fields
        isLoan: { type: Boolean, default: false },
        totalPrincipal: { type: Number },
        interestRate: { type: Number }, // Annual %
        termMonths: { type: Number },
        emiAmount: { type: Number },
        startDate: { type: Date },
        remainingPrincipal: { type: Number },
        paidMonths: { type: Number, default: 0 },
    },
    { timestamps: true }
);
// Delete existing model in development to ensure schema changes are applied instantly on hot reload
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.PayableReceivable;
}

export default mongoose.models.PayableReceivable || mongoose.model('PayableReceivable', payableReceivableSchema);
