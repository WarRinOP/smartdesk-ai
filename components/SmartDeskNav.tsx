"use client";

import { useState } from "react";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import SeedButton from "@/components/SeedButton";

export default function SmartDeskNav() {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <span style={{ fontSize: "20px" }}>🤖</span>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
            SmartDesk
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }} className="hidden sm:flex">
          <button
            onClick={() => setShowModal(true)}
            className="gh-link"
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px", borderRadius: "8px",
              border: "1px solid var(--color-border)",
              background: "transparent", color: "var(--color-text-secondary)",
              fontSize: "13px", cursor: "pointer",
              transition: "border-color 0.15s, color 0.15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How It Works
          </button>

          <SeedButton />

          <a href="/admin" className="gh-link" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: "13px", textDecoration: "none", transition: "border-color 0.15s, color 0.15s" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            Admin
          </a>

          <a href="https://github.com/WarRinOP/smartdesk-ai" target="_blank" rel="noopener noreferrer" className="gh-link" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", fontSize: "13px", textDecoration: "none", transition: "border-color 0.15s, color 0.15s" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>

        {/* Mobile — icon-only buttons + hamburger */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }} className="flex sm:hidden">
          {/* How It Works icon */}
          <button
            onClick={() => setShowModal(true)}
            aria-label="How It Works"
            style={{
              width: 34, height: 34, borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "transparent", color: "var(--color-text-secondary)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            style={{
              width: 34, height: 34, borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "transparent", color: "var(--color-text-secondary)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="sm:hidden"
          style={{
            width: "100%", maxWidth: "900px",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 12, padding: "8px",
            display: "flex", flexDirection: "column", gap: 4,
            position: "relative", zIndex: 9,
            marginTop: -8, marginBottom: 8,
          }}
        >
          {[
            { href: "/admin", label: "Admin", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg> },
            { href: "https://github.com/WarRinOP/smartdesk-ai", label: "GitHub", external: true, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg> },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8,
                color: "var(--color-text-secondary)",
                textDecoration: "none", fontSize: 14,
                transition: "background 0.15s",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </div>
      )}

      {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
    </>
  );
}
