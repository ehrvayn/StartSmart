"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, LoaderCircle } from "lucide-react";
import Results from "../components/Results";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { BusinessPlan } from "../lib/types";

const reportItems = [
  {
    title: "Viability score",
    description:
      "A 1–10 read on whether the idea can work, with the reasoning behind the number.",
  },
  {
    title: "Startup costs",
    description:
      "A realistic peso estimate and a category-by-category breakdown of where the money goes.",
  },
  {
    title: "Launch timeline",
    description:
      "A phased roadmap from setup to opening, with the key tasks for each stage.",
  },
  {
    title: "Risks and legal",
    description:
      "The challenges most likely to slow you down, plus the permits and requirements to prepare.",
  },
];

const steps = [
  {
    title: "Describe the idea",
    description:
      "Add the product, location, and audience. A sentence is enough to begin.",
  },
  {
    title: "Review the report",
    description:
      "See costs, timeline, demand, risk, and legal requirements in one place.",
  },
  {
    title: "Decide what is next",
    description:
      "Export the report, pressure-test the numbers, and move forward with clarity.",
  },
];

function Landing() {
  const [businessIdea, setBusinessIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BusinessPlan | null>(null);

  // Start as null so the server and the first client render match, then
  // restore the saved analysis after hydration. Reading localStorage during
  // the initial render causes a hydration mismatch.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedAnalysis");
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        setResults(parsed);
      }
    } catch {
      try {
        localStorage.removeItem("savedAnalysis");
      } catch {
        // Storage can be unavailable in restricted browser modes.
      }
    }
  }, []);

  const handleAnalyze = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const idea = businessIdea.trim();
    if (!idea) {
      setError("Describe your business idea first.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/analyze-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessIdea: idea }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.data) {
        throw new Error(payload?.error ?? "The analysis could not be completed.");
      }

      setResults(payload.data);
      try {
        localStorage.setItem("savedAnalysis", JSON.stringify(payload.data));
      } catch {
        // The report still works for this session if storage is unavailable.
      }
      setBusinessIdea("");
      window.scrollTo({ top: 0 });
    } catch (requestError) {
      console.error(requestError);
      setError(
        "We couldn't complete the analysis. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setResults(null);
    window.scrollTo({ top: 0 });
  };

  if (results) {
    return <Results data={results} onBack={handleBack} />;
  }

  return (
    <>
      <main id="main" className="flex-1">
        <section id="top" className="scroll-mt-16 border-b border-line">
          <div className="container-page grid gap-8 py-10 sm:gap-12 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-24">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-green" aria-hidden="true" />
                <p className="label-mono text-green">
                  Business viability analysis
                </p>
              </div>

              <h1 className="mt-5 max-w-2xl text-[2rem] font-bold leading-[1.08] tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">
                Know if your idea is{" "}
                <span className="text-green">worth building.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Turn a business idea into a structured report: startup costs,
                launch timeline, market demand, risks, and legal requirements —
                before you spend a peso.
              </p>

              <dl className="mt-8 hidden max-w-lg grid-cols-3 gap-5 border-t border-line pt-6 sm:grid lg:mt-10">
                <div>
                  <dt className="label-mono">Output</dt>
                  <dd className="mt-2 text-sm font-semibold">
                    Viability report
                  </dd>
                </div>
                <div>
                  <dt className="label-mono">Sections</dt>
                  <dd className="mt-2 text-sm font-semibold">Five</dd>
                </div>
                <div>
                  <dt className="label-mono">Estimates</dt>
                  <dd className="mt-2 text-sm font-semibold">
                    Philippine pesos
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-5">
              <form
                onSubmit={handleAnalyze}
                className="border border-line bg-surface p-6 sm:p-8"
              >
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <p className="label-mono text-ink">New analysis</p>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    PHP
                  </span>
                </div>

                <label
                  htmlFor="business-idea"
                  className="mt-6 block text-sm font-semibold"
                >
                  Your business idea
                </label>
                <p
                  id="idea-hint"
                  className="mt-1.5 text-sm leading-relaxed text-muted"
                >
                  Include the product, location, and target customer for a
                  sharper report.
                </p>

                <textarea
                  id="business-idea"
                  name="business-idea"
                  rows={4}
                  value={businessIdea}
                  onChange={(event) => {
                    setBusinessIdea(event.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. A printing and school-supplies shop beside a public high school in Quezon City"
                  aria-describedby="idea-hint"
                  disabled={loading}
                  className="field mt-4 resize-none"
                />

                <button
                  type="submit"
                  disabled={loading || !businessIdea.trim()}
                  aria-busy={loading}
                  className="btn-primary mt-4 w-full"
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="animate-spin motion-reduce:animate-none"
                      />
                      Analyzing idea
                    </>
                  ) : (
                    <>
                      Analyze idea
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {error && (
                  <p
                    role="alert"
                    className="mt-3 bg-ink px-3 py-2 text-sm text-paper"
                  >
                    {error}
                  </p>
                )}

                <p className="mt-4 text-xs leading-relaxed text-muted">
                  Estimates are in Philippine pesos. No account required.
                </p>
              </form>
            </div>
          </div>
        </section>

        <section
          id="what-you-get"
          className="scroll-mt-20 border-b border-line bg-surface"
        >
          <div className="container-page py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="label-mono text-green">What you get</p>
                <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  A report you can act on.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Every analysis is organized around the decisions that decide
                  whether an idea gets off the ground.
                </p>
              </div>

              <div className="grid border-l border-t border-line sm:grid-cols-2 lg:col-span-8">
                {reportItems.map((item, index) => (
                  <div
                    key={item.title}
                    className="border-b border-r border-line p-6 sm:p-8"
                  >
                    <p className="font-mono text-[11px] tracking-[0.16em] text-green">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 text-base font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-20 border-b border-line"
        >
          <div className="container-page py-16 sm:py-20">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label-mono text-green">How it works</p>
                <h2 className="mt-4 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
                  From idea to decision in three steps.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                No sign-up, no dashboard. One clear report you can export and
                keep.
              </p>
            </div>

            <ol className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="bg-paper p-6 sm:p-8">
                  <p className="font-mono text-[11px] tracking-[0.16em] text-green">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-surface">
          <div className="container-page flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Start with one sentence.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Get a structured report on cost, timeline, risk, and legal
                requirements.
              </p>
            </div>
            <a href="#top" className="btn-primary shrink-0">
              Analyze an idea
              <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <Landing />
    </div>
  );
}
