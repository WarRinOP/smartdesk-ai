import type { Metadata } from "next";
import StatsCards from "@/components/admin/StatsCards";
import ConversationTable from "@/components/admin/ConversationTable";

export const metadata: Metadata = { title: "Overview — SmartDesk Admin" };

export default function AdminPage() {
  return (
    <>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "4px" }}>
          Overview
        </h1>
        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
          Live metrics and recent conversation activity
        </p>
      </div>
      <StatsCards />
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "4px" }}>
          Recent Conversations
        </h2>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
          Click any row to expand the full conversation thread
        </p>
      </div>
      <ConversationTable />
    </>
  );
}
