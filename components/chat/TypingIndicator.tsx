export default function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "4px",
        padding: "10px 14px",
        background: "var(--color-bg-surface2)",
        borderRadius: "18px 18px 18px 4px",
        width: "fit-content",
        maxWidth: "80px",
      }}
      aria-label="Assistant is typing"
    >
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}
