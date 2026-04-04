import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGoal extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: Date;
    color?: string;
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
}

const GoalSchema: Schema<IGoal> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        name: {
            type: String,
            required: [true, 'Goal name is required'],
            trim: true,
            maxlength: [100, 'Goal name cannot be more than 100 characters']
        },
        targetAmount: {
            type: Number,
            required: [true, 'Target amount is required'],
            min: [1, 'Target amount must be greater than 0']
        },
        currentAmount: {
            type: Number,
            default: 0,
            min: [0, 'Current amount cannot be negative']
        },
        deadline: {
            type: Date,
        },
        color: {
            type: String,
            default: '#14b8a6' // default primary color
        },
        icon: {
            type: String,
            default: 'Target'
        }
    },
    {
        timestamps: true
    }
);

// Prevent mongoose from compiling the model multiple times in development
const Goal: Model<IGoal> = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

export default Goal;
