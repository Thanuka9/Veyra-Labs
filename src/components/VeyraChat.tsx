"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  Briefcase,
  Calculator,
  ChevronDown,
  ChevronUp,
  DollarSign,
  GitBranch,
  Info,
  LayoutGrid,
  Mail,
  MessageCircle,
  Minus,
  Send,
  ShoppingCart,
  Sparkles,
  User,
  X,
} from "lucide-react";
import {
  CHAT_QUICK_REPLIES,
  createMessage,
  getBotResponse,
  getWelcomeMessage,
  shouldOpenEstimate,
  type ChatMessage,
  type QuickReply,
} from "@/lib/chatbot";
import { CONTACT_EMAIL } from "@/lib/content";
import { buildVeyraInquiryEmail, sendContactEmail, sendEstimateEmail } from "@/lib/email";
import { trackEvent } from "@/components/GoogleAnalytics";
import { formatRange, type ProjectEstimate } from "@/lib/estimate";
import { BrandLogo } from "./BrandLogo";
import { ChatMarkdown } from "./ChatMarkdown";
import { EstimateResultCard, EstimateWizard } from "./EstimateWizard";
import { LucideIcon } from "./LucideIcon";
import { cn } from "@/lib/cn";

const RESPONSE_DELAY_MS = 850;
const QUICK_ACTIONS_KEY = "veyra-quick-actions-open";

const QUICK_ICONS: Record<NonNullable<QuickReply["icon"]>, import("lucide-react").LucideIcon> = {
  estimate: Calculator,
  about: Info,
  services: Briefcase,
  pricing: DollarSign,
  cart: ShoppingCart,
  process: GitBranch,
  brain: Brain,
  portfolio: Sparkles,
  contact: Mail,
};

const QUICK_ICON_COLORS: Record<NonNullable<QuickReply["icon"]>, string> = {
  estimate: "text-violet",
  about: "text-cyan",
  services: "text-cyan",
  pricing: "text-emerald-400",
  cart: "text-amber-400",
  process: "text-indigo-400",
  brain: "text-violet",
  portfolio: "text-cyan",
  contact: "text-emerald-400",
};

export function VeyraChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [leadMode, setLeadMode] = useState(false);
  const [estimateMode, setEstimateMode] = useState(false);
  const [savedEstimates, setSavedEstimates] = useState<Record<string, ProjectEstimate>>({});
  const [estimateEmailSent, setEstimateEmailSent] = useState<Record<string, boolean>>({});
  const [lead, setLead] = useState({ name: "", email: "", message: "" });
  const [leadSending, setLeadSending] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const welcomeAdded = useRef(false);
  const atBottomRef = useRef(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUICK_ACTIONS_KEY);
      if (stored === "0") setQuickActionsOpen(false);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (open && !welcomeAdded.current) {
      welcomeAdded.current = true;
      setMessages([getWelcomeMessage()]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    atBottomRef.current = true;
    setShowScrollDown(false);
  }, []);

  useEffect(() => {
    if (!estimateMode && atBottomRef.current) scrollToBottom(false);
  }, [messages, typing, leadMode, savedEstimates, estimateMode, scrollToBottom]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    atBottomRef.current = distanceFromBottom < 64;
    setShowScrollDown(distanceFromBottom >= 64);
  }

  function toggleQuickActions() {
    setQuickActionsOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(QUICK_ACTIONS_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const startEstimate = useCallback(() => {
    setEstimateMode(true);
    setLeadMode(false);
    setQuickActionsOpen(false);
  }, []);

  const respond = useCallback(
    (userText: string) => {
      setMessages((prev) => [...prev, createMessage("user", userText)]);
      atBottomRef.current = true;

      if (shouldOpenEstimate(userText)) {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          startEstimate();
        }, RESPONSE_DELAY_MS);
        return;
      }

      setTyping(true);
      const reply = getBotResponse(userText);

      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [...prev, createMessage("assistant", reply)]);
        if (/book|discover|contact|talk to the team|send my info/i.test(userText)) {
          setTimeout(() => setLeadMode(true), 400);
        }
      }, RESPONSE_DELAY_MS);
    },
    [startEstimate]
  );

  function handleSend(text?: string) {
    const value = (text ?? input).trim();
    if (!value || typing) return;
    setInput("");
    respond(value);
  }

  function exitEstimateMode() {
    setEstimateMode(false);
    setQuickActionsOpen(true);
    atBottomRef.current = true;
    setTimeout(() => scrollToBottom(false), 50);
  }

  function handleEstimateComplete(estimate: ProjectEstimate, emailSent: boolean) {
    setSavedEstimates((prev) => ({ ...prev, [estimate.id]: estimate }));
    setEstimateEmailSent((prev) => ({ ...prev, [estimate.id]: emailSent }));
    const emailLine = emailSent
      ? "We've emailed our team  -  **reply within 24 hours**."
      : "Download your PDF below.";
    setMessages((prev) => [
      ...prev,
      {
        ...createMessage(
          "assistant",
          `Estimate ready! 🎉\n\n**${estimate.projectLabel}**\n**${formatRange(estimate.totalMin, estimate.totalMax)}** · ${estimate.timeline}\nRef: \`${estimate.id}\`\n\n${emailLine}`
        ),
        estimateId: estimate.id,
      },
    ]);
    setEstimateMode(false);
    setQuickActionsOpen(true);
    atBottomRef.current = true;
    if (emailSent) trackEvent("submit", "chat_estimate", estimate.projectLabel);
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lead.name.trim() || !lead.email.trim() || leadSending) return;

    setLeadSending(true);
    const summary = lead.message.trim() || "Interested in discussing a project with Veyra Labs.";

    try {
      await sendContactEmail(
        buildVeyraInquiryEmail({
          name: lead.name.trim(),
          email: lead.email.trim(),
          projectType: "Contact request",
          message: summary,
          source: "Veyra chatbot  -  veyralabs.com",
        })
      );
      trackEvent("submit", "chat_lead", "contact");
      setMessages((prev) => [
        ...prev,
        createMessage(
          "assistant",
          `Thanks **${lead.name.trim()}**! We'll respond within **24 hours** at ${lead.email.trim()}. 🚀`
        ),
      ]);
      setLeadMode(false);
      setLead({ name: "", email: "", message: "" });
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage(
          "assistant",
          `Couldn't send automatically. Email **${CONTACT_EMAIL}** and we'll respond within 24 hours.`
        ),
      ]);
    } finally {
      setLeadSending(false);
    }
  }

  async function handleResendEstimate(estimate: ProjectEstimate) {
    try {
      await sendEstimateEmail(estimate);
      setEstimateEmailSent((prev) => ({ ...prev, [estimate.id]: true }));
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage(
          "assistant",
          `Couldn't send. Email **${CONTACT_EMAIL}** with ref \`${estimate.id}\`.`
        ),
      ]);
    }
  }

  async function handleDownloadPdf(estimate: ProjectEstimate) {
    const { downloadEstimatePdf } = await import("@/lib/estimate-pdf");
    await downloadEstimatePdf(estimate);
  }

  const showQuickActionsBar = !estimateMode && !leadMode && !typing;

  return (
    <>
      {!open && (
        <div className="veyra-chat-launcher-wrap">
          <span className="veyra-chat-launcher-ring" aria-hidden />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open Veyra chat assistant"
            className="veyra-chat-launcher-btn"
          >
            <MessageCircle size={26} strokeWidth={2.25} />
          </button>
        </div>
      )}

      {open && (
        <div className="veyra-chat-panel" role="dialog" aria-modal="true" aria-label="Veyra Labs chat">
          {/* ── Header ── */}
          <header className="veyra-chat-header">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet/30 bg-violet/10">
              <BrandLogo variant="icon" className="h-8 w-auto" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                Veyra <Sparkles size={12} className="text-cyan" />
              </p>
              <p className="text-[11px] text-muted">
                {estimateMode ? "Estimate builder" : leadMode ? "Contact form" : "Online · Ask anything"}
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              {estimateMode && (
                <button type="button" onClick={exitEstimateMode} className="veyra-chat-icon-btn text-[11px] font-semibold text-cyan">
                  ← Chat
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} aria-label="Minimize" className="veyra-chat-icon-btn">
                <Minus size={18} />
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="veyra-chat-icon-btn">
                <X size={18} />
              </button>
            </div>
          </header>

          {/* ── Body ── */}
          <div className="veyra-chat-body">
            {estimateMode && !typing ? (
              /* Full-screen estimate  -  no chat overlap */
              <div className="veyra-chat-estimate-only">
                <EstimateWizard embedded onComplete={handleEstimateComplete} onCancel={exitEstimateMode} />
              </div>
            ) : (
              <>
                {/* Messages  -  isolated scroll region */}
                <div className="veyra-chat-messages-pane">
                  <div ref={scrollRef} className="veyra-chat-messages" onScroll={handleScroll}>
                    {messages.map((msg) => {
                      const est = msg.estimateId ? savedEstimates[msg.estimateId] : undefined;
                      return (
                        <div key={msg.id} className="veyra-chat-message-group">
                          <MessageBubble message={msg} />
                          {est && (
                            <div className="veyra-chat-estimate-card-slot">
                              <EstimateResultCard
                                estimate={est}
                                emailSent={estimateEmailSent[est.id]}
                                onDownload={() => handleDownloadPdf(est)}
                                onResendEmail={() => handleResendEstimate(est)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {typing && (
                      <div className="veyra-chat-message-group chat-fade-in">
                        <div className="flex items-end gap-2.5">
                          <BotAvatar />
                          <div className="chat-typing-bubble">
                            <p className="mb-1 text-[10px] font-medium text-muted">Veyra is typing…</p>
                            <TypingDots />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {showScrollDown && (
                    <button type="button" onClick={() => scrollToBottom(true)} className="chat-scroll-down" aria-label="Scroll down">
                      <ChevronDown size={12} />
                      New messages
                    </button>
                  )}
                </div>

                {/* Lead form  -  fixed slot, not in scroll */}
                {leadMode && !typing && (
                  <div className="veyra-chat-lead-slot chat-fade-in">
                    <form onSubmit={handleLeadSubmit} className="chat-lead-form">
                      <p className="mb-2 flex items-center gap-2 text-xs font-bold text-cyan">
                        <Mail size={14} />
                        Contact Us
                      </p>
                      <div className="space-y-2">
                        <input
                          required
                          placeholder="Your name"
                          value={lead.name}
                          onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                          className="veyra-chat-field"
                        />
                        <input
                          required
                          type="email"
                          placeholder="Email address"
                          value={lead.email}
                          onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                          className="veyra-chat-field"
                        />
                        <textarea
                          placeholder="Project description (optional)"
                          rows={2}
                          value={lead.message}
                          onChange={(e) => setLead((l) => ({ ...l, message: e.target.value }))}
                          className="veyra-chat-field resize-none"
                        />
                        <button
                          type="submit"
                          disabled={leadSending}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          <Mail size={14} />
                          {leadSending ? "Sending…" : "Send inquiry"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Quick actions  -  collapsible */}
                {showQuickActionsBar && (
                  <div className="veyra-chat-quick-bar">
                    <button
                      type="button"
                      onClick={toggleQuickActions}
                      className="veyra-chat-quick-toggle"
                      aria-expanded={quickActionsOpen}
                    >
                      <LayoutGrid size={13} className="text-violet" />
                      <span>Quick actions</span>
                      <span className="ml-auto text-muted">{quickActionsOpen ? "Hide" : "Show"}</span>
                      {quickActionsOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>

                    {quickActionsOpen && (
                      <div className="veyra-chat-quick-content">
                        <button
                          type="button"
                          disabled={typing}
                          onClick={() => {
                            setMessages((prev) => [...prev, createMessage("user", "I want a project estimate")]);
                            setTyping(true);
                            setTimeout(() => {
                              setTyping(false);
                              startEstimate();
                            }, RESPONSE_DELAY_MS);
                          }}
                          className="veyra-chat-estimate-btn"
                        >
                          <LucideIcon icon={Calculator} size={16} className="text-violet" />
                          Get estimate  -  PDF quote in 1 min
                        </button>
                        <div className="chat-quick-grid">
                          {CHAT_QUICK_REPLIES.filter((q) => q.id !== "estimate").map((q) => {
                            const icon = q.icon ? QUICK_ICONS[q.icon] : Sparkles;
                            const color = q.icon ? QUICK_ICON_COLORS[q.icon] : "text-cyan";
                            return (
                              <button
                                key={q.id}
                                type="button"
                                disabled={typing}
                                onClick={() => handleSend(q.message)}
                                className="chat-quick-grid-btn"
                              >
                                <LucideIcon icon={icon} size={14} className={color} />
                                <span>{q.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Input */}
                {!leadMode && (
                  <div className="veyra-chat-input-bar">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about services, pricing, estimates…"
                        disabled={typing}
                        className="veyra-chat-field min-w-0 flex-1 rounded-xl py-2.5"
                      />
                      <motion.button
                        type="submit"
                        disabled={!input.trim() || typing}
                        whileTap={{ scale: 0.92 }}
                        aria-label="Send"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet to-cyan text-white disabled:opacity-40"
                      >
                        <LucideIcon icon={Send} size={16} className="text-white" />
                      </motion.button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>

          <footer className="veyra-chat-footer">
            Estimates are indicative ·{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-cyan/80 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </footer>
        </div>
      )}
    </>
  );
}

function BotAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-violet/30 bg-violet/10">
      <LucideIcon icon={Bot} size={15} className="text-violet" />
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      {isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2">
          <LucideIcon icon={User} size={14} className="text-muted" />
        </div>
      ) : (
        <BotAvatar />
      )}
      <div className={cn("flex min-w-0 max-w-[calc(100%-2.75rem)] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div className={isUser ? "chat-bubble-user" : "chat-bubble-assistant"}>
          {isUser ? message.content : <ChatMarkdown text={message.content} />}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-violet/80"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.14 }}
        />
      ))}
    </div>
  );
}
