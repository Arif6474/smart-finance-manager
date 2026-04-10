import dbConnect from './db';
import User from '@/models/User';

export interface SubscriptionStatus {
    isAllowed: boolean;
    reason: string;
    currentPlan: 'pro' | 'free-trial' | 'free' | 'expired' | 'admin';
    daysRemaining: number;
    expiryDate: Date | null;
    isProActive: boolean;
    isTrialExpired: boolean;
}

/**
 * Checks if a user is allowed to create or modify documents based on their subscription status.
 * Returns an object indicating if access is allowed and the reason if not.
 */
export async function checkSubscription(userId: string): Promise<{ isAllowed: boolean; reason: string }> {
    const details = await getSubscriptionDetails(userId);
    return {
        isAllowed: details.isAllowed,
        reason: details.reason
    };
}

/**
 * Gets detailed subscription information for a user.
 */
export async function getSubscriptionDetails(userId: string): Promise<SubscriptionStatus> {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
        return {
            isAllowed: false,
            reason: 'User not found',
            currentPlan: 'free',
            daysRemaining: 0,
            expiryDate: null,
            isProActive: false,
            isTrialExpired: true
        };
    }

    // Admins and SuperAdmins always have full access
    if (user.level === 'admin' || user.level === 'superAdmin') {
        return {
            isAllowed: true,
            reason: 'Admin access',
            currentPlan: 'admin',
            daysRemaining: 9999,
            expiryDate: null,
            isProActive: true,
            isTrialExpired: false
        };
    }

    // Check for active Pro plan
    const isProActive =
        user.plan === 'pro' &&
        user.subscriptionExpiryDate &&
        new Date() < new Date(user.subscriptionExpiryDate);

    if (isProActive) {
        const expiryDate = new Date(user.subscriptionExpiryDate);
        const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
        return {
            isAllowed: true,
            reason: 'Active Pro plan',
            currentPlan: 'pro',
            daysRemaining,
            expiryDate,
            isProActive: true,
            isTrialExpired: false
        };
    }

    // Check for active Free Trial (14 days)
    if (user.trialStartDate) {
        const trialEndDate = new Date(user.trialStartDate);
        trialEndDate.setDate(trialEndDate.getDate() + 14);
        const isTrialActive = new Date() < trialEndDate;

        if (isTrialActive) {
            const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
            return {
                isAllowed: true,
                reason: 'Active Free Trial',
                currentPlan: 'free-trial',
                daysRemaining,
                expiryDate: trialEndDate,
                isProActive: false,
                isTrialExpired: false
            };
        }
    }

    // If we reach here, trial is expired and no active Pro plan
    return {
        isAllowed: false,
        reason: 'Free trial has expired. Please upgrade to Pro to continue creating documents.',
        currentPlan: 'expired',
        daysRemaining: 0,
        expiryDate: null,
        isProActive: false,
        isTrialExpired: true
    };
}
