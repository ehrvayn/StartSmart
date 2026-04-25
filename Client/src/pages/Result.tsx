import Footer from "../components/Footer";

interface ResultsProps {
  data: {
    feedback: string;
    startupCosts: number;
    startupCostsBreakdown: { [key: string]: number };
    timeline: string;
    timelineBreakdown: { phase: string; duration: string; tasks: string[] }[];
    challenges: { challenge: string; severity: string; solution: string }[];
    profitabilityTimeline: string;
    marketDemand: string;
    riskLevel: string;
    legalRequirements: string[];
    viabilityScore: number;
  };
  onBack: () => void;
}

function Results({ data, onBack }: ResultsProps) {
  return (
    <>
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="sm:w-[80%] w-full mx-auto px-2 md:px-6 py-8">
          <button
            onClick={() => {
              onBack();
              localStorage.removeItem("savedAnalysis");
            }}
            className="mb-8 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            Clear analysis
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white border border-gray-200 rounded-md p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Business Analysis
                </h1>
                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                  {data.feedback}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-md p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Startup Investment
                </h2>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
                  <div className="text-sm text-blue-700 mb-2">
                    Total Startup Cost
                  </div>
                  <div className="text-4xl font-bold text-blue-900">
                    ₱{(data.startupCosts || 0).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-3">
                  {Object.entries(data.startupCostsBreakdown || {}).map(
                    ([key, value]: [string, any]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-700 font-medium">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())
                            .trim()}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₱{value.toLocaleString()}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-md p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Implementation Timeline
                  </h2>
                  <div className="text-sm text-gray-600 mb-4 bg-gray-50 px-3 py-2 rounded">
                    {data.timeline}
                  </div>
                  <div className="space-y-4">
                    {(data.timelineBreakdown || []).map(
                      (phase: any, idx: number) => (
                        <div key={idx} className="flex">
                          <div className="flex flex-col items-center">
                            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span className="flex-1 rounded-full bg-gray-500 w-[2px]"></span>
                          </div>
                          <div className="ml-5">
                            <div className="mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {phase.phase}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {phase.duration}
                                </p>
                              </div>
                            </div>
                            <ul className="ml-5 space-y-1">
                              {(phase.tasks || []).map(
                                (task: string, i: number) => (
                                  <li key={i} className="text-xs text-gray-700">
                                    • {task}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-md p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Risk & Market
                  </h2>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">
                        Market Demand
                      </div>
                      <div className="capitalize font-semibold text-gray-900">
                        {data.marketDemand}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">
                        Risk Level
                      </div>
                      <div
                        className={`capitalize font-semibold text-sm ${
                          data.riskLevel === "high"
                            ? "text-red-600"
                            : data.riskLevel === "medium"
                              ? "text-amber-600"
                              : "text-green-600"
                        }`}
                      >
                        {data.riskLevel}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">
                        Profitability
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {data.profitabilityTimeline}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-md p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Key Challenges
                </h2>
                <div className="space-y-4">
                  {(data.challenges || []).map(
                    (challenge: any, idx: number) => (
                      <div
                        key={idx}
                        className="border-b-4 border-l-4 rounded-lg border-gray-200 pl-4 py-2"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {challenge.challenge}
                          </h3>
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              challenge.severity === "high"
                                ? "bg-red-100 text-red-700"
                                : challenge.severity === "medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {challenge.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          <strong>Solution:</strong> {challenge.solution}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-md p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Legal Requirements
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(data.legalRequirements || []).map(
                    (req: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-50 rounded-lg p-3"
                      >
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-gray-700 text-sm">{req}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm sticky top-8 space-y-6">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Viability Score
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      {data.viabilityScore}
                    </span>
                    <span className="text-xl text-gray-400">/10</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Investment
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        ₱{(data.startupCosts || 0).toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Break Even
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {data.profitabilityTimeline}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Setup Time
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {data.timeline}
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all shadow-sm">
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Results;
