import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        frequency: {
            type: String,
            enum: ['Weekly', 'Monthly', 'Yearly'],
            required: true
        },
        nextBillingDate: { type: Date, required: true },
        accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
        category: { type: String, required: true },
        autoPay: { type: Boolean, default: true },
        isActive: { type: Boolean, default: true },
        lastProcessedDate: { type: Date }
    },
    { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
