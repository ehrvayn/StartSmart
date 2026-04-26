import { useState } from "react";
import { Search, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Results from "./Result";
import Footer from "../components/Footer";
import { useDarkmode } from "../context/Darkmode";

function Landing() {
  const [businessIdea, setBusinessIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const { darkmode } = useDarkmode();

  const [results, setResults] = useState<any>(() => {
    const saved = localStorage.getItem("savedAnalysis");
    return saved ? JSON.parse(saved) : null;
  });

  const handleAnalyze = async () => {
    if (!businessIdea.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze-business",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessIdea: businessIdea.trim(),
          }),
        },
      );

      const data = await response.json();
      setResults(data.data);
      localStorage.setItem("savedAnalysis", JSON.stringify(data.data));
      setBusinessIdea("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (results) {
    return <Results data={results} onBack={() => setResults(null)} />;
  }

  return (
    <div
      className={`${darkmode ? "bg-[#1e1e1e]" : "bg-[#fafafa]"} min-h-screen w-screen overflow-x-hidden flex flex-col font-sans antialiased`}
    >
      <main className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6 py-8 sm:py-12 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1ce0af]/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />
        </div>

        <div className="w-full max-w-xl relative z-10">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm mb-4 sm:mb-6">
              <Sparkles className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 text-[#1ce0af] flex-shrink-0" />
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-400">
                StartSmart
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3 sm:mb-4 md:mb-4 leading-[1.1]">
              <span
                className={`${darkmode ? "font-black text-white" : "font-black"}`}
              >
                Validate your{" "}
              </span>
              <span className="text-[#1ce0af]">business idea.</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 leading-relaxed max-w-sm mx-auto px-2 sm:px-0">
              Skip the months of research and get an instant audit of your
              concept that calculates the risk and proves if your ideal business
              will be effective in the real world.
            </p>
          </div>

          <div
            className={`${darkmode ? "bg-[#252525]" : "bg-gray-200"} p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] group transition-all focus-within:ring-2 focus-within:ring-[#1ce0af]/20`}
          >
            <div className="relative flex items-center">
              <div className="absolute left-3 sm:left-4 text-gray-300 group-focus-within:text-[#1ce0af] transition-colors flex-shrink-0">
                <Search className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <input
                type="text"
                placeholder="e.g, Local barber shop, School coffee shop"
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                className={`${darkmode ? "bg-[#181818] text-gray-200" : "bg-white text-gray-900"} w-full pl-9 sm:pl-12 pr-24 sm:pr-36 py-2.5 sm:py-4 bg-transparent rounded-lg sm:rounded-xl focus:outline-none text-sm sm:text-lg placeholder:text-gray-300`}
              />
              <div className="absolute right-1">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !businessIdea.trim()}
                  className={`${darkmode ? "bg-gray-100 hover:bg-[#4e4e4e] disabled:bg-[#2e2e2e] text-black" : "bg-gray-900 hover:bg-black disabled:bg-gray-100 text-white"} disabled:text-gray-400 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold flex items-center gap-1 sm:gap-2 transition-all active:scale-95 text-xs sm:text-sm`}
                >
                  {loading ? (
                    <Loader2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 animate-spin" />
                  ) : (
                    <>
                      <span className="hidden sm:inline">Analyze</span>
                      <span className="sm:hidden">Go</span>
                      <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 md:mt-10 flex justify-center items-center gap-4 sm:gap-8 px-2">
            <div className="text-center">
              <p className="text-[8px] sm:text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-0.5 sm:mb-1">
                Insights
              </p>
              <p className="text-xs sm:text-sm font-semibold text-gray-600">
                AI-Powered Reports
              </p>
            </div>
            <div className="w-px h-4 sm:h-6 bg-gray-200" />
            <div className="text-center">
              <p className="text-[8px] sm:text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-0.5 sm:mb-1">
                Powered by
              </p>
              <p className="text-xs sm:text-sm font-semibold text-gray-600">
                Groq AI
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
