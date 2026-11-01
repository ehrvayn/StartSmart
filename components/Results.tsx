"use client";

import type { MouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Download,
  LoaderCircle,
  MessageSquare,
} from "lucide-react";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import { handleExportPDF } from "./HandleExportPDF";
import type { BusinessPlan, Level } from "../lib/types";

interface ResultsProps {
  data: BusinessPlan;
  onBack: () => void;
}

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const levelStyles: Record<Level, string> = {
  high: "border-ink bg-ink text-paper",
  medium: "border-line-strong bg-surface text-ink",
  low: "border-green/30 bg-green-soft text-green-strong",
};

const sections = [
  { id: "summary", label: "Summary" },
  { id: "investment", label: "Investment" },
  { id: "timeline", label: "Timeline" },
  { id: "risks", label: "Risks" },
  { id: "legal", label: "Legal" },
];

function formatPeso(value: number | undefined) {
  const amount = Number(value);
  return pesoFormatter.format(Number.isFinite(amount) ? amount : 0);
}

function formatLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .trim();
}

function getHeadline(feedback: string | undefined) {
  if (!feedback) return "Business viability report";

  const firstLine = feedback.split("\n")[0].split(".")[0].trim();
  return firstLine || "Business viability report";
}

function getBreakeven(value: string | undefined) {
  const text = (value ?? "").trim();
  if (!text) return { value: "—", detail: null };

  const range = text.match(
    /\b\d+(?:\.\d+)?\s*(?:-|–|to)\s*\d+(?:\.\d+)?\s*(?:months?|years?|weeks?)\b/i,
  );
  const single = text.match(/\b\d+(?:\.\d+)?\s*(?:months?|years?|weeks?)\b/i);
  const short = range?.[0] ?? single?.[0];

  if (!short) return { value: text, detail: null };

  return {
    value: short,
    detail: text.length > short.length + 10 ? text : null,
  };
}

function LevelBadge({ level }: { level?: Level }) {
  const value: Level =
    level === "high" || level === "medium" || level === "low"
      ? level
      : "medium";

  return (
    <span
      className={`inline-flex items-center border px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] ${levelStyles[value]}`}
    >
      {value}
    </span>
  );
}

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-line pb-4">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs text-green">{number}</span>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>
      {description && (
        <p className="mt-2 pl-8 text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: ReactNode;
}) {
  const isLongValue = value.length > 28;

  return (
    <div className="border-b border-r border-line p-5 sm:p-6">
      <dt className="label-mono">{label}</dt>
      <dd
        className={`mt-2 break-words tracking-tight ${
          isLongValue
            ? "text-base font-semibold leading-snug sm:text-lg"
            : "text-base font-bold tabular-nums sm:text-2xl"
        }`}
      >
        {value}
      </dd>
      {children}
    </div>
  );
}

function Results({ data, onBack }: ResultsProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("summary");
  const [exporting, setExporting] = useState(false);
  const [newAnalysisDialogOpen, setNewAnalysisDialogOpen] = useState(false);
  const lastChatTrigger = useRef<HTMLElement | null>(null);
  const newAnalysisDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const updateActiveSection = () => {
      const offset = 140;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setActiveSection(sections[sections.length - 1].id);
        return;
      }

      let current = sections[0].id;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= offset) {
          current = section.id;
        }
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  useEffect(() => {
    const dialog = newAnalysisDialogRef.current;
    if (!dialog) return;

    if (newAnalysisDialogOpen && !dialog.open) {
      dialog.showModal();
    } else if (!newAnalysisDialogOpen && dialog.open) {
      dialog.close();
    }
  }, [newAnalysisDialogOpen]);

  useEffect(() => {
    if (!newAnalysisDialogOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [newAnalysisDialogOpen]);

  const breakdown = Object.entries(data.startupCostsBreakdown ?? {});
  const breakdownTotal = breakdown.reduce(
    (sum, [, value]) => sum + (Number(value) || 0),
    0,
  );
  const totalCosts = Number(data.startupCosts) || breakdownTotal;
  const score = Math.min(10, Math.max(0, Number(data.viabilityScore) || 0));
  const breakeven = getBreakeven(data.profitabilityTimeline);
  const headline = getHeadline(data.feedback);
  const longHeadline = headline.length > 140;
  const feedbackParagraphs = (data.feedback ?? "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const phases = data.timelineBreakdown ?? [];
  const challenges = data.challenges ?? [];
  const legalRequirements = data.legalRequirements ?? [];

  const handleBack = () => {
    try {
      localStorage.removeItem("savedAnalysis");
      localStorage.removeItem("chatConversation");
      localStorage.removeItem("savedConversation");
    } catch {
      // Storage can be unavailable in restricted browser modes.
    }
    onBack();
  };

  const handleConfirmNewAnalysis = () => {
    setNewAnalysisDialogOpen(false);
    handleBack();
  };

  const handleExport = async () => {
    if (exporting) return;

    setExporting(true);
    try {
      await handleExportPDF();
    } catch (exportError) {
      console.error(exportError);
    } finally {
      setExporting(false);
    }
  };

  const openChat = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    lastChatTrigger.current = event.currentTarget;
    setChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setChatOpen(false);
    const trigger = lastChatTrigger.current;
    window.requestAnimationFrame(() => trigger?.focus());
  }, []);

  return (
    <>
      <main id="main" className="flex-1">
        <div className="border-b border-line">
          <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4">
            <button
              type="button"
              onClick={() => setNewAnalysisDialogOpen(true)}
              aria-haspopup="dialog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} />
              New analysis
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openChat}
                className="btn-secondary px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm"
              >
                <MessageSquare size={15} />
                <span className="hidden sm:inline">Ask about this report</span>
                <span className="sm:hidden">Ask</span>
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                aria-busy={exporting}
                className="btn-secondary px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm"
              >
                {exporting ? (
                  <>
                    <LoaderCircle
                      size={15}
                      className="animate-spin motion-reduce:animate-none"
                    />
                    Preparing
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    Export PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div id="pdf-content">
          <section className="border-b border-line">
            <div className="container-page py-8 sm:py-12">
              <p className="label-mono text-green">Viability report</p>
              <h1
                className={`mt-3 max-w-3xl font-bold leading-tight tracking-tight ${
                  longHeadline ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
                }`}
              >
                {headline}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                A structured assessment of startup costs, launch timeline,
                market demand, risk, and legal requirements.
              </p>

              <dl
                data-pdf-metrics
                className="mt-10 grid grid-cols-2 border-l border-t border-line lg:grid-cols-4"
              >
                <Metric label="Viability" value={`${score}/10`}>
                  <div
                    className="mt-3 h-1 w-full bg-line"
                    role="img"
                    aria-label={`Viability score ${score} out of 10`}
                  >
                    <div
                      className="h-1 bg-green"
                      style={{ width: `${score * 10}%` }}
                    />
                  </div>
                </Metric>
                <Metric label="Startup cost" value={formatPeso(totalCosts)} />
                <Metric label="Timeline" value={data.timeline || "—"} />
                <Metric label="Breakeven" value={breakeven.value} />
              </dl>

              {breakeven.detail && (
                <p className="mt-4 max-w-4xl text-xs leading-relaxed text-muted">
                  <span className="font-semibold text-ink">
                    Breakeven detail:
                  </span>{" "}
                  {breakeven.detail}
                </p>
              )}
            </div>
          </section>

          <div className="container-page py-10 sm:py-14">
            <div
              data-pdf-grid
              className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16"
            >
              <aside className="hidden lg:block" data-pdf-ignore>
                <nav aria-label="Report sections" className="sticky top-24">
                  <p className="label-mono">Contents</p>
                  <ul className="mt-4 border-l border-line">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          aria-current={
                            activeSection === section.id
                              ? "location"
                              : undefined
                          }
                          className={`-ml-px block border-l-2 py-2 pl-4 text-sm transition-colors ${
                            activeSection === section.id
                              ? "border-green text-ink"
                              : "border-transparent text-muted hover:border-green hover:text-ink"
                          }`}
                        >
                          {section.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              <div className="min-w-0">
                <nav
                  aria-label="Report sections"
                  data-pdf-ignore
                  className="sticky top-16 z-30 -mx-5 mb-10 overflow-x-auto border-y border-line bg-paper px-5 py-3 sm:-mx-8 sm:px-8 lg:hidden"
                >
                  <ul className="flex gap-3 whitespace-nowrap text-[13px] sm:gap-6 sm:text-sm">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          aria-current={
                            activeSection === section.id
                              ? "location"
                              : undefined
                          }
                          className={`transition-colors ${
                            activeSection === section.id
                              ? "font-semibold text-ink"
                              : "text-muted hover:text-ink"
                          }`}
                        >
                          {section.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="space-y-14 sm:space-y-16">
                  <section
                    id="summary"
                    className="scroll-mt-28 lg:scroll-mt-24"
                  >
                    <SectionHeading number="01" title="Summary" />

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        {feedbackParagraphs.length > 0 ? (
                          <div className=" space-y-4">
                            {feedbackParagraphs.map((paragraph, index) => (
                              <p
                                key={index}
                                className="text-base leading-relaxed text-ink/80"
                              >
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted">
                            No summary was returned for this analysis.
                          </p>
                        )}
                      </div>

                      <div className="border border-line p-5">
                        <p className="label-mono">Market demand</p>
                        <div className="mt-3">
                          <LevelBadge level={data.marketDemand} />
                        </div>
                      </div>

                      <div className="border border-line p-5">
                        <p className="label-mono">Risk level</p>
                        <div className="mt-3">
                          <LevelBadge level={data.riskLevel} />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section
                    id="investment"
                    className="scroll-mt-28 lg:scroll-mt-24"
                  >
                    <SectionHeading number="02" title="Investment" />

                    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="label-mono">Estimated startup capital</p>
                        <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">
                          {formatPeso(totalCosts)}
                        </p>
                      </div>
                      <p className="max-w-xs text-xs leading-relaxed text-muted">
                        Based on typical costs for this type of business.
                        Validate quotes with local suppliers before committing.
                      </p>
                    </div>

                    {breakdown.length > 0 ? (
                      <div className="mt-8 border border-line">
                        <div className="hidden grid-cols-[1fr_auto] gap-4 border-b border-line bg-surface px-5 py-3 sm:grid">
                          <span className="label-mono">Category</span>
                          <span className="label-mono text-right">Amount</span>
                        </div>

                        {breakdown.map(([key, value]) => {
                          const amount = Number(value) || 0;
                          const percentage =
                            totalCosts > 0
                              ? Math.round((amount / totalCosts) * 100)
                              : 0;

                          return (
                            <div
                              key={key}
                              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line px-5 py-4 last:border-b-0"
                            >
                              <div className="min-w-0">
                                <div className="flex items-baseline justify-between gap-3">
                                  <p className="min-w-0 break-words text-sm font-medium">
                                    {formatLabel(key)}
                                  </p>
                                  <span className="font-mono text-[11px] text-muted sm:hidden">
                                    {percentage}%
                                  </span>
                                </div>
                                <div className="mt-2 h-1 w-full bg-line">
                                  <div
                                    className="h-1 bg-green"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-mono text-sm tabular-nums">
                                  {formatPeso(amount)}
                                </p>
                                <p className="mt-1 hidden font-mono text-[11px] text-muted sm:block">
                                  {percentage}%
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-8 border border-line p-5 text-sm text-muted">
                        No cost breakdown was returned for this analysis.
                      </p>
                    )}
                  </section>

                  <section
                    id="timeline"
                    className="scroll-mt-28 lg:scroll-mt-24"
                  >
                    <SectionHeading
                      number="03"
                      title="Timeline"
                      description={
                        data.timeline
                          ? `Estimated launch window: ${data.timeline}.`
                          : undefined
                      }
                    />

                    {phases.length > 0 ? (
                      <ol className="ml-3 mt-8 border-l border-line">
                        {phases.map((phase, index) => (
                          <li
                            key={`${phase.phase}-${index}`}
                            className="relative pb-8 pl-8 last:pb-0"
                          >
                            <span className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center border border-line bg-paper font-mono text-[10px] text-green">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h3 className="text-base font-semibold">
                                {phase.phase}
                              </h3>
                              <span className="font-mono text-xs text-muted">
                                {phase.duration}
                              </span>
                            </div>

                            {(phase.tasks ?? []).length > 0 && (
                              <ul className="mt-3 space-y-2">
                                {(phase.tasks ?? []).map((task, taskIndex) => (
                                  <li
                                    key={taskIndex}
                                    className="flex gap-3 text-sm leading-relaxed text-muted"
                                  >
                                    <span
                                      className="mt-2 h-1 w-1 shrink-0 bg-green"
                                      aria-hidden="true"
                                    />
                                    {task}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="mt-8 border border-line p-5 text-sm text-muted">
                        No timeline breakdown was returned for this analysis.
                      </p>
                    )}
                  </section>

                  <section id="risks" className="scroll-mt-28 lg:scroll-mt-24">
                    <SectionHeading
                      number="04"
                      title="Risks"
                      description="The challenges most likely to affect launch, with a practical response for each."
                    />

                    {challenges.length > 0 ? (
                      <div className="mt-8 divide-y divide-line border border-line">
                        {challenges.map((challenge, index) => (
                          <div
                            key={`${challenge.challenge}-${index}`}
                            className="p-5 sm:p-6"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <h3 className="text-base font-semibold">
                                {challenge.challenge}
                              </h3>
                              <LevelBadge level={challenge.severity} />
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-muted">
                              <span className="font-semibold text-ink">
                                Response:
                              </span>{" "}
                              {challenge.solution}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-8 border border-line p-5 text-sm text-muted">
                        No risks were returned for this analysis.
                      </p>
                    )}
                  </section>

                  <section id="legal" className="scroll-mt-28 lg:scroll-mt-24">
                    <SectionHeading
                      number="05"
                      title="Legal"
                      description="Permits, registrations, and requirements to prepare before opening."
                    />

                    {legalRequirements.length > 0 ? (
                      <ul className="mt-8 grid border-l border-t border-line sm:grid-cols-2">
                        {legalRequirements.map((requirement, index) => {
                          const isLastOdd =
                            legalRequirements.length % 2 === 1 &&
                            index === legalRequirements.length - 1;

                          return (
                            <li
                              key={index}
                              className={`flex items-start gap-3 border-b border-r border-line bg-paper p-5 ${
                                isLastOdd ? "sm:col-span-2" : ""
                              }`}
                            >
                              <Check
                                size={16}
                                strokeWidth={2}
                                className="mt-0.5 shrink-0 text-green"
                              />
                              <span className="text-sm leading-relaxed">
                                {requirement}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-8 border border-line p-5 text-sm text-muted">
                        No legal requirements were returned for this analysis.
                      </p>
                    )}
                  </section>
                </div>

                <div
                  data-pdf-ignore
                  className="mt-14 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="label-mono text-green">Questions</p>
                    <h2 className="mt-2 text-xl font-bold tracking-tight">
                      Need a second opinion?
                    </h2>
                    <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">
                      Ask the report assistant about the costs, risks, or next
                      steps in this analysis.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openChat}
                    className="btn-secondary shrink-0"
                  >
                    <MessageSquare size={16} />
                    Ask about this report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <dialog
        ref={newAnalysisDialogRef}
        aria-modal="true"
        aria-labelledby="new-analysis-dialog-title"
        aria-describedby="new-analysis-dialog-description"
        onClose={() => setNewAnalysisDialogOpen(false)}
        onCancel={() => setNewAnalysisDialogOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;

          const rect = event.currentTarget.getBoundingClientRect();
          const outside =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;

          if (outside) setNewAnalysisDialogOpen(false);
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md border border-line bg-paper p-0 text-ink shadow-2xl"
      >
        <div className="p-6 sm:p-8">
          <p className="label-mono text-green">New analysis</p>
          <h2
            id="new-analysis-dialog-title"
            className="mt-3 text-2xl font-bold tracking-tight"
          >
            Start a new analysis?
          </h2>
          <p
            id="new-analysis-dialog-description"
            className="mt-3 text-sm leading-relaxed text-muted"
          >
            This will clear the current report and chat history from this
            device. This cannot be undone.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setNewAnalysisDialogOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmNewAnalysis}
              className="btn-primary"
            >
              Start new analysis
            </button>
          </div>
        </div>
      </dialog>

      {chatOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Report assistant"
          className="fixed inset-0 z-50 sm:inset-auto sm:bottom-8 sm:right-8 sm:h-[560px] sm:max-h-[calc(100vh_-_4rem)] sm:w-[400px] sm:border sm:border-line sm:shadow-2xl"
        >
          <Chatbot onClose={closeChat} businessData={data} />
        </div>
      )}
    </>
  );
}

export default Results;
