'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, Zap, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import UpgradeModal from './UpgradeModal';

interface PlanStatus {
    currentPlan: 'free' | 'free-trial' | 'pro';
    isTrialExpired: boolean;
    isProActive: boolean;
    daysRemaining: number;
    expiryDate: string | null;
}

export default function PlanStatusWidget() {
    const { user } = useAuth();
    const [planStatus, setPlanStatus] = useState<PlanStatus | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            checkPlanStatus();
        }
    }, [user]);

    const checkPlanStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/payments/check-trial', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error('Failed to check plan status');

            const data = await res.json();
            setPlanStatus(data);

            // Show upgrade modal if trial expired and not pro
            if (data.isTrialExpired && !data.isProActive) {
                setShowUpgradeModal(true);
            }
        } catch (err: any) {
            console.error('Error checking plan status:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !planStatus) return null;

    const { currentPlan, daysRemaining, expiryDate } = planStatus;

    if (currentPlan === 'pro') {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary/10 to-teal-500/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-4"
            >
                <Zap className="text-primary shrink-0 mt-1" size={20} />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">Pro Plan Active</h3>
                    <p className="text-sm text-muted-foreground">
                        Expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                    </p>
                    {expiryDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {new Date(expiryDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </motion.div>
        );
    }

    if (currentPlan === 'free-trial') {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-warning/10 to-orange-500/10 border border-warning/20 rounded-2xl p-4 space-y-3"
            >
                <div className="flex items-start gap-4">
                    <Calendar className="text-warning shrink-0 mt-1" size={20} />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">Free Trial Active</h3>
                        <p className="text-sm text-muted-foreground">
                            {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full btn-primary py-2 rounded-lg text-sm font-medium"
                >
                    Choose Plan Before Trial Ends
                </button>
            </motion.div>
        );
    }

    // Trial expired, show upgrade CTA
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-destructive/10 to-red-500/10 border border-destructive/20 rounded-2xl p-4 space-y-3"
        >
            <div className="flex items-start gap-4">
                <AlertCircle className="text-destructive shrink-0 mt-1" size={20} />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">Trial Period Ended</h3>
                    <p className="text-sm text-muted-foreground">
                        Upgrade to Pro to continue using all features
                    </p>
                </div>
            </div>
            <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full bg-destructive text-white py-2 rounded-lg text-sm font-medium hover:bg-destructive/90 transition-all"
            >
                Upgrade Now
            </button>

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                onSuccess={() => {
                    checkPlanStatus();
                    setShowUpgradeModal(false);
                }}
            />
        </motion.div>
    );
}
