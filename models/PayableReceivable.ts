import mongoose from 'mongoose';

const payableReceivableSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['Payable', 'Receivable'], required: true },
        person: { type: String, required: true },
        amount: { type: Number, required: true },
        description: { type: String },
        dueDate: { type: Date },
        status: { type: String, enum: ['Pending', 'Paid', 'Partial'], default: 'Pending' },
    },
    { timestamps: true }
);

export default mongoose.models.PayableReceivable || mongoose.model('PayableReceivable', payableReceivableSchema);
