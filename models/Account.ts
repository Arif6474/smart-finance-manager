import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true }, // e.g., "Main Bank", "Cash", "Rocket"
        type: {
            type: String,
            enum: ['Bank', 'Cash', 'Mobile Banking', 'Other'],
            default: 'Cash'
        },
        balance: { type: Number, default: 0 },
        currency: { type: String, default: 'BDT' },
    },
    { timestamps: true }
);

export default mongoose.models.Account || mongoose.model('Account', accountSchema);
