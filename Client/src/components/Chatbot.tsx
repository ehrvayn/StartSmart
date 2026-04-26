import { useState, useRef, useEffect } from "react";
import { useDarkmode } from "../context/Darkmode";
import Logo from "../assets/img/StartSmartLogo.png";

interface ChatbotProps {
  onClose: () => void;
  businessData: any;
}

function Chatbot({ onClose, businessData }: ChatbotProps) {
  const { darkmode } = useDarkmode();
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    () => {
      const savedConversation = localStorage.getItem("savedConversation");

      if (savedConversation) {
        return JSON.parse(savedConversation);
      } else {
        return [
          {
            role: "bot",
            text: `I've reviewed your business analysis for ${businessData.feedback.split(".")[0]}. Ask me anything about your startup!`,
          },
        ];
      }
    },
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const latestChat = useRef<HTMLDivElement>(null);

  useEffect(() => {
    latestChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const userMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessIdea: input,
          context: JSON.stringify(businessData),
          conversationHistory: messages.map((msg) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      });

      const data = await response.json();
      const botMessage = {
        role: "bot",
        text: data.data || "I couldn't process that. Try again!",
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      localStorage.setItem("savedConversation", JSON.stringify(finalMessages));
    } catch (error) {
      console.log(error);
      const errorMessage = {
        role: "bot",
        text: "Something went wrong. Try again!",
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      localStorage.setItem("savedConversation", JSON.stringify(finalMessages));
    }
    setLoading(false);
  };

  return (
    <div
      className={`flex flex-col h-full ${
        darkmode ? "bg-[#3e3e3e] text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`${
          darkmode
            ? "bg-[#3e3e3e] text-white border-b border-gray-500"
            : "bg-[#1ce0af] text-black border-b border-gray-200"
        } p-3 sm:p-4 rounded-t-2xl flex justify-between items-center`}
      >
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <img src={Logo} className="w-5 sm:w-6 flex-shrink-0" />
          <span className="font-semibold text-sm sm:text-base truncate">
            StartSmart
          </span>
        </div>
        <button
          onClick={onClose}
          className={`cursor-pointer text-lg sm:text-xl flex-shrink-0 ml-2 ${
            darkmode ? "text-white" : "text-black"
          }`}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 p-3 sm:p-4 overflow-y-auto flex flex-col gap-2 sm:gap-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start gap-2 max-w-[90%] sm:max-w-[85%] ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {msg.role !== "user" && (
                <img src={Logo} className="w-5 sm:w-6 flex-shrink-0 mt-1" />
              )}
              <div
                className={`whitespace-pre-wrap break-words text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg ${
                  msg.role === "user"
                    ? darkmode
                      ? "bg-[#09b44b] text-white"
                      : "bg-[#19ca5d] text-white"
                    : darkmode
                      ? "bg-[#2e2e2e] text-white"
                      : "bg-gray-100 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div
            className={`text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg max-w-[80%] self-start ${
              darkmode ? "bg-[#2e2e2e] text-white" : "bg-gray-100 text-black"
            }`}
          >
            Typing...
          </div>
        )}
        <div ref={latestChat}></div>
      </div>

      <div
        className={`${
          darkmode
            ? "bg-[#3e3e3e] text-white border-t border-gray-500"
            : "bg-white text-black border-t border-gray-200"
        } p-2 sm:p-3 flex gap-1.5 sm:gap-2`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className={`flex-1 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none border ${
            darkmode
              ? "bg-[#2e2e2e] border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        />
        <button
          onClick={sendMessage}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all flex-shrink-0 ${
            darkmode
              ? "bg-[#09b44b] hover:bg-[#09b44b5d] text-white"
              : "bg-[#09b44b] hover:bg-[#09b44b5d] text-white"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
