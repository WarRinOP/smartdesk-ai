import type { Metadata } from "next";
import GapReport from "@/components/admin/GapReport";
import ErrorBoundary from "@/components/admin/ErrorBoundary";

export const metadata: Metadata = { title: "Knowledge Gaps — SmartDesk Admin" };

export default function GapsPage() {
  return (
    <>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "4px" }}>
          Knowledge Gaps
        </h1>
        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
          Questions your bot couldn&apos;t answer confidently, clustered by topic. Upload more content to fill the gaps.
        </p>
      </div>
      <ErrorBoundary label="Gap report failed to load.">
        <GapReport />
      </ErrorBoundary>
    </>
  );
}
