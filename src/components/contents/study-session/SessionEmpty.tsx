"use client";

import { Clock3 } from "lucide-react";

interface SessionEmptyProps {
  title?: string;

  description?: string;
}

export function SessionEmpty({
  title = "Nenhuma sessão encontrada",
  description = "Quando você finalizar uma sessão de estudos, ela aparecerá aqui para acompanhamento do seu histórico.",
}: SessionEmptyProps) {
  return (
    <section
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        p-12
        text-center
      "
    >
      <div className="mb-4 rounded-full bg-muted p-4">
        <Clock3 className="size-8 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </section>
  );
}