import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
        type: { type: String, enum: ['Income', 'Expense', 'Transfer'], required: true },
        amount: { type: Number, required: true },
        category: { type: String, required: true }, // e.g., "Food", "Salary", "Rent"
        description: { type: String },
        date: { type: Date, default: Date.now },
        // For transfers:
        toAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    },
    { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
