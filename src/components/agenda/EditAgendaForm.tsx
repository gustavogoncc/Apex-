"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { supabase } from "@/lib/supabase";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface AgendaItem {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  completed: boolean;
}

interface EditAgendaFormProps {
  event: AgendaItem;
  onSuccess: () => void;
}

/* -------------------------------------------------------------------------- */
/* DATE HELPERS                                                               */
/* -------------------------------------------------------------------------- */

function formatToLocalDatetime(
  isoString: string
): string {
  const date = new Date(isoString);

  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1).padStart(
      2,
      "0"
    );

  const day =
    String(date.getDate()).padStart(
      2,
      "0"
    );

  const hours =
    String(date.getHours()).padStart(
      2,
      "0"
    );

  const minutes =
    String(date.getMinutes()).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function localDateTimeToISOString(
  value: string
): string {
  return new Date(value).toISOString();
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function EditAgendaForm({
  event,
  onSuccess,
}: EditAgendaFormProps) {
  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* SUBMIT                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleSubmit(
    formEvent: React.FormEvent<HTMLFormElement>
  ) {
    formEvent.preventDefault();

    setLoading(true);
    setErrorMessage(null);

    const formData =
      new FormData(
        formEvent.currentTarget
      );

    const title =
      String(
        formData.get("title") ?? ""
      ).trim();

    const description =
      String(
        formData.get("description") ?? ""
      ).trim();

    const startTime =
      String(
        formData.get("start_time") ?? ""
      );

    const endTime =
      String(
        formData.get("end_time") ?? ""
      );

    try {
      /* -------------------------------------------------------------------- */
      /* VALIDATION                                                            */
      /* -------------------------------------------------------------------- */

      if (!title) {
        setErrorMessage(
          "Informe um título para o compromisso."
        );

        return;
      }

      if (
        !startTime ||
        !endTime
      ) {
        setErrorMessage(
          "Informe a data e o horário de início e término."
        );

        return;
      }

      const startDate =
        new Date(startTime);

      const endDate =
        new Date(endTime);

      if (
        Number.isNaN(
          startDate.getTime()
        ) ||
        Number.isNaN(
          endDate.getTime()
        )
      ) {
        setErrorMessage(
          "Informe uma data e horário válidos."
        );

        return;
      }

      if (
        endDate <= startDate
      ) {
        setErrorMessage(
          "O horário de término deve ser posterior ao início."
        );

        return;
      }

      /* -------------------------------------------------------------------- */
      /* UPDATE                                                               */
      /* -------------------------------------------------------------------- */

      const {
        error,
      } = await supabase
        .from("agenda")
        .update({
          title,

          description:
            description || null,

          start_time:
            localDateTimeToISOString(
              startTime
            ),

          end_time:
            localDateTimeToISOString(
              endTime
            ),
        })
        .eq(
          "id",
          event.id
        );

      if (error) {
        console.error(
          "Erro ao atualizar compromisso:",
          error
        );

        setErrorMessage(
          "Não foi possível atualizar o compromisso. Tente novamente."
        );

        return;
      }

      onSuccess();
    } catch (error) {
      console.error(
        "Erro inesperado ao atualizar compromisso:",
        error
      );

      setErrorMessage(
        "Ocorreu um erro inesperado. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ------------------------------------------------------------------ */}
      {/* TITLE                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <label
          htmlFor="agenda-edit-title"
          className="text-sm font-medium"
        >
          Título
        </label>

        <Input
          id="agenda-edit-title"
          name="title"
          defaultValue={event.title}
          placeholder="Ex.: Revisar Direito Constitucional"
          required
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* DESCRIPTION                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <label
          htmlFor="agenda-edit-description"
          className="text-sm font-medium"
        >
          Descrição
        </label>

        <textarea
          id="agenda-edit-description"
          name="description"
          defaultValue={
            event.description ?? ""
          }
          placeholder="Adicione uma observação sobre este compromisso..."
          className="
            flex
            min-h-24
            w-full
            resize-none
            rounded-xl
            border
            border-border
            bg-background
            px-3
            py-2.5
            text-sm
            outline-none
            placeholder:text-muted-foreground
            focus-visible:ring-2
            focus-visible:ring-primary
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
          "
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* DATE / TIME                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="agenda-edit-start"
            className="text-sm font-medium"
          >
            Início
          </label>

          <Input
            id="agenda-edit-start"
            type="datetime-local"
            name="start_time"
            defaultValue={formatToLocalDatetime(
              event.start_time
            )}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="agenda-edit-end"
            className="text-sm font-medium"
          >
            Término
          </label>

          <Input
            id="agenda-edit-end"
            type="datetime-local"
            name="end_time"
            defaultValue={formatToLocalDatetime(
              event.end_time
            )}
            required
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ERROR                                                              */}
      {/* ------------------------------------------------------------------ */}

      {errorMessage && (
        <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* ACTION                                                             */}
      {/* ------------------------------------------------------------------ */}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Salvando..."
          : "Salvar alterações"}
      </Button>
    </form>
  );
}