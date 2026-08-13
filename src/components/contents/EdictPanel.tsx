"use client";

import type {
  ReactNode,
} from "react";

interface EdictPanelProps {
  children: ReactNode;
}

export function EdictPanel({
  children,
}: EdictPanelProps) {
  return (
    <section
      className="
        flex
        flex-col
        gap-6
      "
    >
      {children}
    </section>
  );
}