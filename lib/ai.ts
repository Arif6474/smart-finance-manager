import { OpenAI } from 'openai';

// Initialize the OpenAI API client
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn("OPENAI_API_KEY is not defined in the environment variables.");
}

const openai = new OpenAI({
    apiKey: apiKey || 'unconfigured',
});

export interface FinancialDataSummary {
    totalBalance: number;
    month: string;
    totalIncomeThisMonth: number;
    totalExpenseThisMonth: number;
    spendingByCategory: Record<string, number>;
    budgets: Array<{ category: string; limit: number; spent: number }>;
    significantTransactions?: Array<{ description: string, amount: number, date: string, category: string }>;
}

export interface Insight {
    type: 'success' | 'warning' | 'tip';
    title: string;
    description: string;
}

export interface AiResponse {
    insights: Insight[];
    summary: string;
}

export async function generateFinancialInsights(data: FinancialDataSummary): Promise<AiResponse> {
    if (!apiKey) {
        throw new Error("Cannot generate insights: OPENAI_API_KEY is missing.");
    }

    const prompt = `
You are an expert, empathetic personal financial advisor. Analyze the following financial data summary for a user for the month of ${data.month}. 

Data:
- Total Current Balance Across All Accounts: ৳${data.totalBalance}
- Income This Month: ৳${data.totalIncomeThisMonth}
- Expense This Month: ৳${data.totalExpenseThisMonth}
- Spending By Category: ${JSON.stringify(data.spendingByCategory)}
- Active Budgets & Usage: ${JSON.stringify(data.budgets)}
${data.significantTransactions && data.significantTransactions.length > 0 
    ? `- Top/Significant Transactions: ${JSON.stringify(data.significantTransactions)}` 
    : ''}

Your task is to provide exactly 3 to 4 actionable insights and a high-level monthly summary.
Each insight must fall into one of three categories:
1. "success": For positive behavior (e.g., staying well under budget, high savings rate).
2. "warning": For negative behavior or risks (e.g., overspending in a category, spending exceeding income).
3. "tip": For actionable future advice (e.g., suggesting a budget limit for an unbudgeted high-spend category, or general savings tips based on their data).

The "summary" should be a 3-4 sentence, engaging, and professional at-a-glance overview of their financial health for the month, specifically mentioning any large transactions if relevant.

CRITICAL INSTRUCTIONS:
- Use the currency symbol ৳ where appropriate.
- Limit insight descriptions to 1-2 concise, engaging sentences.
- Ensure the JSON is parseable by JSON.parse().

Provide the response as a raw JSON object with an "insights" key and a "summary" key:
{
  "summary": "Enter the 3-4 sentence monthly overview here...",
  "insights": [
    {
      "type": "warning" | "success" | "tip",
      "title": "Short Catchy Title",
      "description": "The concise actionable insight or praise."
    }
  ]
}
`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: 'You are a financial advisor that only responds in JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });

        const responseText = response.choices[0].message.content || '{}';
        
        try {
            const parsedResponse = JSON.parse(responseText);
            const insights = Array.isArray(parsedResponse.insights) ? parsedResponse.insights : [];
            const summary = parsedResponse.summary || "Your monthly financial overview is ready.";
            
            return {
                insights: insights.slice(0, 4),
                summary: summary
            };
        } catch (parseError) {
            console.error("Failed to parse OpenAI JSON output:", responseText);
            throw new Error("The AI returned a malformed response.");
        }
    } catch (error: any) {
        console.error("OpenAI AI API Error:", error);
        throw new Error(`AI generation failed: ${error.message}`);
    }
}
