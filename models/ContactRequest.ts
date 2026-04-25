import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
        ipAddress: { type: String, default: '' },
    },
    { timestamps: true }
);

export default mongoose.models.ContactRequest || mongoose.model('ContactRequest', contactRequestSchema);
