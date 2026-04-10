import dbConnect from './db';
import User from '@/models/User';

export interface SubscriptionStatus {
    isAllowed: boolean;
    reason: string;
    currentPlan: string;
}

/**
 * Checks if a user is allowed to create or modify documents based on their subscription status.
 * Returns an object indicating if access is allowed and the reason if not.
 */
export async function checkSubscription(userId: string): Promise<SubscriptionStatus> {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
        return { isAllowed: false, reason: 'User not found', currentPlan: 'none' };
    }

    // Admins and SuperAdmins always have full access
    if (user.level === 'admin' || user.level === 'superAdmin') {
        return { isAllowed: true, reason: 'Admin access', currentPlan: 'admin' };
    }

    // Check for active Pro plan
    const isProActive =
        user.plan === 'pro' &&
        user.subscriptionExpiryDate &&
        new Date() < new Date(user.subscriptionExpiryDate);

    if (isProActive) {
        return { isAllowed: true, reason: 'Active Pro plan', currentPlan: 'pro' };
    }

    // Check for active Free Trial (14 days)
    if (user.trialStartDate) {
        const trialEndDate = new Date(user.trialStartDate);
        trialEndDate.setDate(trialEndDate.getDate() + 14);
        const isTrialActive = new Date() < trialEndDate;

        if (isTrialActive) {
            return { isAllowed: true, reason: 'Active Free Trial', currentPlan: 'free-trial' };
        }
    }

    // If we reach here, trial is expired and no active Pro plan
    return {
        isAllowed: false,
        reason: 'Free trial has expired. Please upgrade to Pro to continue creating documents.',
        currentPlan: 'expired',
    };
}
