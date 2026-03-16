import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "SmartDesk Admin",
  description: "SmartDesk admin dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
