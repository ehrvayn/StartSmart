import Groq from "groq-sdk";
import type { BusinessPlan } from "./types";

export const analyzeBusiness = async (
  businessIdea: string,
): Promise<BusinessPlan> => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_ANALYSIS_API_KEY,
    });
    const message = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: `You are an expert business analyst. Provide honest, data-driven insights grounded in reality.

CRITICAL RULES:
- Base all analysis strictly on knowledge about the business
- Use professional language and practical recommendations
- Make feedback simple and realistic for users who may be ignorant
- Add tips like what places this is good for, or if it's terrible business
- Startup costs must be PHP estimate and realistic, not random numbers`,
        },
        {
          role: "user",
          content: `Analyze business viability: ${businessIdea}.

Absolutely make sure the data you are giving is absolutely or near accurate and can be trusted. Don't just make up data, if the business idea is kind new and you have no idea about it. Say it instead of providing mediocre answer.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "feedback": "string (make it simple and realistic for the idea. Tell it in detail, but not too long. make sure its user friendly for any user. Assume the user is ignorant. Also add tips like for example what places this are good business, if its terrible business, etc. you get the point)",
  "startupCosts": number (PHP estimate and make it realistic not just random numbers),
  "startupCostsBreakdown": { "category": number },
  "timeline": "string (e.g., 6-9 months)",
  "timelineBreakdown": [{ "phase": "string", "duration": "string", "tasks": ["string"] }],
  "challenges": [{ "challenge": "string", "severity": "high|medium|low", "solution": "string" }],
  "profitabilityTimeline": "string",
  "marketDemand": "high|medium|low",
  "riskLevel": "high|medium|low",
  "viabilityScore": number (1-10),
  "legalRequirements": ["string"] (make sure its real, accurate, and what is actually needed.)
}`,
        },
      ],
    });

    const response = message.choices[0]?.message.content || "";
    const cleanedResponse = response.replace(/```json|```/g, "").trim();
    const plan: BusinessPlan = JSON.parse(cleanedResponse);
    return plan;
  } catch (error) {
    throw error;
  }
};

export const chatbot = async (
  businessIdea: string,
  context: string,
  conversationHistory: Array<{ role: string; content: string }>,
): Promise<string> => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_CHATBOT_API_KEY,
    });
    const messages: any[] = [
      {
        role: "system",
        content: `You are a practical business advisor helping a first-time business owner understand their report.

Original business analysis context:
${context}

How to answer:
- Use plain, everyday language. Explain any business term you must use.
- Be brief: aim for 80-120 words. Use 2-4 short paragraphs or up to 5 bullet points.
- Answer only what was asked. Do not repeat the whole report or add a long multi-phase plan.
- If the question needs a cost breakdown, give the 3 most important items as a short list, not an exhaustive table.
- Do not use tables or headings. Use short bullet lists, and bold only key numbers or labels.
- When the user gives an amount without a currency, say "I assume you mean ₱10,000" once, then continue in Philippine pesos.
- End with one practical next step, not a long list.
- If the request is vague, ask one short clarifying question instead of guessing.
- If you don't know, say so.`,
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      {
        role: "user",
        content: businessIdea,
      },
    ];

    const message = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      max_tokens: 800,
      messages,
    });

    const response = message.choices[0]?.message.content || "No response";
    return response;
  } catch (error) {
    throw error;
  }
};
