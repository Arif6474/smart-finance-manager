import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        insights: [
            {
                type: { type: String, enum: ['success', 'warning', 'tip'], required: true },
                title: { type: String, required: true },
                description: { type: String, required: true }
            }
        ],
        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

// We should probably index by userId and createdAt for efficient daily filtering
aiInsightSchema.index({ userId: 1, createdAt: -1 });

// Cleanup existing models (for dev hot-reloading)
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.AiInsight;
}

export default mongoose.models.AiInsight || mongoose.model('AiInsight', aiInsightSchema);
