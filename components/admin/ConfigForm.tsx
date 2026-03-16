"use client";

import { useEffect, useRef, useState } from "react";

type Persona = "friendly" | "professional" | "concise";

interface Config {
  id: string;
  bot_name: string;
  persona: Persona;
  welcome_message: string;
  escalation_message: string;
}

const PERSONAS: { key: Persona; icon: string; label: string; desc: string }[] = [
  { key: "friendly", icon: "😊", label: "Friendly", desc: "Warm, approachable, conversational" },
  { key: "professional", icon: "💼", label: "Professional", desc: "Formal, precise, concise" },
  { key: "concise", icon: "⚡", label: "Concise", desc: "Brief answers, straight to the point" },
];

interface ToastProps { message: string; type: "success" | "error" }
function Toast({ message, type }: ToastProps) {
  return (
    <div className="animate-fade-in" style={{
      position: "fixed",
      bottom: "24px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "10px 20px",
      borderRadius: "10px",
      background: type === "success" ? "rgba(63,185,80,0.15)" : "rgba(248,81,73,0.15)",
      border: `1px solid ${type === "success" ? "rgba(63,185,80,0.4)" : "rgba(248,81,73,0.4)"}`,
      color: type === "success" ? "var(--color-success)" : "var(--color-danger)",
      fontSize: "13px",
      fontWeight: 500,
      zIndex: 9999,
      backdropFilter: "blur(8px)",
    }}>
      {type === "success" ? "✓ " : "✗ "}{message}
    </div>
  );
}

export default function ConfigForm() {
  const [config, setConfig] = useState<Config | null>(null);
  const [form, setForm] = useState<Omit<Config, "id">>({
    bot_name: "",
    persona: "friendly",
    welcome_message: "",
    escalation_message: "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data: Config) => {
        setConfig(data);
        setForm({
          bot_name: data.bot_name,
          persona: data.persona,
          welcome_message: data.welcome_message,
          escalation_message: data.escalation_message,
        });
      })
      .catch(console.error);
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json() as Config;
      setConfig(updated);
      showToast("Configuration saved!", "success");
    } catch {
      showToast("Failed to save — please try again", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    background: "var(--color-bg-surface2)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    color: "var(--color-text-primary)",
    fontSize: "13.5px",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--color-text-secondary)",
    marginBottom: "6px",
  };

  if (!config) {
    return <div style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>Loading configuration…</div>;
  }

  return (
    <>
      {toast && <Toast {...toast} />}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "28px", alignItems: "start" }}>
        {/* Left: Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Bot name */}
          <div>
            <label style={labelStyle}>Bot Name</label>
            <input
              type="text"
              value={form.bot_name}
              onChange={(e) => setForm((f) => ({ ...f, bot_name: e.target.value }))}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
              placeholder="e.g. SmartDesk Assistant"
            />
          </div>

          {/* Persona cards */}
          <div>
            <label style={labelStyle}>Persona</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {PERSONAS.map((p) => {
                const active = form.persona === p.key;
                return (
                  <div
                    key={p.key}
                    onClick={() => setForm((f) => ({ ...f, persona: p.key }))}
                    style={{
                      padding: "14px",
                      borderRadius: "10px",
                      border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                      background: active ? "rgba(47,129,247,0.08)" : "var(--color-bg-surface2)",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>{p.icon}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: active ? "var(--color-accent)" : "var(--color-text-primary)", marginBottom: "4px" }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                      {p.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Welcome message */}
          <div>
            <label style={labelStyle}>Welcome Message</label>
            <textarea
              value={form.welcome_message}
              onChange={(e) => setForm((f) => ({ ...f, welcome_message: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: "vertical", minHeight: "80px", fontFamily: "inherit" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
              placeholder="Hi! How can I help you today?"
            />
          </div>

          {/* Escalation message */}
          <div>
            <label style={labelStyle}>Escalation Message</label>
            <textarea
              value={form.escalation_message}
              onChange={(e) => setForm((f) => ({ ...f, escalation_message: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: "vertical", minHeight: "80px", fontFamily: "inherit" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
              placeholder="Please contact us directly and we'll be happy to help."
            />
            <div style={{ marginTop: "5px", fontSize: "11px", color: "var(--color-text-muted)" }}>
              Shown when the bot can&apos;t answer a question
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 24px",
              borderRadius: "9px",
              border: "none",
              background: saving ? "var(--color-bg-surface2)" : "var(--color-accent)",
              color: saving ? "var(--color-text-muted)" : "#fff",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              width: "fit-content",
              transition: "all 0.15s",
            }}
          >
            {saving ? "Saving…" : "Save Configuration"}
          </button>
        </div>

        {/* Right: Live preview */}
        <div style={{ position: "sticky", top: "24px" }}>
          <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Live Preview
          </div>
          <div style={{
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}>
            {/* Widget header */}
            <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-surface2)", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, var(--color-accent), #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>
                🤖
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  {form.bot_name || "Bot Name"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "1px" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />
                  <span style={{ fontSize: "10px", color: "var(--color-text-secondary)" }}>Online</span>
                </div>
              </div>
            </div>

            {/* Message preview */}
            <div style={{ padding: "14px 12px" }}>
              <div style={{
                padding: "9px 12px",
                background: "var(--color-bg-surface2)",
                border: "1px solid var(--color-border)",
                borderRadius: "14px 14px 14px 4px",
                fontSize: "12.5px",
                color: "var(--color-text-primary)",
                lineHeight: 1.5,
                maxWidth: "90%",
              }}>
                {form.welcome_message || "Welcome message will appear here…"}
              </div>
            </div>

            {/* Input preview */}
            <div style={{ padding: "8px 10px 12px", borderTop: "1px solid var(--color-border)", display: "flex", gap: "6px" }}>
              <div style={{ flex: 1, padding: "7px 10px", background: "var(--color-bg-surface2)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px", color: "var(--color-text-muted)" }}>
                Ask anything…
              </div>
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
