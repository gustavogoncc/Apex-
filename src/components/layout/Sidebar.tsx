"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type SidebarProps = {
  navItems: NavItem[];
  onLogout: () => void;
  className?: string;
};

export function Sidebar({
  navItems,
  onLogout,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-80 flex-col",
        "border-r border-border",
        "bg-card",
        "px-7 py-8",
        className
      )}
    >
      {/* Header */}

      <div>
        <div className="pb-8">
          <Image
            src="/img/APEX.png"
            alt="Apex Studies"
            width={132}
            height={46}
            priority
            className="object-contain"
          />

          <div className="mt-6 space-y-2">
        

            <p className="max-w-[220px] text-sm leading-6 text-muted-foreground">
              Organize seus estudos com foco, constância e alta performance.
            </p>
          </div>
        </div>

        <div className="mb-8 h-px bg-border" />

        {/* Navigation */}

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-4",

                  "h-12",

                  "rounded-2xl",

                  "px-4",

                  "text-sm font-medium",

                  "transition-all duration-200",

                  active
                    ? [
                        "bg-primary/10",
                        "text-primary",
                        "border border-primary/20",
                      ]
                    : [
                        "border border-transparent",
                        "text-muted-foreground",
                        "hover:bg-secondary",
                        "hover:text-foreground",
                      ]
                )}
              >
                {/* Active Indicator */}

                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                )}

                <Icon
                  className={cn(
                    "size-5 transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}

      <div className="mt-auto border-t border-border pt-6">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="
            h-11
            w-full
            justify-start
            rounded-xl
            text-muted-foreground
            hover:bg-destructive/10
            hover:text-destructive
          "
        >
          <LogOut className="size-5" />

          <span>Sair do sistema</span>
        </Button>
      </div>
    </aside>
  );
}