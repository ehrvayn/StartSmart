import Groq from "groq-sdk";

interface BusinessPlan {
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
  actionSteps: {
    step: number;
    title: string;
    description: string;
    timeframe: string;
  }[];
  profitabilityTimeline: string;
  marketDemand: "high" | "medium" | "low";
  competitionLevel: "high" | "medium" | "low";
  riskLevel: "high" | "medium" | "low";
  viabilityScre: number;
}

export const analyzeBusiness = async (
  businessIdea: string,
): Promise<BusinessPlan> => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_ANALYSIS_API_KEY,
    });

    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: `You are an expert business analyst. Provide honest, data-driven insights grounded in reality.

                  CRITICAL RULES:
                  - Base all analysis strictly on provided search data
                  - Use professional language and practical recommendations`,
        },
        {
          role: "user",
          content: `Analyze business viability: ${businessIdea}.
             
                  Absolutly make sure the data you are giving is absolutly or near accurate and can be trusted. Dont just make up data, if the business idea is
                  kinda new and you have no idea to it. Say it instead of providing mediocre answer.
                  Return ONLY valid JSON (no markdown, no code blocks):
                  {
                    "feedback": string (make it simple and realistic for the the idea. Tell it in detail, 
                    but not too long. make sure its user friendly for any user. Assume the user is ignorant. Also add tips like for example what places this are good business, if its terrible business, etc. you get the point)
                    "startupCosts": number (PHP estimate and make it realistic not just random numbers),
                    "startupCostsBreakdown": { "category": number },
                    "timeline": string (e.g., "6-9 months"),
                    "timelineBreakdown": [{ "phase": string, "duration": string, "tasks": [string] }],
                    "challenges": [{ "challenge": string, "severity": "high|medium|low", "solution": string }],
                    "profitabilityTimeline": string,
                    "marketDemand": "high|medium|low",
                    "riskLevel": "high|medium|low",
                    "viabilityScore": number (1-10)
                    "legalRequirements": string[] (make sure its real, accurate, and what is actually needed.)
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
        - Use Peso as primary money type but if user specifically say dollor like "$10000", then use dollar but if not, use peso but if user say a money range without specifiying what money type it is just plain number like (my budget is 10000...), 
        then say "i assume you mean 10000 pesos..) then continue.
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
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages,
    });

    const response = message.choices[0]?.message.content || "No response";
    return response;
  } catch (error) {
    throw error;
  }
};
