"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { supabase } from "@/lib/supabase";

interface CreateAgendaFormProps {
  onSuccess: () => void;
}

/* -------------------------------------------------------------------------- */
/* DATE HELPERS                                                               */
/* -------------------------------------------------------------------------- */

function localDateTimeToISOString(
  value: string
): string {
  return new Date(value).toISOString();
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function CreateAgendaForm({
  onSuccess,
}: CreateAgendaFormProps) {
  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* SUBMIT                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage(null);

    const formData =
      new FormData(event.currentTarget);

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
      /* AUTH                                                                  */
      /* -------------------------------------------------------------------- */

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        console.error(
          "Usuário não autenticado:",
          userError
        );

        setErrorMessage(
          "Não foi possível identificar o usuário autenticado."
        );

        return;
      }

      /* -------------------------------------------------------------------- */
      /* CREATE                                                                */
      /* -------------------------------------------------------------------- */

      const {
        error,
      } = await supabase
        .from("agenda")
        .insert({
          user_id: user.id,

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
        });

      if (error) {
        console.error(
          "Erro ao salvar compromisso:",
          error
        );

        setErrorMessage(
          "Não foi possível salvar o compromisso. Tente novamente."
        );

        return;
      }

      onSuccess();
    } catch (error) {
      console.error(
        "Erro inesperado ao salvar compromisso:",
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
          htmlFor="agenda-title"
          className="text-sm font-medium"
        >
          Título
        </label>

        <Input
          id="agenda-title"
          name="title"
          placeholder="Ex.: Revisar Direito Constitucional"
          required
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* DESCRIPTION                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <label
          htmlFor="agenda-description"
          className="text-sm font-medium"
        >
          Descrição
        </label>

        <textarea
          id="agenda-description"
          name="description"
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
            htmlFor="agenda-start"
            className="text-sm font-medium"
          >
            Início
          </label>

          <Input
            id="agenda-start"
            type="datetime-local"
            name="start_time"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="agenda-end"
            className="text-sm font-medium"
          >
            Término
          </label>

          <Input
            id="agenda-end"
            type="datetime-local"
            name="end_time"
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
          : "Salvar compromisso"}
      </Button>
    </form>
  );
}