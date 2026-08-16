import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Lady Gasy - Administration",
  description: "Tableau de bord et gestion administrative Lady Gasy",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md">
      <AdminSidebar />
      <AdminHeader />
      <main className="pt-20 pb-xl px-container-padding md:ml-64 md:px-xl max-w-[1280px] mx-auto min-h-[calc(100vh-80px)]">
        {children}
      </main>
    </div>
  );
}
