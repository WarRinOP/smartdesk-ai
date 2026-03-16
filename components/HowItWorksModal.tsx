"use client";

import { useEffect } from "react";

export function HowItWorksModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative", width: "100%", maxWidth: "520px",
          maxHeight: "90vh", overflowY: "auto", borderRadius: "20px",
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          position: "sticky", top: 0, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "18px 24px",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-surface)", zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "var(--color-accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
              What is SmartDesk?
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: "50%", border: "none",
              background: "transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--color-text-muted)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>

          {/* Hero */}
          <div style={{
            padding: "16px", borderRadius: 12,
            background: "rgba(47,129,247,0.08)",
            border: "1px solid rgba(47,129,247,0.2)",
          }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>
              SmartDesk is an AI-powered customer support assistant that answers questions — trained specifically on your business&apos;s own documents and information.
            </p>
          </div>

          {/* Problem */}
          <Section icon="😩" title="The Problem">
            Every business gets the same questions over and over — pricing, returns, how to use a product, what's included. Answering them takes time. Hiring someone just to answer repetitive questions is expensive. Leaving them unanswered loses customers.
          </Section>

          {/* What it does */}
          <div>
            <SectionTitle icon="✅" title="What SmartDesk Does" />
            <p style={{ margin: "0 0 12px" }}>
              You upload your company documents — FAQs, product guides, policies, anything. SmartDesk reads and learns from them. Then, when a customer asks a question, the AI finds the right answer from your documents and replies instantly.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 4 }}>
              {[
                ["💬", "Instant answers", "Replies to customer questions 24/7, no human needed"],
                ["📚", "Trained on your data", "Knows exactly what your business offers"],
                ["🎯", "Accurate responses", "Only answers from what it was taught — no guessing"],
                ["📊", "Admin dashboard", "See every conversation, spot unanswered questions"],
              ].map(([icon, title, desc]) => (
                <div key={title as string} style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  <span><strong style={{ color: "var(--color-text-primary)" }}>{title}</strong> — {desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to test */}
          <div>
            <SectionTitle icon="🚀" title="How to Try It Right Now" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["1", "Scroll down — the chat bubble is in the bottom-right corner of the page"],
                ["2", "Click it to open the chat"],
                ["3", "Ask anything about <strong style=\"color:var(--color-text-primary)\">NovaTech</strong> — their products, return policy, pricing, or support hours"],
                ["4", "The AI answers instantly, using NovaTech&apos;s actual documents"],
                ["5", "Click <strong style=\"color:var(--color-text-primary)\">Admin</strong> in the top navigation to see the backend — conversations, knowledge base, and gaps"],
              ].map(([num, step]) => (
                <div key={num as string} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
                    background: "var(--color-bg-surface2)", border: "1px solid var(--color-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "var(--color-accent)",
                  }}>{num}</span>
                  <span dangerouslySetInnerHTML={{ __html: step as string }} />
                </div>
              ))}
            </div>
          </div>

          {/* Who it's for */}
          <Section icon="👥" title="Who Is This For?">
            Any business with a customer-facing team. E-commerce stores, SaaS products, service agencies — if you have customers asking questions, SmartDesk handles them so your team doesn&apos;t have to.
          </Section>

          {/* Demo note */}
          <div style={{
            padding: "12px 14px", borderRadius: 10, fontSize: 12,
            background: "var(--color-bg-primary)", border: "1px solid var(--color-border)",
          }}>
            <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>This is a live demo</span> trained on sample NovaTech data.
            Want SmartDesk trained on <em>your</em> business?{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>Reach out to Abrar Tajwar Khan</strong> for a custom build.
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <p style={{ margin: "0 0 10px", fontWeight: 600, color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 18 }}>{icon}</span> {title}
    </p>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionTitle icon={icon} title={title} />
      <p style={{ margin: 0 }}>{children}</p>
    </div>
  );
}
