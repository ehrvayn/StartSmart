export type Level = "high" | "medium" | "low";

export interface BusinessPlan {
  feedback: string;
  startupCosts: number;
  startupCostsBreakdown: Record<string, number>;
  timeline: string;
  timelineBreakdown: {
    phase: string;
    duration: string;
    tasks: string[];
  }[];
  challenges: {
    challenge: string;
    severity: Level;
    solution: string;
  }[];
  profitabilityTimeline: string;
  marketDemand: Level;
  riskLevel: Level;
  legalRequirements: string[];
  viabilityScore: number;
}
