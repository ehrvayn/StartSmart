import Footer from "../components/Footer";
import { useDarkmode } from "../context/Darkmode";
import { handleExportPDF } from "../components/HandleExportPDF";
import Chatbot from "../components/Chatbot";
import { useState } from "react";
import {
  MessageSquareMore,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

interface ResultsProps {
  data: any;
  onBack: () => void;
}

type Tab = "overview" | "investment" | "roadmap" | "risks" | "legal";

function Results({ data, onBack }: ResultsProps) {
  const { darkmode } = useDarkmode();
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const bgColor = darkmode ? "bg-[#1e1e1e]" : "bg-white";
  const textColor = darkmode ? "text-white" : "text-black";
  const subtleText = darkmode ? "text-gray-400" : "text-gray-600";
  const borderColor = darkmode ? "border-gray-700" : "border-gray-200";
  const accentBg = darkmode ? "bg-[#252525]" : "bg-gray-50";

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
    { id: "investment", label: "Investment", icon: <TrendingUp size={18} /> },
    { id: "roadmap", label: "Roadmap", icon: <Clock size={18} /> },
    { id: "risks", label: "Risks", icon: <AlertCircle size={18} /> },
    { id: "legal", label: "Legal", icon: <CheckCircle2 size={18} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className={`flex-1 ${bgColor}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
          {/* Header */}
          <button
            onClick={() => {
              onBack();
              localStorage.removeItem("savedAnalysis");
              localStorage.removeItem("chatConversation");
            }}
            className={`text-xs uppercase tracking-widest font-bold mb-8 ${
              darkmode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            ← New Analysis
          </button>

          <h1
            className={`text-xl sm:text-2xl font-black mb-8 leading-tight max-w-2xl ${textColor}`}
          >
            {data.feedback.split(".")[0].split("\n")[0]}
          </h1>

          {/* Key Metrics - Cleaner Grid */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 p-6 sm:p-8 rounded-2xl ${accentBg} border ${borderColor}`}
          >
            <div>
              <p
                className={`text-xs uppercase tracking-widest font-bold mb-3 ${subtleText}`}
              >
                Viability
              </p>
              <p className={`text-3xl font-black ${textColor}`}>
                {data.viabilityScore}/10
              </p>
            </div>
            <div>
              <p
                className={`text-xs uppercase tracking-widest font-bold mb-3 ${subtleText}`}
              >
                Investment
              </p>
              <p className={`text-2xl font-black text-blue-600`}>
                ₱{(data.startupCosts || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p
                className={`text-xs uppercase tracking-widest font-bold mb-3 ${subtleText}`}
              >
                Timeline
              </p>
              <p className={`text-2xl font-black ${textColor}`}>
                {data.timeline}
              </p>
            </div>
            <div>
              <p
                className={`text-xs uppercase tracking-widest font-bold mb-3 ${subtleText}`}
              >
                Breakeven
              </p>
              <p className={`text-sm font-black ${textColor}`}>
                {data.profitabilityTimeline}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div
            className={`border-b ${borderColor} mb-10 flex gap-1 overflow-x-auto`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-5 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? `border-blue-500 ${textColor}`
                    : `border-transparent ${subtleText} hover:${textColor}`
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div id="pdf-content" className="mb-16">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-10">
                <div>
                  <h2 className={`text-2xl font-black mb-4 ${textColor}`}>
                    Analysis
                  </h2>
                  <p className={`text-base leading-relaxed ${subtleText}`}>
                    {data.feedback}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div
                    className={`p-6 rounded-xl border ${borderColor} ${accentBg}`}
                  >
                    <p
                      className={`text-xs uppercase tracking-widest font-bold mb-3 ${subtleText}`}
                    >
                      Market Demand
                    </p>
                    <p
                      className={`text-xl font-black capitalize text-green-500`}
                    >
                      {data.marketDemand}
                    </p>
                  </div>
                  <div
                    className={`p-6 rounded-xl border ${borderColor} ${accentBg}`}
                  >
                    <p
                      className={`text-xs uppercase tracking-widest font-bold mb-3 ${subtleText}`}
                    >
                      Risk Level
                    </p>
                    <p
                      className={`text-xl font-black capitalize ${
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
                </div>
              </div>
            )}

            {/* Investment Tab */}
            {activeTab === "investment" && (
              <div className="space-y-8">
                <div>
                  <h2 className={`text-2xl font-black mb-2 ${textColor}`}>
                    Investment Breakdown
                  </h2>
                  <p className={`text-3xl font-black text-blue-600 mb-8`}>
                    ₱{(data.startupCosts || 0).toLocaleString()}
                  </p>
                  <div className="space-y-3">
                    {Object.entries(data.startupCostsBreakdown || {}).map(
                      ([key, value]: [string, any]) => (
                        <div
                          key={key}
                          className={`flex justify-between items-center p-4 rounded-lg border ${borderColor} ${accentBg}`}
                        >
                          <span className={`font-semibold ${textColor}`}>
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())
                              .trim()}
                          </span>
                          <span className={`font-bold text-blue-600`}>
                            ₱{(value || 0).toLocaleString()}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Roadmap Tab */}
            {activeTab === "roadmap" && (
              <div className="space-y-10">
                <h2 className={`text-2xl font-black ${textColor}`}>
                  Project Timeline
                </h2>
                <div className="space-y-8">
                  {(data.timelineBreakdown || []).map(
                    (phase: any, idx: number) => (
                      <div key={idx} className="flex gap-6">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white bg-blue-600 text-sm">
                            {idx + 1}
                          </div>
                          {idx < (data.timelineBreakdown || []).length - 1 && (
                            <div
                              className={`w-0.5 h-20 mt-2 ${darkmode ? "bg-gray-700" : "bg-gray-300"}`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <h3
                            className={`text-lg font-black mb-1 ${textColor}`}
                          >
                            {phase.phase}
                          </h3>
                          <p
                            className={`text-sm mb-4 font-semibold ${subtleText}`}
                          >
                            {phase.duration}
                          </p>
                          <ul className="space-y-2">
                            {(phase.tasks || []).map(
                              (task: string, i: number) => (
                                <li
                                  key={i}
                                  className={`flex gap-2 text-sm ${subtleText}`}
                                >
                                  <span className="text-blue-500">→</span>
                                  {task}
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
            )}

            {/* Risks Tab */}
            {activeTab === "risks" && (
              <div className="space-y-10">
                <h2 className={`text-2xl font-black ${textColor}`}>
                  Challenges & Solutions
                </h2>
                <div className="space-y-4">
                  {(data.challenges || []).map(
                    (challenge: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-6 rounded-xl border ${borderColor} ${accentBg}`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`w-2.5 h-2.5 mt-1.5 rounded-full flex-shrink-0 ${
                              challenge.severity === "high"
                                ? "bg-red-500"
                                : challenge.severity === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <h3 className={`text-base font-bold ${textColor}`}>
                            {challenge.challenge}
                          </h3>
                        </div>
                        <p className={`text-sm ml-5.5 ${subtleText}`}>
                          <span className="font-semibold">Solution:</span>{" "}
                          {challenge.solution}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Legal Tab */}
            {activeTab === "legal" && (
              <div className="space-y-10">
                <h2 className={`text-2xl font-black ${textColor}`}>
                  Legal Requirements
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(data.legalRequirements || []).map(
                    (req: string, idx: number) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-l-4 border-blue-500 ${accentBg}`}
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2
                            size={16}
                            className="text-blue-500 flex-shrink-0 mt-0.5"
                          />
                          <span className={`text-sm font-medium ${textColor}`}>
                            {req}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={() => handleExportPDF()}
            className="w-full border-2 border-blue-500 text-blue-500 font-bold py-3 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
          >
            EXPORT PDF
          </button>
        </div>
      </div>

      <Footer />

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-6 right-6 sm:right-8 px-4 py-2 bg-[#19ca5d] hover:bg-[#15a84d] shadow-lg rounded-lg flex items-center gap-2 font-bold text-sm transition-all"
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
