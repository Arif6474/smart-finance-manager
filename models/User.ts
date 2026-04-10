import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
        image: { type: String, default: '' },
        phone: { type: String, default: '' },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },

        // Subscription fields
        plan: { type: String, enum: ['free', 'pro'], default: 'free' },
        level: { type: String, enum: ['superAdmin', 'admin', 'user'], default: 'user' },
        trialStartDate: { type: Date },
        subscriptionExpiryDate: { type: Date },

        // Gamification & Habit Building fields
        streakCount: { type: Number, default: 0 },
        lastActiveDate: { type: Date },
        healthScore: { type: Number, default: 0 },
        badges: { type: [String], default: [] },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.models.User || mongoose.model('User', userSchema);
