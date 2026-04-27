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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-16 space-y-16 sm:space-y-24">
        <button
          onClick={() => {
            onBack();
            localStorage.removeItem("savedAnalysis");
            localStorage.removeItem("savedConversation");
          }}
          className={`text-xs sm:text-sm uppercase tracking-widest font-bold ${
            darkmode
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          ← clear & return
        </button>

        <div id="pdf-content" className="space-y-16 sm:space-y-24">
          {/* Intro */}
          <section className="space-y-4 sm:space-y-6">
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl font-black leading-tight ${textColor}`}
            >
              Your Business Idea
            </h1>
            <p
              className={`text-sm sm:text-base text-justify leading-relaxed max-w-3xl ${subtleText}`}
            >
              {data.feedback}
            </p>
          </section>

          {/* Key Metrics Grid */}
          <section className={`border-t ${divider} pt-12 sm:pt-16`}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="space-y-2">
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText}`}
                >
                  Viability Score
                </p>
                <p className={`text-3xl sm:text-4xl font-black ${textColor}`}>
                  {data.viabilityScore}/10
                </p>
              </div>
              <div className="space-y-2">
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText}`}
                >
                  Initial Investment
                </p>
                <p className={`text-2xl sm:text-3xl font-black ${textColor}`}>
                  ₱{(data.startupCosts || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText}`}
                >
                  Timeline
                </p>
                <p className={`text-2xl sm:text-3xl font-black ${textColor}`}>
                  {data.timeline}
                </p>
              </div>
              <div className="space-y-2">
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText}`}
                >
                  Break Even
                </p>
                <p className={`text-2xl sm:text-3xl font-black ${textColor}`}>
                  {data.profitabilityTimeline}
                </p>
              </div>
            </div>
          </section>

          {/* Investment Breakdown */}
          <section className={`border-t ${divider} pt-12 sm:pt-16 space-y-8`}>
            <div className="space-y-3">
              <h2 className={`text-3xl sm:text-4xl font-black ${textColor}`}>
                Investment Breakdown
              </h2>
              <p className={`text-2xl sm:text-3xl font-black text-blue-600`}>
                ₱{(data.startupCosts || 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(data.startupCostsBreakdown || {}).map(
                ([key, value]: [string, any]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center pb-3 border-b border-gray-300"
                  >
                    <span
                      className={`text-sm uppercase tracking-wide font-semibold ${textColor}`}
                    >
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim()}
                    </span>
                    <span className={`text-sm font-bold ${textColor}`}>
                      ₱{(value || 0).toLocaleString()}
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Timeline */}
          <section className={`border-t ${divider} pt-12 sm:pt-16 space-y-10`}>
            <h2 className={`text-3xl sm:text-4xl font-black ${textColor}`}>
              Timeline
            </h2>
            <div className="space-y-8 sm:space-y-10">
              {(data.timelineBreakdown || []).map((phase: any, idx: number) => (
                <div key={idx} className="space-y-4">
                  <div className="flex gap-4 sm:gap-6 items-start">
                    <div
                      className={`text-3xl sm:text-4xl font-black flex-shrink-0 ${subtleText}`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="space-y-1">
                      <h3
                        className={`text-lg sm:text-xl font-black ${textColor}`}
                      >
                        {phase.phase}
                      </h3>
                      <p className={`text-sm ${subtleText}`}>
                        {phase.duration}
                      </p>
                    </div>
                  </div>
                  <ul className="ml-12 sm:ml-20 space-y-2">
                    {(phase.tasks || []).map((task: string, i: number) => (
                      <li key={i} className={`text-sm ${subtleText}`}>
                        ▪ {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Market & Risk */}
          <section className={`border-t ${divider} pt-12 sm:pt-16`}>
            <h2
              className={`text-3xl sm:text-4xl font-black mb-8 sm:mb-12 ${textColor}`}
            >
              Market & Risk
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
              <div className="space-y-3">
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText}`}
                >
                  Market Demand
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-black capitalize ${textColor}`}
                >
                  {data.marketDemand}
                </p>
              </div>
              <div className="space-y-3">
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText}`}
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
              <div className="space-y-3">
                <p
                  className={`text-xs uppercase tracking-widest font-bold ${subtleText}`}
                >
                  Break Even
                </p>
                <p className={`text-2xl sm:text-3xl font-black ${textColor}`}>
                  {data.profitabilityTimeline}
                </p>
              </div>
            </div>
          </section>

          {/* Challenges */}
          <section className={`border-t ${divider} pt-12 sm:pt-16`}>
            <h2
              className={`text-3xl sm:text-4xl font-black mb-8 sm:mb-12 ${textColor}`}
            >
              Challenges
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {(data.challenges || []).map((challenge: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2.5 h-2.5 mt-1.5 rounded-full flex-shrink-0 ${
                        challenge.severity === "high"
                          ? "bg-red-500"
                          : challenge.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <h3
                      className={`text-base sm:text-lg font-bold ${textColor}`}
                    >
                      {challenge.challenge}
                    </h3>
                  </div>
                  <p className={`ml-5 text-sm sm:text-base ${subtleText}`}>
                    {challenge.solution}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Legal Checklist */}
          <section className={`border-t ${divider} pt-12 sm:pt-16`}>
            <h2
              className={`text-3xl sm:text-4xl font-black mb-8 sm:mb-12 ${textColor}`}
            >
              Legal Requirements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(data.legalRequirements || []).map(
                (req: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-500 text-xs font-bold">✓</span>
                    </div>
                    <span className={`text-sm ${textColor}`}>{req}</span>
                  </div>
                ),
              )}
            </div>
          </section>
        </div>

        {/* Export Button */}
        <button
          onClick={() => {
            setDarkmode(false);
            handleExportPDF();
          }}
          className={`w-full border-2 border-blue-500 text-blue-500 font-bold py-3 sm:py-4 rounded-lg hover:bg-blue-500 hover:text-white transition-all text-sm sm:text-base`}
        >
          EXPORT PDF
        </button>
      </div>

      <Footer />

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-6 right-6 sm:right-8 px-4 py-2 bg-[#19ca5d] hover:bg-[#19ca5d93] shadow-lg rounded-lg flex items-center gap-2 font-bold text-sm sm:text-base transition-all"
        >
          <MessageSquareMore size={18} />
          Ask further
        </button>
      )}

      {chatOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-8 w-full sm:w-96 h-screen sm:h-[500px] shadow-2xl rounded-none sm:rounded-2xl overflow-hidden z-50">
          <Chatbot onClose={() => setChatOpen(false)} businessData={data} />
        </div>
      )}
    </div>
  );
}

export default Results;
