/**
 * ============================================================================
 * Study Session Formatters
 * ============================================================================
 *
 * Responsável apenas por formatar valores para exibição.
 *
 * Não contém regras de negócio.
 *
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

/* -------------------------------------------------------------------------- */
/*                                    TIME                                    */
/* -------------------------------------------------------------------------- */

export function formatDuration(
  seconds: number
): string {
  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  if (hours === 0) {
    return `${minutes} min`;
  }

  return `${hours}h ${minutes}min`;
}

export function formatClock(
  seconds: number
): string {
  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  const remainingSeconds =
    seconds % 60;

  return `${pad(hours)}:${pad(
    minutes
  )}:${pad(remainingSeconds)}`;
}

export function formatMinutes(
  seconds: number
): string {
  return `${Math.floor(seconds / 60)} min`;
}

export function formatHour(
  value: string | Date
): string {
  return new Date(value)
    .toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
}

/* -------------------------------------------------------------------------- */
/*                                PERCENTAGES                                 */
/* -------------------------------------------------------------------------- */

export function formatAccuracy(
  value: number
): string {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${Math.round(value)}%`;
}

export function formatPercentage(
  value: number
): string {
  return `${Math.round(value)}%`;
}

/* -------------------------------------------------------------------------- */
/*                                   DATES                                    */
/* -------------------------------------------------------------------------- */

export function formatStudyDate(
  value: string | Date
): string {
  const date = new Date(value);

  const today = new Date();

  const yesterday = new Date();

  yesterday.setDate(
    today.getDate() - 1
  );

  if (
    date.toDateString() ===
    today.toDateString()
  ) {
    return "Hoje";
  }

  if (
    date.toDateString() ===
    yesterday.toDateString()
  ) {
    return "Ontem";
  }

  const diff =
    today.getTime() -
    date.getTime();

  const diffDays = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 7) {
    return date.toLocaleDateString(
      "pt-BR",
      {
        weekday: "long",
      }
    );
  }

  return date.toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

export function formatDate(
  value: string | Date
): string {
  return new Date(value)
    .toLocaleDateString("pt-BR");
}