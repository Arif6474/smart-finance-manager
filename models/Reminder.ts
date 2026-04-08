import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        description: { type: String },
        remindAt: { type: Date, required: true },
        type: {
            type: String,
            enum: ['Bill', 'EMI', 'Goal', 'Budget', 'General'],
            default: 'General'
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Dismissed'],
            default: 'Pending'
        },
        relatedId: { type: mongoose.Schema.Types.ObjectId }, // Generic reference
        isRecurring: { type: Boolean, default: false },
        frequency: {
            type: String,
            enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        }
    },
    { timestamps: true }
);

// Delete existing model in development to ensure schema changes are applied instantly on hot reload
if (mongoose.models.Reminder) {
    delete mongoose.models.Reminder;
}

export default mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);
