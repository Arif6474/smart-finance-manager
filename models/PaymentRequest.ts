import mongoose from 'mongoose';

const paymentRequestSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        userEmail: { type: String, required: true },
        userName: { type: String, required: true },
        paymentMethod: { type: String, enum: ['bkash', 'nagad', 'bank'], required: true },
        transactionId: { type: String, required: true },
        senderNumber: { type: String, default: '' },
        screenshotUrl: { type: String, default: '' },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        approvedAt: { type: Date },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rejectionReason: { type: String, default: '' },
        amount: { type: Number, default: 100 }, // ৳100
    },
    { timestamps: true }
);

export default mongoose.models.PaymentRequest || mongoose.model('PaymentRequest', paymentRequestSchema);
