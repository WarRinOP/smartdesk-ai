import type { Metadata } from "next";
import SeedButton from "@/components/SeedButton";
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

      {/* Hover fix: inject minimal CSS for feature cards */}
      <style>{`
        .feature-card {
          transition: border-color 0.2s, transform 0.2s;
        }
        .feature-card:hover {
          border-color: var(--color-border-hover) !important;
          transform: translateY(-2px);
        }
        .gh-link:hover {
          border-color: var(--color-border-hover) !important;
          color: var(--color-text-primary) !important;
        }
      `}</style>

      {/* Nav bar */}
      <nav
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <span style={{ fontSize: "20px" }}>🤖</span>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            SmartDesk
          </span>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <SeedButton />
          <a
            href="https://github.com/WarRinOP/smartdesk-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="gh-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              background: "transparent",
              color: "var(--color-text-secondary)",
              fontSize: "13px",
              textDecoration: "none",
              transition: "border-color 0.15s, color 0.15s",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </nav>

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

      {/* Feature cards */}
      <section
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
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
