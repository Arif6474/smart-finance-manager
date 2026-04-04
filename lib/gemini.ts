import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || 'unconfigured');

export interface FinancialDataSummary {
    totalBalance: number;
    month: string;
    totalIncomeThisMonth: number;
    totalExpenseThisMonth: number;
    spendingByCategory: Record<string, number>;
    budgets: Array<{ category: string; limit: number; spent: number }>;
}

export interface Insight {
    type: 'success' | 'warning' | 'tip';
    title: string;
    description: string;
}

export async function generateFinancialInsights(data: FinancialDataSummary): Promise<Insight[]> {
    if (!apiKey) {
        throw new Error("Cannot generate insights: GEMINI_API_KEY is missing.");
    }

    // Determine the model to use
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are an expert, empathetic personal financial advisor. Analyze the following financial data summary for a user for the month of ${data.month}. 

Data:
- Total Current Balance Across All Accounts: ৳${data.totalBalance}
- Income This Month: ৳${data.totalIncomeThisMonth}
- Expense This Month: ৳${data.totalExpenseThisMonth}
- Spending By Category: ${JSON.stringify(data.spendingByCategory)}
- Active Budgets & Usage: ${JSON.stringify(data.budgets)}

Your task is to provide exactly 3 to 4 actionable insights based on this data. Each insight must fall into one of three categories:
1. "success": For positive behavior (e.g., staying well under budget, high savings rate).
2. "warning": For negative behavior or risks (e.g., overspending in a category, spending exceeding income).
3. "tip": For actionable future advice (e.g., suggesting a budget limit for an unbudgeted high-spend category, or general savings tips based on their data).

CRITICAL INSTRUCTIONS:
- Do NOT output any markdown blocks (like \`\`\`json). 
- Output ONLY a raw, valid JSON array of objects. 
- Ensure the JSON is parseable by JSON.parse().
- Limit descriptions to 1-2 concise, engaging sentences.
- Use the currency symbol ৳ where appropriate.

Provide the raw JSON array in this exact schema:
[
  {
    "type": "warning" | "success" | "tip",
    "title": "Short Catchy Title",
    "description": "The concise actionable insight or praise."
  }
]
`;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean the text in case the model ignored instructions and wrapped in markdown
        const cleanedText = responseText.replace(/```json\n?|\n?```/gi, '').trim();

        try {
            const parsedInsights = JSON.parse(cleanedText) as Insight[];
            if (!Array.isArray(parsedInsights)) {
                throw new Error("Response is not an array");
            }
            return parsedInsights.slice(0, 4); // ensure max 4 insights
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON output:", responseText);
            throw new Error("The AI returned a malformed response.");
        }
    } catch (error: any) {
        console.error("Gemini AI API Error:", error);
        throw new Error(`AI generation failed: ${error.message}`);
    }
}
