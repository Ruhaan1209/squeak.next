"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import { Home, Shield, Settings, LogOut, Menu, X } from "lucide-react";

function DashboardSidebar() {
  const router = useRouter();
  const { classrooms, selectedClassroom, setSelectedClassroom } = useDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/moderate", label: "Moderate", icon: Shield },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-base cursor-pointer border-none">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6">
          <h1 className="text-xl font-primary font-bold">Dashboard</h1>
        </div>

        {classrooms.length > 0 && (
          <div className="px-4 mb-4">
            <select value={selectedClassroom?.classroom_id || ""} onChange={(e) => {
              const c = classrooms.find((cl) => cl.classroom_id === e.target.value);
              if (c) setSelectedClassroom(c);
            }} className="w-full px-3 py-2 rounded-xl border border-border font-secondary text-sm">
              {classrooms.map((c) => <option key={c.classroom_id} value={c.classroom_id}>{c.name}</option>)}
            </select>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-secondary text-sm text-text-secondary hover:bg-item-background transition-colors no-underline">
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 space-y-2">
          <Link href="/learn" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-item-background font-secondary text-sm text-text-primary no-underline">
            Learner View
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl font-secondary text-sm text-text-secondary hover:bg-red-50 hover:text-danger transition-colors w-full cursor-pointer border-none bg-transparent">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-8 mt-14 md:mt-0">{children}</main>
      </div>
    </DashboardProvider>
  );
}
