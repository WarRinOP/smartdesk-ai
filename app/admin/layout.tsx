import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "SmartDesk Admin",
  description: "SmartDesk admin dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-bg-primary)",
      }}
    >
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          padding: "32px 36px",
          overflowY: "auto",
          minWidth: 0, // prevent flex overflow
        }}
      >
        {children}
      </main>
    </div>
  );
}
