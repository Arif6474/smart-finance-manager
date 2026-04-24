'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Book, 
    ChevronRight, 
    LayoutDashboard, 
    Wallet, 
    Receipt, 
    Target, 
    HandCoins, 
    Goal as GoalIcon, 
    RotateCw, 
    BarChart3, 
    Bell, 
    HeartPulse,
    Sparkles,
    Zap,
    Cpu,
    ArrowRightLeft,
    ShieldCheck
} from 'lucide-react';

const sections = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: Book,
        content: (
            <div className="space-y-6">
                <p className="text-lg text-muted-foreground">
                    Welcome to Smart Finance Manager. Achieve financial clarity through smart tracking, automated budgeting, and AI-driven insights.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            <Zap className="text-primary" size={18} />
                            Quick Setup
                        </h4>
                        <p className="text-sm text-muted-foreground">Start by adding your main accounts in the Accounts section. This provides the foundation for all your tracking.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            <Sparkles className="text-amber-500" size={18} />
                            AI Insights
                        </h4>
                        <p className="text-sm text-muted-foreground">The more transactions you add, the better our AI can understand your patterns and offer personalized advice.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: LayoutDashboard,
        content: (
            <div className="space-y-4 ">
                <p>The Dashboard is your financial control center, providing a real-time summary of your financial status.</p>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded-full bg-primary/10 text-primary"><ChevronRight size={14} /></div>
                        <div><span className="font-semibold">Total Balance:</span> Aggregated balance across all your connected accounts.</div>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded-full bg-primary/10 text-primary"><ChevronRight size={14} /></div>
                        <div><span className="font-semibold">Monthly Overview:</span> A visual snapshot of your income vs. expenses for the current month.</div>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1 p-1 rounded-full bg-primary/10 text-primary"><ChevronRight size={14} /></div>
                        <div><span className="font-semibold">AI Widget:</span> Instant access to the latest financial tips generated specifically for you.</div>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: 'accounts',
        title: 'Account Management',
        icon: Wallet,
        content: (
            <div className="space-y-4">
                <p>Manage all your money in one place. We support multiple account types to reflect your real-world finances.</p>
                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                    <h5 className="font-bold text-sm mb-2 uppercase tracking-wider opacity-60">Supported Types</h5>
                    <div className="flex flex-wrap gap-2">
                        {['Bank', 'Cash', 'Mobile Banking (bKash/Rocket)', 'Savings'].map(type => (
                            <span key={type} className="px-3 py-1 bg-background border border-border rounded-full text-xs font-medium">{type}</span>
                        ))}
                    </div>
                </div>
                <p className="text-sm italic">Note: Account balances are updated in real-time as you record transactions or transfers.</p>
            </div>
        )
    },
    {
        id: 'transactions',
        title: 'Transactions',
        icon: Receipt,
        content: (
            <div className="space-y-4">
                <p>Record every movement of money with detail and precision.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <div className="font-bold text-sm mb-1">Income</div>
                        <p className="text-xs opacity-80 text-foreground">Money coming in. Increases account balance.</p>
                    </div>
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400">
                        <div className="font-bold text-sm mb-1">Expense</div>
                        <p className="text-xs opacity-80 text-foreground">Money going out. Decreases account balance.</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <div className="font-bold text-sm mb-1">Transfer</div>
                        <p className="text-xs opacity-80 text-foreground">Moving money between your own accounts.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'budgets',
        title: 'Smart Budgeting',
        icon: Target,
        content: (
            <div className="space-y-4">
                <p>Stay disciplined with category-based spending limits.</p>
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <h4 className="font-bold mb-3 flex items-center gap-2">How it works:</h4>
                    <ol className="space-y-2 text-sm list-decimal list-inside">
                        <li>Set a monthly limit for a specific category (e.g., "Food").</li>
                        <li>As you add expenses in that category, your budget progress updates.</li>
                        <li>Receive visual warnings when approaching or exceeding limits.</li>
                    </ol>
                </div>
            </div>
        )
    },
    {
        id: 'ai-insights',
        title: 'AI Financial Assistant',
        icon: Sparkles,
        content: (
            <div className="space-y-4">
                <p>Personalized advice powered by state-of-the-art AI (OpenAI & Gemini).</p>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                        <div className="p-2 h-fit bg-emerald-500/10 text-emerald-500 rounded-lg"><ShieldCheck size={20} /></div>
                        <div>
                            <h5 className="font-bold text-sm">Proactive Monitoring</h5>
                            <p className="text-xs text-muted-foreground mt-1">The AI monitors your spending habits daily to identify areas for improvement.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                        <div className="p-2 h-fit bg-amber-500/10 text-amber-500 rounded-lg"><Cpu size={20} /></div>
                        <div>
                            <h5 className="font-bold text-sm">Data Integration</h5>
                            <p className="text-xs text-muted-foreground mt-1">Insights are generated by analyzing your Accounts, Transactions, Budgets, and Debts together.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'goals',
        title: 'Financial Goals',
        icon: GoalIcon,
        content: (
            <div className="space-y-4">
                <p>Save for what matters most by setting and tracking financial targets.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-card border border-border">
                        <h5 className="font-bold text-sm mb-1">Target Tracking</h5>
                        <p className="text-xs text-muted-foreground">Set specific amounts and deadlines for goals like "Emergency Fund" or "New Laptop".</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border">
                        <h5 className="font-bold text-sm mb-1">Progress Visualization</h5>
                        <p className="text-xs text-muted-foreground">Monitor your progress with visual bars showing exactly how close you are to your target.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'subscriptions',
        title: 'Subscriptions',
        icon: RotateCw,
        content: (
            <div className="space-y-4">
                <p>Manage your recurring payments and never get surprised by a renewal again.</p>
                <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Track active services (Netflix, Gym, etc.)</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Monitor next billing dates</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Calculate total monthly subscription costs</li>
                </ul>
            </div>
        )
    },
    {
        id: 'reminders',
        title: 'Reminders',
        icon: Bell,
        content: (
            <div className="space-y-4">
                <p>Stay on top of your financial tasks and bill payments.</p>
                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-sm">Set custom alerts with priority levels (Low, Medium, High) to ensure you never miss a deadline. Mark tasks as completed once they are done.</p>
                </div>
            </div>
        )
    },
    {
        id: 'payables',
        title: 'Payables & Receivables',
        icon: HandCoins,
        content: (
            <div className="space-y-4">
                <p>Manage debts and loans with friends, family, or institutions.</p>
                <div className="space-y-3">
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <h5 className="font-bold text-sm">Loan & EMI Support</h5>
                        <p className="text-xs text-muted-foreground mt-1">Specialized tracking for loans, including principal, interest rates, and automated EMI calculations.</p>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <h5 className="font-bold text-sm">Cash Flow Integration</h5>
                        <p className="text-xs text-muted-foreground mt-1">Creating a new debt entry can optionally trigger an initial transaction to reflect the money movement.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'health-score',
        title: 'Financial Health Score',
        icon: HeartPulse,
        content: (
            <div className="space-y-4">
                <p>Gamify your financial journey with a dynamic health score.</p>
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                    <h5 className="font-bold text-sm mb-2">How it's calculated:</h5>
                    <p className="text-sm text-muted-foreground">Your score is based on your savings rate, budget adherence, and debt-to-income ratio. Improve your habits to see your score climb!</p>
                </div>
            </div>
        )
    },
    {
        id: 'reports',
        title: 'Reports & Analytics',
        icon: BarChart3,
        content: (
            <div className="space-y-4">
                <p>Gain deep insights into your financial behavior through data visualization.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <h5 className="font-bold text-sm">Visual Charts</h5>
                        <p className="text-xs text-muted-foreground mt-1">Interactive bar and line charts showing income vs. expense trends.</p>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <h5 className="font-bold text-sm">Category Breakdown</h5>
                        <p className="text-xs text-muted-foreground mt-1">Pie charts showing exactly where your money is going.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'security',
        title: 'Security & Pro Membership',
        icon: ShieldCheck,
        content: (
            <div className="space-y-4">
                <p>Learn about how we protect your data and how to unlock premium features.</p>
                <div className="space-y-3">
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <h5 className="font-bold text-sm">Secure Authentication</h5>
                        <p className="text-xs text-muted-foreground mt-1">We use industry-standard JWT (JSON Web Tokens) and offer Google OAuth for a secure, passwordless login experience.</p>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <h5 className="font-bold text-sm">Pro Membership Upgrade</h5>
                        <p className="text-xs text-muted-foreground mt-1">Unlock advanced features by upgrading to Pro. We support manual payment verification via bKash, Nagad, and Bank Transfer. Once you submit your transaction ID, an admin will review and approve your request within 24 hours.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'connectivity',
        title: 'How It Works Together',
        icon: ArrowRightLeft,
        content: (
            <div className="space-y-6">
                <p>The power of Smart Finance Manager lies in the deep integration between its features.</p>
                <div className="space-y-4">
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <h5 className="font-bold text-primary mb-2">The Transaction Engine</h5>
                        <p className="text-sm text-muted-foreground">Every transaction you enter ripples through the system. It updates your <strong>Account Balance</strong>, calculates against your <strong>Monthly Budget</strong>, and factors into your <strong>Financial Health Score</strong>.</p>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-xl">
                        <h5 className="font-bold text-amber-500 mb-2">The Intelligence Core</h5>
                        <p className="text-sm text-muted-foreground">The AI doesn't just look at spending. It looks at your <strong>Debt-to-Income ratio</strong>, your <strong>Savings Goals</strong>, and your <strong>Subscription costs</strong> to give you a truly holistic financial strategy.</p>
                    </div>
                </div>
            </div>
        )
    }
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSections = sections.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeData = sections.find(s => s.id === activeSection) || sections[0];

    return (
        <div className="min-h-screen pt-4 pb-12 px-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                    Documentation
                </h1>
                <p className="text-muted-foreground">Master your finances with our detailed guide and tutorials.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search docs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <nav className="space-y-1">
                        {filteredSections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                                            : 'text-muted-foreground hover:bg-card hover:text-foreground'
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span>{section.title}</span>
                                    {isActive && <motion.div layoutId="doc-active" className="ml-auto"><ChevronRight size={14} /></motion.div>}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-sm"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                    <activeData.icon size={28} />
                                </div>
                                <h2 className="text-2xl font-bold">{activeData.title}</h2>
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                {activeData.content}
                            </div>

                            {/* Footer navigation */}
                            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                                {sections.indexOf(activeData) > 0 ? (
                                    <button 
                                        onClick={() => setActiveSection(sections[sections.indexOf(activeData) - 1].id)}
                                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <ChevronRight className="rotate-180" size={16} />
                                        {sections[sections.indexOf(activeData) - 1].title}
                                    </button>
                                ) : <div />}

                                {sections.indexOf(activeData) < sections.length - 1 ? (
                                    <button 
                                        onClick={() => setActiveSection(sections[sections.indexOf(activeData) + 1].id)}
                                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 ml-auto"
                                    >
                                        {sections[sections.indexOf(activeData) + 1].title}
                                        <ChevronRight size={16} />
                                    </button>
                                ) : <div />}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
