export type TopicStatus =
  | "A_ESTUDAR"
  | "ESTUDANDO"
  | "CONCLUIDO";

type TopicStatusVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

interface TopicStatusConfig {
  label: string;

  variant: TopicStatusVariant;

  className: string;
}

export const STATUS_CONFIG: Record<
  TopicStatus,
  TopicStatusConfig
> = {
  A_ESTUDAR: {
    label: "A estudar",

    variant: "secondary",

    className:
      "bg-muted text-muted-foreground",
  },

  ESTUDANDO: {
    label: "Estudando",

    variant: "secondary",

    className:
      "bg-blue-500/10 text-blue-600",
  },

  CONCLUIDO: {
    label: "Concluído",

    variant: "secondary",

    className:
      "bg-emerald-500/10 text-emerald-600",
  },
} as const;

export const TOPIC_STATUS_OPTIONS = [
  {
    value: "A_ESTUDAR",

    label: "A estudar",
  },

  {
    value: "ESTUDANDO",

    label: "Estudando",
  },

  {
    value: "CONCLUIDO",

    label: "Concluído",
  },
] as const;