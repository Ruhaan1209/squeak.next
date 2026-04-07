"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { usePlatform } from "@/contexts/PlatformContext";
import { BookOpen, User, MessageCircle, LogOut, Menu, X, Crown } from "lucide-react";

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isTeacher, plan } = usePlatform();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const navItems = [
    { href: "/learn", label: "Learn", icon: BookOpen },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-base cursor-pointer border-none">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6">
          <h1 className="text-xl font-primary font-bold">Squeak</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-secondary text-sm text-text-secondary hover:bg-item-background transition-colors no-underline">
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          <a href="/contact-support.html" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-secondary text-sm text-text-secondary hover:bg-item-background transition-colors no-underline">
            <MessageCircle size={18} /> Contact
          </a>
        </nav>

        <div className="p-4 space-y-2">
          {plan === "FREE" && (
            <Link href="/profile" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emphasis font-secondary text-sm text-text-primary hover:opacity-90 transition-opacity no-underline">
              <Crown size={18} /> Get Premium
            </Link>
          )}
          {isTeacher && (
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-item-background font-secondary text-sm text-text-primary hover:opacity-90 transition-opacity no-underline">
              Teacher Dashboard
            </Link>
          )}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl font-secondary text-sm text-text-secondary hover:bg-red-50 hover:text-danger transition-colors w-full cursor-pointer border-none bg-transparent">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 md:ml-0 ml-0 mt-14 md:mt-0">{children}</main>
    </div>
  );
}
