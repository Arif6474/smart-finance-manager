// Payment configuration for Bangladesh users
export const PAYMENT_CONFIG = {
    methods: {
        bkash: {
            id: 'bkash',
            name: 'bKash',
            number: '01XXXXXXXXXXXX', // Replace with actual bKash number
            instruction: 'Send ৳100 using "Send Money"',
            color: '#E2136E',
        },
        nagad: {
            id: 'nagad',
            name: 'Nagad',
            number: '01XXXXXXXXXXXX', // Replace with actual Nagad number
            instruction: 'Send ৳100',
            color: '#F47C20',
        },
        bank: {
            id: 'bank',
            name: 'BRAC Bank Transfer',
            accountName: 'Smart Finance Manager',
            accountNumber: 'XXXXXXXXXXXXXXXXXXXX', // Replace with actual account number
            branchName: 'Dhaka Main Branch',
            instruction: 'Transfer ৳100 and enter the reference/transaction ID',
            color: '#00A3E0',
        },
    },
    pricing: {
        proMonthly: 100, // ৳100
        currency: '৳',
        trialDays: 14,
    },
};

export const getPaymentMethod = (methodId: string) => {
    return PAYMENT_CONFIG.methods[methodId as keyof typeof PAYMENT_CONFIG.methods];
};
