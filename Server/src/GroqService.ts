import Groq from "groq-sdk";

interface BusinessPlan {
  feedback: string;
  startupCosts: number;
  startupCostsBreakdown: {
    [category: string]: number;
  };
  timeline: string;
  timelineBreakdown: {
    phase: string;
    duration: string;
    tasks: string[];
  }[];
  challenges: {
    challenge: string;
    severity: "high" | "medium" | "low";
    solution: string;
  }[];
  profitabilityTimeline: string;
  marketDemand: "high" | "medium" | "low";
  riskLevel: "high" | "medium" | "low";
  legalRequirements: string[];
  viabilityScore: number;
}

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
        content: `You are an expert business analyst chatbot. Answer questions about the user's business analysis.

Original business analysis context:
${context}

Rules:
- Answer based on the provided business analysis
- Be concise and helpful
- Remember previous conversation context
- Use Peso as primary money type but if user specifically say dollar like "$10000", then use dollar but if not, use peso but if user say a money range without specifying what money type it is just plain number like (my budget is 10000...), then say "i assume you mean 10000 pesos..") then continue.
- If you don't know, say so`,
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
      max_tokens: 1000,
      messages,
    });

    const response = message.choices[0]?.message.content || "No response";
    return response;
  } catch (error) {
    throw error;
  }
};
