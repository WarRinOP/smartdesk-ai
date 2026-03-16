import type { Metadata } from "next";
import ConfigForm from "@/components/admin/ConfigForm";

export const metadata: Metadata = { title: "Configuration — SmartDesk Admin" };

export default function ConfigPage() {
  return (
    <>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "4px" }}>
          Configuration
        </h1>
        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
          Customize your bot&apos;s name, persona, and response messages.
        </p>
      </div>
      <ConfigForm />
    </>
  );
}
