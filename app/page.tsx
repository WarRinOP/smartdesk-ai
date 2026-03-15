export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#2f81f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </div>
      <h1
        style={{ color: "#e6edf3", fontSize: "24px", fontWeight: 600, margin: 0 }}
      >
        SmartDesk
      </h1>
      <p style={{ color: "#8b949e", fontSize: "14px", margin: 0 }}>
        AI Customer Support — Phase 1 scaffold complete
      </p>
    </main>
  );
}
