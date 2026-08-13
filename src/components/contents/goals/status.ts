import type {
  GoalStatus,
} from "./types";

interface GoalStatusConfig {
  label: string;

  className: string;
}

export const GOAL_STATUS_CONFIG: Record<
  GoalStatus,
  GoalStatusConfig
> = {
  NOT_STARTED: {
    label: "Não iniciada",

    className:
      "bg-muted text-muted-foreground",
  },

  IN_PROGRESS: {
    label: "Em andamento",

    className:
      "bg-blue-500/10 text-blue-600",
  },

  COMPLETED: {
    label: "Concluída",

    className:
      "bg-emerald-500/10 text-emerald-600",
  },

  OVERDUE: {
    label: "Atrasada",

    className:
      "bg-red-500/10 text-red-600",
  },
};