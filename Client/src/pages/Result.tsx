import Footer from "../components/Footer";
import { useDarkmode } from "../context/Darkmode";
import { handleExportPDF } from "../components/HandleExportPDF";
import Chatbot from "../components/Chatbot";
import { useState } from "react";
import { MessageSquareMore } from "lucide-react";

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
  const { darkmode, setDarkmode } = useDarkmode();
  const [chatOpen, setChatOpen] = useState(false);

  const bgColor = darkmode ? "bg-[#1e1e1e]" : "bg-white";
  const textColor = darkmode ? "text-white" : "text-black";
  const subtleText = darkmode ? "text-gray-300" : "text-gray-600";
  const divider = darkmode ? "border-gray-500" : "border-gray-200";

  return (
    <div className={`flex-1 overflow-auto ${bgColor} relative`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-20">
        <button
          onClick={() => {
            onBack();
            localStorage.removeItem("savedAnalysis");
            localStorage.removeItem("savedConversation");
          }}
          className={`mb-4 sm:mb-16 text-xs sm:text-sm uppercase tracking-widest font-bold ${
            darkmode
              ? "text-blue-500 hover:text-blue-400"
              : "text-blue-500 hover:text-blue-700"
          }`}
        >
          ← clear & return?
        </button>
        <div id="pdf-content">
          <div className="mb-12 sm:mb-20">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 ${textColor}`}
            >
              Your Business Idea
            </h1>
            <p
              className={`text-sm sm:text-base md:text-lg ${subtleText} mb-8 sm:mb-12`}
            >
              Comprehensive viability analysis
            </p>
            <p
              className={`text-base sm:text-lg md:text-xl text-justify leading-relaxed max-w-3xl ${subtleText}`}
            >
              {data.feedback}
            </p>
          </div>

          <div
            className={`border-t ${divider} pt-8 sm:pt-12 pb-8 sm:pb-12 mb-12 sm:mb-20`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
              <div>
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText} mb-2 sm:mb-3`}
                >
                  Viability Score
                </p>
                <p
                  className={`text-2xl sm:text-3xl md:text-4xl font-black ${textColor}`}
                >
                  {data.viabilityScore}/10
                </p>
              </div>
              <div>
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText} mb-2 sm:mb-3`}
                >
                  Investment
                </p>
                <p
                  className={`text-lg sm:text-xl md:text-2xl font-black ${textColor}`}
                >
                  ₱{(data.startupCosts || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText} mb-2 sm:mb-3`}
                >
                  Timeline
                </p>
                <p
                  className={`text-lg sm:text-xl md:text-2xl font-black ${textColor}`}
                >
                  {data.timeline}
                </p>
              </div>
              <div>
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText} mb-2 sm:mb-3`}
                >
                  Break Even
                </p>
                <p
                  className={`text-lg sm:text-xl md:text-2xl font-black ${textColor}`}
                >
                  {data.profitabilityTimeline}
                </p>
              </div>
            </div>
          </div>

          <div className={`border-t ${divider} pt-12 sm:pt-20 mb-12 sm:mb-20`}>
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-12 ${textColor}`}
            >
              Investment Breakdown
            </h2>
            <div
              className={`text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent`}
            >
              ₱{(data.startupCosts || 0).toLocaleString()}
            </div>
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(data.startupCostsBreakdown || {}).map(
                ([key, value]: [string, any]) => {
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span
                          className={`text-xs sm:text-sm uppercase tracking-wide font-bold ${textColor}`}
                        >
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())
                            .trim()}
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-bold ${textColor}`}
                        >
                          ₱{(value || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          <div className={`border-t ${divider} pt-12 sm:pt-20 mb-12 sm:mb-20`}>
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-12 ${textColor}`}
            >
              Timeline
            </h2>
            <div
              className={`text-3xl sm:text-4xl md:text-5xl font-black mb-12 sm:mb-16 ${darkmode ? "text-gray-300" : "text-gray-800"}`}
            >
              {data.timeline}
            </div>
            <div className="space-y-6 sm:space-y-8">
              {(data.timelineBreakdown || []).map((phase: any, idx: number) => (
                <div key={idx}>
                  <div className="flex gap-4 sm:gap-6 mb-3 sm:mb-4">
                    <div
                      className={`text-2xl sm:text-3xl md:text-4xl font-black ${subtleText}`}
                    >
                      0{idx + 1}
                    </div>
                    <div>
                      <h3
                        className={`text-lg sm:text-xl md:text-2xl font-black ${textColor}`}
                      >
                        {phase.phase}
                      </h3>
                      <p className={`text-xs sm:text-sm ${subtleText}`}>
                        {phase.duration}
                      </p>
                    </div>
                  </div>
                  <ul className="ml-12 sm:ml-24 space-y-1 sm:space-y-2">
                    {(phase.tasks || []).map((task: string, i: number) => (
                      <li
                        key={i}
                        className={`text-xs sm:text-sm ${subtleText}`}
                      >
                        ▪ {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className={`border-t ${divider} pt-12 sm:pt-20 mb-12 sm:mb-20`}>
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-12 ${textColor}`}
            >
              Market & Risk
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText} mb-2 sm:mb-3`}
                >
                  Market Demand
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-black capitalize ${textColor}`}
                >
                  {data.marketDemand}
                </p>
              </div>
              <div>
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText} mb-2 sm:mb-3`}
                >
                  Risk Level
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-black capitalize ${
                    data.riskLevel === "high"
                      ? "text-red-500"
                      : data.riskLevel === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {data.riskLevel}
                </p>
              </div>
              <div>
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText} mb-2 sm:mb-3`}
                >
                  Break Even
                </p>
                <p className={`text-2xl sm:text-3xl font-black ${textColor}`}>
                  {data.profitabilityTimeline}
                </p>
              </div>
            </div>
          </div>

          <div className={`border-t ${divider} pt-12 sm:pt-20 mb-12 sm:mb-20`}>
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-12 ${textColor}`}
            >
              Challenges
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {(data.challenges || []).map((challenge: any, idx: number) => (
                <div key={idx}>
                  <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <div
                      className={`w-2 h-2 mt-1 rounded-full flex-shrink-0 ${
                        challenge.severity === "high"
                          ? "bg-red-500"
                          : challenge.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <h3
                      className={`text-base sm:text-lg md:text-xl font-bold ${textColor}`}
                    >
                      {challenge.challenge}
                    </h3>
                  </div>
                  <p
                    className={`ml-5 sm:ml-6 text-sm sm:text-base ${subtleText}`}
                  >
                    {challenge.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={`border-t ${divider} pt-12 sm:pt-20 mb-12 sm:mb-20`}>
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-12 ${textColor}`}
            >
              Legal Checklist
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {(data.legalRequirements || []).map(
                (req: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-500 text-xs">✓</span>
                    </div>
                    <span className={`text-xs sm:text-sm ${textColor}`}>
                      {req}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setDarkmode(false);
            handleExportPDF();
          }}
          className={`w-full border-2 border-blue-500 text-blue-500 font-bold py-3 sm:py-4 rounded-lg hover:bg-blue-500 hover:text-white transition-all mb-12 sm:mb-20 text-sm sm:text-base`}
        >
          EXPORT PDF
        </button>
      </div>
      <Footer />

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-6 right-6 sm:right-8 px-3 bg-[#19ca5d] hover:bg-[#19ca5d93] shadow-lg flex items-center justify-center text-2xl sm:text-3xl transition-all"
        >
          <span className="text-[15px] flex items-center gap-2 font-bold">
            <MessageSquareMore size={20} />
            Ask further
          </span>
        </button>
      )}

      {chatOpen && (
        <div className="fixed bottom-5 right-6 sm:right-8 w-60 sm:w-96 h-96 sm:h-[500px] shadow-2xl rounded-md overflow-hidden z-50">
          <Chatbot onClose={() => setChatOpen(false)} businessData={data} />
        </div>
      )}
    </div>
  );
}

export default Results;
