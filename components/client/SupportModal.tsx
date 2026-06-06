"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Headphones,
  X,
  Send,
  User,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { SupportMessage, Order } from "@/utils/types";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: Order;
}

const QUICK_QUERIES = [
  { id: "tracking", label: "Where is my order status?" },
  { id: "protection", label: "Ask about protection remark" },
  { id: "damaged", label: "How to report damaged goods?" },
  { id: "hours", label: "What are delivery hours?" },
];

export default function SupportModal({
  isOpen,
  onClose,
  currentOrder,
}: SupportModalProps) {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: `Hello there 👋! I am the automated assistants for Siang Grocery. How can I help you regarding order ${currentOrder.id} today?`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const addBotReply = (replyText: string) => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 600);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsgText = text.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: userMsgText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInputText("");

    // Formulate automated responsive answers
    const lowerText = userMsgText.toLowerCase();

    if (
      lowerText.includes("track") ||
      lowerText.includes("where") ||
      lowerText.includes("status")
    ) {
      if (currentOrder.status === "delivered") {
        addBotReply(
          `Your order, **${currentOrder.id}**, was successfully **delivered** at **${currentOrder.completedAt}**! The recipient was **${currentOrder.recipient}**. If you cannot find your packages, please check with your guards/reception or message us back.`,
        );
      } else if (currentOrder.status === "shipped") {
        addBotReply(
          `Your order is on its way 🚚! It was shipped on **${currentOrder.shippedAt}**. It is handled by our premium grocery dispatcher.`,
        );
      } else {
        addBotReply(
          `Your order is in **processing** state 📦. It was placed on **${currentOrder.createdAt}** and is being curated with the freshest meat and dairy from our chiller.`,
        );
      }
    } else if (
      lowerText.includes("protect") ||
      lowerText.includes("remark") ||
      lowerText.includes("extra")
    ) {
      addBotReply(
        `We received your request: "${currentOrder.remark || "Give the product extra protection"}". We always wrap meats in special insulated packs and double-box dairy to keep them cool and completely dry during route!`,
      );
    } else if (
      lowerText.includes("damage") ||
      lowerText.includes("refund") ||
      lowerText.includes("broken")
    ) {
      addBotReply(
        `Oh no, we are truly sorry about any damaged goods! 😢 Since we pride ourselves on freshness, simply snap a picture of the product and tap "Review" to upload or email support@sianggrocery.com. We will arrange an immediate FPX refund or replacement item within 24 hours!`,
      );
    } else if (
      lowerText.includes("hour") ||
      lowerText.includes("time") ||
      lowerText.includes("open")
    ) {
      addBotReply(
        `Siang Grocery delivers daily from **8:00 AM to 9:00 PM**, including weekends! Orders placed after 6 PM will be dispatched early the following morning.`,
      );
    } else {
      addBotReply(
        `Got it! I am passing your query regarding order **${currentOrder.id}** to our support team. An agent will follow up with you via your email or phone on record! Is there anything else I can clarify for you?`,
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Chat Panel Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md h-[550px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/50 rounded-xl relative">
                  <Headphones className="w-5 h-5 text-indigo-50" />
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full animate-ping" />
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm">
                    Customer Helpdesk
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    Online • Typically replies instantly
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-white/80 hover:text-white hover:bg-indigo-700/50 rounded-lg transition-colors"
                id="btn-close-support"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Window */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.sender === "user"
                      ? "ml-auto flex-row-reverse"
                      : "mr-auto"
                  }`}
                  id={`dialog-msg-${msg.id}`}
                >
                  {/* Avatar wrapper */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-display text-xs ${
                      msg.sender === "user"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Headphones className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div
                      className={`p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-white text-gray-800 border border-gray-100 shadow-xs rounded-tl-none"
                      }`}
                    >
                      {/* Sub-markdown parsing for bold tags (**bold**) */}
                      {msg.text.split("**").map((chunk, i) =>
                        i % 2 === 1 ? (
                          <strong
                            key={i}
                            className="font-semibold text-indigo-900 dark:text-inherit"
                          >
                            {chunk}
                          </strong>
                        ) : (
                          chunk
                        ),
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 px-1 mt-1 block">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick chips suggested input */}
            <div className="px-4 py-2 bg-white border-t border-gray-100 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
              {QUICK_QUERIES.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSendMessage(q.label)}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-100 text-[11px] text-gray-600 font-medium rounded-full transition-colors shrink-0"
                  id={`chip-${q.id}`}
                >
                  <HelpCircle className="w-3 h-3 text-indigo-500" />
                  {q.label}
                </button>
              ))}
            </div>

            {/* Support Message Composer form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-3 border-t border-gray-150 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 text-sm p-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none leading-none placeholder:text-gray-400"
                id="support-chat-input"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-indigo-600 font-medium text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-all active:scale-95 shrink-0"
                id="btn-send-support"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
