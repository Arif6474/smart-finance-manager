import mongoose from 'mongoose';

const scoreHistorySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        score: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        breakdown: {
            savingsScore: { type: Number, default: 0 },
            budgetScore: { type: Number, default: 0 },
            debtScore: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

// Delete existing model in development to ensure schema changes are applied instantly on hot reload
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.ScoreHistory;
}

export default mongoose.models.ScoreHistory || mongoose.model('ScoreHistory', scoreHistorySchema);
