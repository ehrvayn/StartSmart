import Groq from "groq-sdk";

interface BusinessPlan {
  locationRating: number;
  locationAnalysis: string;
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
  competitors: {
    name: string;
    distance: string;
    strengths: string[];
    weaknesses: string[];
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
  profitabilityTimeline: string; // e.g., "18 months"
  marketDemand: "high" | "medium" | "low";
  competitionLevel: "high" | "medium" | "low";
  riskLevel: "high" | "medium" | "low";
}

export const analyzeBusiness = async (
  businessIdea: string,
  location: string,
): Promise<BusinessPlan> => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: `You are a seasoned business consultant with 20+ years of experience evaluating location-specific business opportunities. You provide data-driven, actionable insights that go beyond surface-level analysis.

          Your analysis must be:
          - Specific to the exact location and business type provided
          - Grounded in real market conditions, not generic advice
          - Honest about risks and challenges
          - Practical and implementable

          When analyzing, consider:
          1. Local demographic trends and purchasing power
          2. Actual competitor presence and their positioning
          3. Real regulatory and environmental factors for this specific location
          4. Realistic financial projections based on market conditions
          5. Concrete obstacles and proven solutions

          Use professional, clear language. Be direct about viability - if it's risky, say so.`,
                  },
                  {
                    role: "user",
                    content: `Conduct a professional business viability analysis for a ${businessIdea} in ${location}.

          Return ONLY valid JSON with this exact structure:
          {
            "locationRating": number (1-10, where 10 is ideal),
            "locationAnalysis": string (2-3 sentences on why this location is good/bad for this specific business),
            "startupCosts": number (total in local currency),
            "startupCostsBreakdown": { "category": number },
            "timeline": string (e.g., "6-9 months"),
            "timelineBreakdown": [{ "phase": string, "duration": string, "tasks": [string] }],
            "competitors": [{ "name": string, "distance": string, "strengths": [string], "weaknesses": [string] }],
            "challenges": [{ "challenge": string, "severity": "high|medium|low", "solution": string }],
            "actionSteps": [{ "step": number, "title": string, "description": string, "timeframe": string }],
            "profitabilityTimeline": string (e.g., "12-18 months"),
            "marketDemand": "high|medium|low",
            "competitionLevel": "high|medium|low",
            "riskLevel": "high|medium|low"
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
