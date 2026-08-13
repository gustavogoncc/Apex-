"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type MobileHeaderProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function MobileHeader({
  isOpen,
  onToggle,
}: MobileHeaderProps) {
  return (
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-40

        flex
        h-16
        items-center
        justify-between

        border-b
        border-border

        bg-card/80

        px-4

        backdrop-blur-xl

        md:hidden
      "
    >
      {/* Logo */}

      <Image
        src="/img/APEX.png"
        alt="Apex Studies"
        width={110}
        height={36}
        priority
        className="object-contain"
      />

      {/* Menu */}

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? (
          <X className="size-5" />
        ) : (
          <Menu className="size-5" />
        )}
      </Button>
    </header>
  );
}