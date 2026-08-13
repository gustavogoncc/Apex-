import { supabase } from "@/lib/supabase";

import {
  GOAL_TYPE_CONFIG,
} from "./goalType";

import type {
  GoalCardData,
  GoalStatus,
  GoalType,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                              DATABASE TYPES                                */
/* -------------------------------------------------------------------------- */

interface GoalDatabaseRow {
  id: string;
  subject_id: string;
  title: string;
  type: string;
  target_value: number;
  current_value: number;
  due_date: string;
  completed: boolean;
  created_at: string;
}

interface StudySessionRow {
  id: string;
  subject_id: string;
  status: string;
  duration_seconds: number | null;
  questions_answered: number | null;
  finished_at: string | null;
}

interface StudySessionTopicRow {
  session_id: string;
  topic_id: string;
}

/* -------------------------------------------------------------------------- */
/*                              HELPER TYPES                                  */
/* -------------------------------------------------------------------------- */

interface GoalProgressContext {
  sessions: StudySessionRow[];
  topics: StudySessionTopicRow[];
}

/* -------------------------------------------------------------------------- */
/*                              GOAL STATUS                                   */
/* -------------------------------------------------------------------------- */

function getGoalStatus(
  goal: GoalDatabaseRow,
  currentValue: number
): GoalStatus {
  const targetValue =
    Number(goal.target_value ?? 0);

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  /*
   * Uma meta concluída permanece concluída,
   * mesmo que o prazo tenha passado.
   */
  if (
    goal.completed ||
    (
      targetValue > 0 &&
      currentValue >= targetValue
    )
  ) {
    return "COMPLETED";
  }

  /*
   * Meta cujo prazo já passou.
   */
  if (
    goal.due_date < today
  ) {
    return "OVERDUE";
  }

  /*
   * Já existe progresso, mas ainda
   * não atingiu o objetivo.
   */
  if (
    currentValue > 0
  ) {
    return "IN_PROGRESS";
  }

  return "NOT_STARTED";
}

/* -------------------------------------------------------------------------- */
/*                              GOAL PROGRESS                                 */
/* -------------------------------------------------------------------------- */

function calculateGoalCurrentValue(
  goal: GoalDatabaseRow,
  context: GoalProgressContext
): number {
  const goalCreatedAt =
    new Date(
      goal.created_at
    ).getTime();

  const dueDateEnd =
    new Date(
      `${goal.due_date}T23:59:59.999`
    ).getTime();

  /*
   * Consideramos somente sessões:
   *
   * 1. da mesma disciplina;
   * 2. concluídas;
   * 3. finalizadas;
   * 4. criadas depois da criação da meta;
   * 5. dentro do prazo da meta.
   */
  const validSessions =
    context.sessions.filter(
      (session) => {
        if (
          session.status !==
          "COMPLETED"
        ) {
          return false;
        }

        if (
          !session.finished_at
        ) {
          return false;
        }

        const finishedAt =
          new Date(
            session.finished_at
          ).getTime();

        if (
          Number.isNaN(
            finishedAt
          )
        ) {
          return false;
        }

        if (
          finishedAt <
          goalCreatedAt
        ) {
          return false;
        }

        if (
          finishedAt >
          dueDateEnd
        ) {
          return false;
        }

        return true;
      }
    );

  switch (
    goal.type as GoalType
  ) {
    /* ---------------------------------------------------------------------- */
    /* TEMPO DE ESTUDO                                                        */
    /* ---------------------------------------------------------------------- */

    case "STUDY_TIME": {
      const totalSeconds =
        validSessions.reduce(
          (
            total,
            session
          ) =>
            total +
            Number(
              session.duration_seconds ??
              0
            ),
          0
        );

      /*
       * O banco armazena segundos.
       *
       * A meta trabalha em horas.
       *
       * Ex.:
       * 5400 segundos = 1.5 horas
       */
      return (
        totalSeconds /
        3600
      );
    }

    /* ---------------------------------------------------------------------- */
    /* SESSÕES                                                                */
    /* ---------------------------------------------------------------------- */

    case "SESSIONS": {
      return validSessions.length;
    }

    /* ---------------------------------------------------------------------- */
    /* QUESTÕES                                                               */
    /* ---------------------------------------------------------------------- */

    case "QUESTIONS": {
      return validSessions.reduce(
        (
          total,
          session
        ) =>
          total +
          Number(
            session.questions_answered ??
            0
          ),
        0
      );
    }

    /* ---------------------------------------------------------------------- */
    /* TÓPICOS                                                                */
    /* ---------------------------------------------------------------------- */

    case "TOPICS": {
      const validSessionIds =
        new Set(
          validSessions.map(
            (
              session
            ) =>
              session.id
          )
        );

      /*
       * Um mesmo tópico pode ter sido
       * estudado em várias sessões.
       *
       * Por isso contamos topic_id distintos.
       */
      const uniqueTopicIds =
        new Set(
          context.topics
            .filter(
              (relation) =>
                validSessionIds.has(
                  relation.session_id
                )
            )
            .map(
              (relation) =>
                relation.topic_id
            )
        );

      return uniqueTopicIds.size;
    }

    default:
      return 0;
  }
}

/* -------------------------------------------------------------------------- */
/*                              CARD MAPPER                                   */
/* -------------------------------------------------------------------------- */

export function mapGoalToCardData(
  goal: GoalDatabaseRow,
  currentValueOverride?: number
): GoalCardData {
  const currentValue =
    Number(
      currentValueOverride ??
      goal.current_value ??
      0
    );

  const targetValue =
    Number(
      goal.target_value ?? 0
    );

  const progress =
    targetValue > 0
      ? Math.min(
          Math.round(
            (
              currentValue /
              targetValue
            ) *
            100
          ),
          100
        )
      : 0;

  const status =
    getGoalStatus(
      goal,
      currentValue
    );

  const type =
    goal.type as GoalType;

  const unit =
    GOAL_TYPE_CONFIG[type]?.unit ??
    "sessões";

  return {
    id:
      goal.id,

    title:
      goal.title,

    type,

    status,

    currentValue,

    targetValue,

    unit,

    progress,

    dueDate:
      goal.due_date,
  };
}

/* -------------------------------------------------------------------------- */
/*                              LOAD GOALS                                    */
/* -------------------------------------------------------------------------- */

export async function getGoalsForSubject(
  subjectId: string
): Promise<GoalCardData[]> {
  /* ------------------------------------------------------------------------ */
  /* BUSCA METAS                                                              */
  /* ------------------------------------------------------------------------ */

  const {
    data: goals,
    error: goalsError,
  } = await supabase
    .from("goals")
    .select(
      `
        id,
        subject_id,
        title,
        type,
        target_value,
        current_value,
        due_date,
        completed,
        created_at
      `
    )
    .eq(
      "subject_id",
      subjectId
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (goalsError) {
    console.error(
      "ERRO AO BUSCAR METAS:",
      goalsError
    );

    throw goalsError;
  }

  if (
    !goals ||
    goals.length === 0
  ) {
    return [];
  }

  /* ------------------------------------------------------------------------ */
  /* BUSCA SESSÕES CONCLUÍDAS DA DISCIPLINA                                  */
  /* ------------------------------------------------------------------------ */

  const {
    data: sessions,
    error: sessionsError,
  } = await supabase
    .from("study_sessions")
    .select(
      `
        id,
        subject_id,
        status,
        duration_seconds,
        questions_answered,
        finished_at
      `
    )
    .eq(
      "subject_id",
      subjectId
    )
    .eq(
      "status",
      "COMPLETED"
    )
    .not(
      "finished_at",
      "is",
      null
    );

  if (sessionsError) {
    console.error(
      "ERRO AO BUSCAR SESSÕES PARA AS METAS:",
      sessionsError
    );

    throw sessionsError;
  }

  const sessionRows =
    (sessions ??
      []) as StudySessionRow[];

  /* ------------------------------------------------------------------------ */
  /* BUSCA RELAÇÕES DE TÓPICOS                                                */
  /* ------------------------------------------------------------------------ */

  let topicRows:
    StudySessionTopicRow[] =
    [];

  if (
    sessionRows.length > 0
  ) {
    const sessionIds =
      sessionRows.map(
        (
          session
        ) =>
          session.id
      );

    const {
      data: topics,
      error: topicsError,
    } = await supabase
      .from("study_session_topics")
      .select(
        `
          session_id,
          topic_id
        `
      )
      .in(
        "session_id",
        sessionIds
      );

    if (topicsError) {
      console.error(
        "ERRO AO BUSCAR TÓPICOS DAS SESSÕES:",
        topicsError
      );

      throw topicsError;
    }

    topicRows =
      (
        topics ??
        []
      ) as StudySessionTopicRow[];
  }

  /* ------------------------------------------------------------------------ */
  /* CALCULA CADA META                                                        */
  /* ------------------------------------------------------------------------ */

  const context:
    GoalProgressContext = {
    sessions:
      sessionRows,

    topics:
      topicRows,
  };

  return (
    goals as GoalDatabaseRow[]
  ).map(
    (goal) => {
      const currentValue =
        calculateGoalCurrentValue(
          goal,
          context
        );

      return mapGoalToCardData(
        goal,
        currentValue
      );
    }
  );
}

/* -------------------------------------------------------------------------- */
/*                              ALIAS                                         */
/* -------------------------------------------------------------------------- */

export function mapGoalsToCardData(
  goals: GoalDatabaseRow[]
): GoalCardData[] {
  return goals.map(
    (goal) => {
      const currentValue =
        Number(
          goal.current_value ??
          0
        );

      return mapGoalToCardData(
        goal,
        currentValue
      );
    }
  );
}