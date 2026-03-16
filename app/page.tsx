import type { Metadata } from "next";
import SmartDeskNav from "@/components/SmartDeskNav";
import ChatWidgetLoader from "@/components/ChatWidgetLoader";

export const metadata: Metadata = {
  title: "SmartDesk — AI Support That Knows Your Business",
  description:
    "Upload your documents and let SmartDesk answer your customers' questions instantly, 24/7. Powered by RAG + Claude AI.",
};

const FEATURES = [
  {
    icon: "📄",
    title: "Trained on your content",
    desc: "Upload PDFs or text files. SmartDesk reads them and answers questions based on exactly what you wrote.",
  },
  {
    icon: "💬",
    title: "Every conversation logged",
    desc: "Every chat session is stored. Review what customers are asking, and how confidently your bot answered.",
  },
  {
    icon: "🎯",
    title: "Knows what it doesn't know",
    desc: "When the answer isn't in your docs, the bot says so and escalates — no hallucinations, no guessing.",
  },
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          background:
            "radial-gradient(ellipse at center, rgba(47,129,247,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <SmartDeskNav />

      {/* Hero section */}
      <section
        className="animate-fade-in-up"
        style={{
          maxWidth: "700px",
          width: "100%",
          textAlign: "center",
          padding: "60px 0 56px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "20px",
            border: "1px solid rgba(47,129,247,0.35)",
            background: "rgba(47,129,247,0.08)",
            marginBottom: "28px",
            fontSize: "12px",
            color: "var(--color-accent)",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--color-accent)",
              display: "inline-block",
            }}
          />
          Powered by Jina AI + Claude + pgvector
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 58px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "var(--color-text-primary)",
            marginBottom: "18px",
          }}
        >
          AI support that{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--color-accent), #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            knows your business
          </span>
        </h1>

        <p
          style={{
            fontSize: "17px",
            color: "var(--color-text-secondary)",
            lineHeight: 1.65,
            maxWidth: "520px",
            margin: "0 auto 36px",
          }}
        >
          Upload your docs. Your customers get instant, accurate answers.{" "}
          <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>24/7.</span>
        </p>

        {/* CTA hint */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "10px",
            background: "var(--color-bg-surface2)",
            border: "1px solid var(--color-border)",
            fontSize: "13.5px",
            color: "var(--color-text-secondary)",
          }}
        >
          <span>💬</span>
          <span>
            Try it →{" "}
            <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>
              open the chat in the corner
            </span>
          </span>
          <svg
            style={{ opacity: 0.5 }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </section>

      {/* Training documents — proves it's RAG */}
      <section
        className="animate-fade-in-up"
        style={{
          width: "100%",
          maxWidth: "900px",
          position: "relative",
          zIndex: 1,
          marginBottom: "40px",
          animationDelay: "0.2s",
          animationFillMode: "both",
        }}
      >
        <div
          style={{
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "18px" }}>📚</span>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-text-primary)", margin: 0 }}>
              This demo bot is trained on:
            </h2>
          </div>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)", margin: "0 0 16px" }}>
            Read the documents below, then ask the chat anything from them to see RAG in action.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { name: "NovaTech-FAQ.txt", desc: "15 Q&As — pricing, features, integrations" },
              { name: "NovaTech-Returns-Policy.txt", desc: "Refunds, cancellations, downgrades" },
              { name: "NovaTech-Product-Guide.txt", desc: "Full product overview and pricing tiers" },
            ].map((doc) => (
              <div
                key={doc.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "var(--color-bg-surface2)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>📄</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-primary)" }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                      {doc.desc}
                    </div>
                  </div>
                </div>
                <a
                  href={`/sample-docs/${doc.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--color-border)",
                    background: "transparent",
                    color: "var(--color-accent)",
                    fontSize: "12px",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "border-color 0.15s, background 0.15s",
                    flexShrink: 0,
                  }}
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section
        className="features-grid"
        style={{
          width: "100%",
          maxWidth: "900px",
          position: "relative",
          zIndex: 1,
          paddingBottom: "80px",
        }}
      >
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="feature-card animate-fade-in-up"
            style={{
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "24px",
              animationDelay: `${i * 0.08 + 0.15}s`,
              animationFillMode: "both",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "14px" }}>{f.icon}</div>
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                marginBottom: "8px",
              }}
            >
              {f.title}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid var(--color-border)",
          width: "100%",
          maxWidth: "900px",
          padding: "20px 0",
          textAlign: "center",
          fontSize: "12.5px",
          color: "var(--color-text-muted)",
        }}
      >
        Built by{" "}
        <span style={{ color: "var(--color-text-secondary)" }}>Abrar Tajwar Khan</span>{" "}
        · SmartDesk Portfolio Project ·{" "}
        <a
          href="https://github.com/WarRinOP/smartdesk-ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-accent)", textDecoration: "none" }}
        >
          View source
        </a>
      </footer>

      {/* Chat Widget — client-only, lazy loaded */}
      <ChatWidgetLoader />
    </main>
  );
}
