"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Calendar,
  Compass,
  LayoutDashboard,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Minhas Rotas",
      href: "/rotas",
      icon: Compass,
    },
    {
      name: "Agenda",
      href: "/agenda",
      icon: Calendar,
    },
  ];

  useEffect(() => {
    const closeSidebar = () => setIsOpen(false);

    window.addEventListener("resize", closeSidebar);

    return () =>
      window.removeEventListener("resize", closeSidebar);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[288px_1fr]">
      {/* Mobile Header */}

      <MobileHeader
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
      />

      {/* Sidebar Desktop */}

      <aside className="hidden md:block">
        <Sidebar
          navItems={navItems}
          onLogout={handleLogout}
        />
      </aside>

      {/* Sidebar Mobile */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          transition-transform
          duration-300
          md:hidden

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          navItems={navItems}
          onLogout={handleLogout}
        />
      </aside>

      {/* Overlay */}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main */}

      <main
        className="
          mt-16
          min-w-0
          px-5
          py-6

          md:mt-0
          md:px-10
          md:py-8
        "
      >
        {children}
      </main>
    </div>
  );
}