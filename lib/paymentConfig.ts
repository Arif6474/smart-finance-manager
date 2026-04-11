// Payment configuration for Bangladesh users
export const PLANS = {
    MONTHLY: { id: 'monthly', name: 'Pro Monthly', price: 100, duration: 30 },
    SIX_MONTHS: { id: '6months', name: 'Pro 6 Months', price: 550, duration: 180 },
    YEARLY: { id: 'yearly', name: 'Pro Yearly', price: 1000, duration: 365 },
};

export const PAYMENT_CONFIG = {
    methods: {
        bkash: {
            id: 'bkash',
            name: 'bKash',
            number: '01820082894',
            instruction: 'Send money to our bKash number',
            color: '#E2136E',
        },
        nagad: {
            id: 'nagad',
            name: 'Nagad',
            number: '01820082894',
            instruction: 'Send money to our Nagad number',
            color: '#F47C20',
        },
        bank: {
            id: 'bank',
            name: 'BRAC Bank Transfer',
            accountName: 'Md. Ariful Islam',
            accountNumber: '1062488210001',
            branchName: 'Gulshan Branch',
            instruction: 'Transfer to our bank account',
            color: '#00A3E0',
        },
    },
    pricing: {
        currency: '৳',
        trialDays: 14,
    },
};

export const getPaymentMethod = (methodId: string) => {
    return PAYMENT_CONFIG.methods[methodId as keyof typeof PAYMENT_CONFIG.methods];
};
