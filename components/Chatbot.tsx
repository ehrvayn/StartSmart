"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, LoaderCircle, X } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BusinessPlan } from "../lib/types";

interface ChatbotProps {
  onClose: () => void;
  businessData: BusinessPlan;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const STORAGE_KEY = "chatConversation";

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-3 text-sm leading-relaxed last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1.5 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-5 last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  h1: ({ children }) => (
    <h3 className="mb-2 mt-4 text-sm font-semibold first:mt-0">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="mb-2 mt-4 text-sm font-semibold first:mt-0">{children}</h3>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 text-sm font-semibold first:mt-0">{children}</h3>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="font-medium text-green underline underline-offset-2 hover:text-green-strong"
    >
      {children}
    </a>
  ),
  code: ({ className, children }) =>
    className ? (
      <code className="font-mono text-xs">{children}</code>
    ) : (
      <code className="border border-line bg-paper px-1 py-0.5 font-mono text-[12px]">
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto border border-line bg-paper p-3 last:mb-0">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-green pl-3 text-muted last:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-line" />,
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto border border-line last:mb-0">
      <table className="w-full min-w-[420px] border-collapse text-xs">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-line bg-paper px-2 py-1.5 text-left align-bottom font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-line px-2 py-1.5 align-top">
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt ?? ""} className="max-w-full border border-line" />
  ),
};

function persistMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // The conversation still works for this session if storage is unavailable.
  }
}

function getGreeting(businessData: BusinessPlan) {
  const subject = businessData.feedback?.split(".")[0]?.trim();

  return subject
    ? `I've reviewed the report on ${subject}. Ask me anything about the costs, timeline, risks, or next steps.`
    : "I've reviewed your report. Ask me anything about the costs, timeline, risks, or next steps.";
}

function Chatbot({ onClose, businessData }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: getGreeting(businessData) },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Restore the conversation after mount so server and client render the same
  // initial greeting. Chatbot is mounted on demand, but this keeps the
  // component safe if it is ever rendered during SSR.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const restored: ChatMessage[] = parsed
        .map((message: any) => ({
          role:
            message?.role === "user"
              ? ("user" as const)
              : ("assistant" as const),
          text: typeof message?.text === "string" ? message.text : "",
        }))
        .filter((message) => message.text.length > 0);

      if (restored.length > 0) setMessages(restored);
    } catch {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage can be unavailable in restricted browser modes.
      }
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.offsetParent !== null);

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (window.matchMedia("(min-width: 640px)").matches) {
      inputRef.current?.focus();
    } else {
      panel
        .querySelector<HTMLButtonElement>('button[aria-label="Close assistant"]')
        ?.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = input.trim();
    if (!question || loading) return;

    const userMessage: ChatMessage = { role: "user", text: question };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessIdea: question,
          context: JSON.stringify(businessData),
          conversationHistory: messages.map((message) => ({
            role: message.role,
            content: message.text,
          })),
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error ?? "Request failed");
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        text: payload?.data || "I couldn't process that. Try asking again.",
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      persistMessages(finalMessages);
    } catch (requestError) {
      console.error(requestError);
      const errorMessage: ChatMessage = {
        role: "assistant",
        text: "Something went wrong. Check your connection and try again.",
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      persistMessages(finalMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={panelRef} className="flex h-full flex-col bg-paper">
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 bg-green" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold leading-none">
              Report assistant
            </p>
            <p className="mt-1 text-[11px] leading-none text-muted">
              Based on this analysis
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          className="inline-flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-ink"
        >
          <X size={18} />
        </button>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-5 overflow-y-auto px-4 py-5"
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={index}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <p className="label-mono mb-1.5">
                {isUser ? "You" : "StartSmart"}
              </p>
              <div
                className={`max-w-[90%] break-words px-3.5 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "whitespace-pre-wrap bg-ink text-paper"
                    : "border border-line bg-surface text-ink"
                }`}
              >
                {isUser ? (
                  message.text
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {message.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex flex-col items-start">
            <p className="label-mono mb-1.5">StartSmart</p>
            <div className="inline-flex items-center gap-2 border border-line bg-surface px-3.5 py-2.5 text-sm text-muted">
              <LoaderCircle
                size={14}
                className="animate-spin motion-reduce:animate-none"
              />
              Reviewing the report
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="border-t border-line p-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a follow-up question"
            aria-label="Ask a follow-up question"
            disabled={loading}
            className="field min-w-0 flex-1 px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-ink text-paper transition-colors hover:bg-green hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp size={18} />
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          Answers are based on this report. Verify critical numbers before
          acting.
        </p>
      </form>
    </div>
  );
}

export default Chatbot;
