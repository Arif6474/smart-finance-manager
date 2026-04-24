# TakaHisab - System Architecture & Connectivity

This document explains the technical implementation of TakaHisab and how its various features are interconnected.

## 1. Technology Stack
The application is built using a modern full-stack architecture:
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens) & Google OAuth
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Integration**: OpenAI / Google Gemini

## 2. System Architecture
The project follows a modular structure where features are separated into dedicated pages and API routes.

### Frontend (app/)
- **Route Groups**:
  - `(dashboard)`: Contains all authenticated user features (Accounts, Budgets, etc.).
  - `(admin)`: Administrative tools (if applicable).
  - `(auth)`: Login, Signup, and Password reset flows.
- **Components**: Reusable UI elements located in the `/components` directory.

### Backend (api/)
- **API Routes**: Each feature has its own set of Next.js API routes for CRUD operations.
- **Database Connection**: Managed in `/lib/db.ts` to ensure efficient connection pooling.

## 3. Feature Connectivity & Data Flow
The power of the Smart Finance Manager lies in how its features work together.

### A. Transactions & Account Balances
**Connection**: *One-to-Many (Account has many Transactions)*
- When a **Transaction** is created, updated, or deleted, the system automatically calculates the impact on the associated **Account** balance.
- **Income**: Increases balance.
- **Expense**: Decreases balance.
- **Transfer**: Decreases the "From" account balance and increases the "To" account balance simultaneously.

### B. Transactions & Budgets
**Connection**: *Automatic Tracking*
- When an expense is recorded, the system checks if there is an active **Budget** for that category in the current month.
- The budget's "spent" amount is calculated dynamically by aggregating transactions for that category.

### C. AI Insights & The Data Ecosystem
**Connection**: *Data Aggregator*
- The **AI Insights** module is the most "connected" part of the system.
- To generate advice, it pulls data from:
  1. **Accounts**: Total liquidity.
  2. **Transactions**: Recent spending patterns.
  3. **Budgets**: Adherence to financial limits.
  4. **Subscriptions**: Upcoming fixed costs.
  5. **Payables/Receivables**: Debt obligations.
- This data is processed through an AI model (OpenAI/Gemini) to provide holistic financial health advice.

### D. Payables/Receivables & Transactions
**Connection**: *Initialization Flow*
- Creating a new **Payable** (debt you owe) or **Receivable** (debt owed to you) can optionally trigger an initial **Transaction**.
- For example, if you borrow 5000 BDT and link it to your "Cash" account, the system creates an "Income" transaction for 5000 BDT in that account.

### E. Financial Health Score
**Connection**: *Global Metric*
- The **Health Score** is calculated based on:
  - **Savings Rate**: (Income - Expense) / Income.
  - **Budget Adherence**: Percentage of budgets kept under the limit.
  - **Debt Management**: Ratio of payables vs. income.
- History is saved in the `ScoreHistory` model to track progress over time.

## 4. Data Models (Mongoose)
The core entities in the system are:
- `User`: Profile and authentication data.
- `Account`: Financial accounts (Bank, Cash, etc.).
- `Transaction`: Individual cash flow entries.
- `Budget`: Monthly spending limits per category.
- `Goal`: Savings targets.
- `Subscription`: Recurring payments.
- `Reminder`: Scheduled notifications.
- `PayableReceivable`: Debt and loan tracking.
- `AiInsight`: Stored AI-generated reports.
- `ScoreHistory`: Historical financial health scores.
