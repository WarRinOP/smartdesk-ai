import type { Metadata } from "next";
import ConversationTable from "@/components/admin/ConversationTable";

export const metadata: Metadata = { title: "Conversations — SmartDesk Admin" };

export default function ConversationsPage() {
  return (
    <>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "4px" }}>
          Conversations
        </h1>
        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
          Browse all chat sessions. Click a row to see the full transcript.
        </p>
      </div>
      <ConversationTable />
    </>
  );
}
