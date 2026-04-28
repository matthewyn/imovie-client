import { useState, useRef, useEffect } from "react";
import IconImage from "/favicon.png";
import { Image } from "@heroui/react";
import io from "socket.io-client";
import Markdown from "react-markdown";
import { useAuth } from "../contexts/AuthContext";

const socket =
  process.env.NODE_ENV === "development"
    ? io.connect("http://localhost:3000")
    : io.connect(`${import.meta.env.VITE_BACKEND_API}`);

const AGENT_REPLIES = [
  "Hi there! Welcome to iMovie support 🎬 How can I help you today?",
  "Sure! Could you share a bit more detail so I can help you better?",
  "Great question! Let me look into that for you.",
  "Is there anything else I can assist you with?",
];

function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const replyIdx = useRef(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !chatStarted) {
      setChatStarted(true);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          { role: "agent", text: AGENT_REPLIES[0], id: crypto.randomUUID() },
        ]);
        replyIdx.current = 1;
      }, 900);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    socket.on("assistant_message", (data) => {
      console.log("Received from server:", data);
      setMessages((prev) =>
        prev[prev.length - 1].role === "user"
          ? [
              ...prev,
              { role: "agent", text: data.text, id: crypto.randomUUID() },
            ]
          : prev.map((msg, idx) =>
              idx === prev.length - 1
                ? { ...msg, text: msg.text + data.text }
                : msg,
            ),
      );
    });

    socket.on("agent_usage_limit", () => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: "Sorry, you've reached the usage limit for this session. Please try again tomorrow.",
          id: crypto.randomUUID(),
        },
      ]);
    });

    socket.on("assistant_message_error", (data) => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: data.message,
          id: crypto.randomUUID(),
        },
      ]);
    });

    socket.on("user_not_allowed", (data) => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: data.message,
          id: crypto.randomUUID(),
        },
      ]);
    });

    socket.on("assistant_message_complete", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("assistant_message");
      socket.off("assistant_message_complete");
      socket.off("agent_usage_limit");
    };
  }, [socket]);

  const sendMessage = () => {
    const val = inputValue.trim();
    if (!val) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: val, id: crypto.randomUUID() },
    ]);
    setInputValue("");
    setIsTyping(true);
    if (!user) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: "Please log in to use the chat feature.",
          id: crypto.randomUUID(),
        },
      ]);
      return;
    }
    socket.emit("client_message", {
      text: val,
      history: messages,
      user: user,
    });
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 w-fit pointer-events-none">
      {/* Chat Panel */}
      <div
        className={`
          flex flex-col w-[360px] rounded-2xl overflow-hidden
          bg-white dark:bg-zinc-900
          shadow-2xl shadow-violet-900/30
          transition-all duration-300 origin-bottom-right
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-90 translate-y-4 pointer-events-none"
          }
        `}
        style={{ maxHeight: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-violet-600">
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">
            Chat with us now
          </span>
        </div>

        {/* Welcome screen (before chat starts) */}
        {!chatStarted && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8 px-4 bg-white dark:bg-zinc-900">
            {/* Illustration */}
            <svg
              width="130"
              height="110"
              viewBox="0 0 130 110"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="15"
                y="15"
                width="75"
                height="58"
                rx="8"
                fill="#EEEDFE"
              />
              <rect
                x="25"
                y="27"
                width="55"
                height="7"
                rx="3.5"
                fill="#AFA9EC"
              />
              <rect
                x="25"
                y="39"
                width="40"
                height="5"
                rx="2.5"
                fill="#CECBF6"
              />
              <rect
                x="25"
                y="48"
                width="48"
                height="5"
                rx="2.5"
                fill="#CECBF6"
              />
              <circle cx="95" cy="68" r="20" fill="#534AB7" />
              <circle cx="88" cy="68" r="2.5" fill="white" />
              <circle cx="95" cy="68" r="2.5" fill="white" />
              <circle cx="102" cy="68" r="2.5" fill="white" />
            </svg>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              We're online!
            </p>
          </div>
        )}

        {/* Messages */}
        {chatStarted && (
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-2 px-4 py-3 bg-white dark:bg-zinc-900"
            style={{ minHeight: 0, maxHeight: "300px" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  msg.role === "agent"
                    ? "bg-violet-100 text-violet-900 rounded-bl-sm self-start dark:bg-violet-900/40 dark:text-violet-200"
                    : "bg-violet-600 text-white rounded-br-sm self-end"
                }`}
              >
                <Markdown>{msg.text}</Markdown>
              </div>
            ))}
            {isTyping && (
              <div className="self-start flex items-center gap-1 px-3 py-2 rounded-xl rounded-bl-sm bg-violet-100 dark:bg-violet-900/40">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="We are here to help you"
            className="flex-1 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 outline-none"
          />
          <button
            onClick={sendMessage}
            className="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all flex items-center justify-center shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-zinc-400 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          Powered by iMovie Support
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-20 h-20 rounded-small flex flex-col items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-transform shadow-2xl shadow-purple-900/40 border border-white/10 bg-gray-900 pointer-events-auto"
      >
        {isOpen ? (
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <Image src={IconImage} alt="Agent" width={26} height={26} />
        )}
        <span className="text-white text-xs font-medium">Ask AI</span>
      </button>
    </div>
  );
}

export default LiveChat;
