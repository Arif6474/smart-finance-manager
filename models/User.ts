import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        image: { type: String, default: '' },
        phone: { type: String, default: '' },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },

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
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.models.User || mongoose.model('User', userSchema);
