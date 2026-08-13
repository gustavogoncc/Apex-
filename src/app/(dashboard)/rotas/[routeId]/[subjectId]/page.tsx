"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  ContentHeader,
  ContentTabs,
  StudySession,
  ContentPanel,
  NotesPanel,
  GoalsPanel,
  TopicDetailsDialog,
  TopicFormDialog,
  NoteDetailsDialog,
  NoteFormDialog,
  GoalDetailsDialog,
  GoalFormDialog,
  GoalProgressDialog,
  PerformanceDetailsDialog,
} from "@/components/contents";

import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";

import type {
  TopicCardData,
  TopicFormData,
  NoteCardData,
  NoteFormData,
  GoalCardData,
  GoalFormData,
  PerformanceCardData,
  PerformanceDetailsData,
} from "@/components/contents";

import {
  mapGoalsToCardData,
} from "@/components/contents/goals/utils";

interface SubjectPageProps {
  params: Promise<{
    routeId: string;
    subjectId: string;
  }>;
}

interface PerformanceStats {
  totalSolved: number;
  totalCorrect: number;
  overallAccuracy: number;
}

export default function SubjectPage({
  params,
}: SubjectPageProps) {
  const {
    routeId,
    subjectId,
  } = use(params);

  /* -------------------------------------------------------------------------- */
  /* HEADER                                                                     */
  /* -------------------------------------------------------------------------- */

  const [
    routeName,
    setRouteName,
  ] = useState("");

  const [
    subjectName,
    setSubjectName,
  ] = useState("");

  /* -------------------------------------------------------------------------- */
  /* COLLECTIONS                                                                */
  /* -------------------------------------------------------------------------- */

  const [
    topics,
    setTopics,
  ] = useState<TopicCardData[]>([]);

  const [
    notes,
    setNotes,
  ] = useState<NoteCardData[]>([]);

  const [
    goals,
    setGoals,
  ] = useState<GoalCardData[]>([]);

  const [
    performances,
    setPerformances,
  ] = useState<PerformanceCardData[]>([]);

  const [
    questions,
    setQuestions,
  ] = useState<any[]>([]);

  /* -------------------------------------------------------------------------- */
  /* PERFORMANCE                                                                */
  /* -------------------------------------------------------------------------- */

  const [
    stats,
    setStats,
  ] = useState<PerformanceStats>({
    totalSolved: 0,
    totalCorrect: 0,
    overallAccuracy: 0,
  });

  /* -------------------------------------------------------------------------- */
  /* SUBJECT GOALS                                                              */
  /* -------------------------------------------------------------------------- */

  const [
    dailyGoal,
    setDailyGoal,
  ] = useState("");

  const [
    weeklyGoal,
    setWeeklyGoal,
  ] = useState("");

  /* -------------------------------------------------------------------------- */
  /* STUDY TIMER                                                                */
  /* -------------------------------------------------------------------------- */

  const [
    timeLeft,
    setTimeLeft,
  ] = useState(0);

  const [
    isActive,
    setIsActive,
  ] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* TOPICS                                                                     */
  /* -------------------------------------------------------------------------- */

  const [
    selectedTopic,
    setSelectedTopic,
  ] = useState<TopicCardData | null>(null);

  const [
    topicFormOpen,
    setTopicFormOpen,
  ] = useState(false);

  const [
    editingTopic,
    setEditingTopic,
  ] = useState<TopicCardData | null>(null);

  /* -------------------------------------------------------------------------- */
  /* NOTES                                                                      */
  /* -------------------------------------------------------------------------- */

  const [
    selectedNote,
    setSelectedNote,
  ] = useState<NoteCardData | null>(null);

  const [
    noteFormOpen,
    setNoteFormOpen,
  ] = useState(false);

  const [
    editingNote,
    setEditingNote,
  ] = useState<NoteCardData | null>(null);

  /* -------------------------------------------------------------------------- */
  /* GOALS                                                                      */
  /* -------------------------------------------------------------------------- */

  const [
    selectedGoal,
    setSelectedGoal,
  ] = useState<GoalCardData | null>(null);

  const [
    goalFormOpen,
    setGoalFormOpen,
  ] = useState(false);

  const [
    editingGoal,
    setEditingGoal,
  ] = useState<GoalCardData | null>(null);

  const [
    goalProgressOpen,
    setGoalProgressOpen,
  ] = useState(false);

  const [
    goalProgressLoading,
    setGoalProgressLoading,
  ] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* PERFORMANCE DETAILS                                                        */
  /* -------------------------------------------------------------------------- */

  const [
    selectedPerformance,
    setSelectedPerformance,
  ] = useState<PerformanceDetailsData | null>(null);

  function handlePerformanceSelect(
    performance: PerformanceCardData
  ) {
    setSelectedPerformance({
      ...performance,
      description:
        performance.subtitle,
    });
  }

  /* -------------------------------------------------------------------------- */
  /* STUDY TIMER                                                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    let interval:
      | NodeJS.Timeout
      | undefined;

    if (
      isActive &&
      timeLeft > 0
    ) {
      interval = setInterval(() => {
        setTimeLeft(
          (previous) =>
            previous - 1
        );
      }, 1000);
    } else if (
      timeLeft === 0
    ) {
      setIsActive(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    isActive,
    timeLeft,
  ]);

  /* -------------------------------------------------------------------------- */
  /* FETCH SUBJECT                                                              */
  /* -------------------------------------------------------------------------- */

  async function fetchSubject() {
    const {
      data,
      error,
    } = await supabase
      .from("subjects")
      .select("*")
      .eq(
        "id",
        subjectId
      )
      .single();

    if (
      error ||
      !data
    ) {
      console.error(
        "Erro ao carregar disciplina:",
        error
      );

      return;
    }

    setSubjectName(
      data.name
    );

    setDailyGoal(
      data.daily_goal ?? ""
    );

    setWeeklyGoal(
      data.weekly_goal ?? ""
    );

    /*
     * Caso a disciplina possua relação com rota,
     * carregamos o nome da rota separadamente.
     */
    if (data.route_id) {
      const {
        data: routeData,
        error: routeError,
      } = await supabase
        .from("routes")
        .select("name")
        .eq(
          "id",
          data.route_id
        )
        .single();

      if (
        !routeError &&
        routeData
      ) {
        setRouteName(
          routeData.name
        );
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /* FETCH TOPICS                                                               */
  /* -------------------------------------------------------------------------- */

  async function fetchTopics() {
    const {
      data: topicsData,
      error: topicsError,
    } = await supabase
      .from("topics")
      .select("*")
      .eq(
        "subject_id",
        subjectId
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

    if (topicsError) {
      console.error(
        "Erro ao carregar tópicos:",
        topicsError
      );

      return;
    }

    if (
      !topicsData ||
      topicsData.length === 0
    ) {
      setTopics([]);
      return;
    }

    /* ------------------------------------------------------------------------ */
    /* VÍNCULOS ENTRE SESSÕES E TÓPICOS                                         */
    /* ------------------------------------------------------------------------ */

    const {
      data: topicLinks,
      error: topicLinksError,
    } = await supabase
      .from("study_session_topics")
      .select(
        "session_id, topic_id"
      )
      .in(
        "topic_id",
        topicsData.map(
          (topic) => topic.id
        )
      );

    if (topicLinksError) {
      console.error(
        "Erro ao carregar vínculos das sessões:",
        topicLinksError
      );

      return;
    }

    /* ------------------------------------------------------------------------ */
    /* SESSÕES DE ESTUDO                                                        */
    /* ------------------------------------------------------------------------ */

    const sessionIds = [
      ...new Set(
        (
          topicLinks ?? []
        ).map(
          (link) =>
            link.session_id
        )
      ),
    ];

    let sessionsData: any[] = [];

    if (
      sessionIds.length > 0
    ) {
      const {
        data,
        error,
      } = await supabase
        .from("study_sessions")
        .select(
          [
            "id",
            "subject_id",
            "finished_at",
            "duration_seconds",
            "questions_answered",
            "correct_answers",
            "status",
          ].join(", ")
        )
        .in(
          "id",
          sessionIds
        );

      if (error) {
        console.error(
          "Erro ao carregar sessões de estudo:",
          error
        );

        return;
      }

      sessionsData =
        data ?? [];
    }

    /* ------------------------------------------------------------------------ */
    /* ANOTAÇÕES                                                                */
    /* ------------------------------------------------------------------------ */

    const {
      data: notesData,
      error: notesError,
    } = await supabase
      .from("notes")
      .select(
        "id, topic_id"
      )
      .eq(
        "subject_id",
        subjectId
      );

    if (notesError) {
      console.error(
        "Erro ao carregar quantidade de anotações por tópico:",
        notesError
      );

      return;
    }

    /* ------------------------------------------------------------------------ */
    /* MONTA OS DADOS DOS CARDS                                                 */
    /* ------------------------------------------------------------------------ */

    const formattedTopics: TopicCardData[] =
      topicsData.map(
        (topic) => {
          const topicLinksForTopic =
            (
              topicLinks ?? []
            ).filter(
              (link) =>
                link.topic_id ===
                topic.id
            );

          const topicSessionIds =
            topicLinksForTopic.map(
              (link) =>
                link.session_id
            );

          const topicSessions =
            sessionsData.filter(
              (session) =>
                topicSessionIds.includes(
                  session.id
                ) &&
                session.status ===
                  "COMPLETED"
            );

          const totalStudyTimeSeconds =
            topicSessions.reduce(
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

          const questionsAnswered =
            topicSessions.reduce(
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

          const totalCorrect =
            topicSessions.reduce(
              (
                total,
                session
              ) =>
                total +
                Number(
                  session.correct_answers ??
                    0
                ),
              0
            );

          const accuracy =
            questionsAnswered > 0
              ? Math.round(
                  (totalCorrect /
                    questionsAnswered) *
                    100
                )
              : 0;

          const lastSession =
            topicSessions
              .filter(
                (session) =>
                  Boolean(
                    session.finished_at
                  )
              )
              .sort(
                (
                  first,
                  second
                ) =>
                  new Date(
                    second.finished_at
                  ).getTime() -
                  new Date(
                    first.finished_at
                  ).getTime()
              )[0];

          const notesCount =
            (
              notesData ?? []
            ).filter(
              (note) =>
                note.topic_id ===
                topic.id
            ).length;

          return {
            id: topic.id,

            title:
              topic.title,

            subtitle:
              topic.subtitle ??
              undefined,

            description:
              topic.description ??
              undefined,

            status:
              topic.status,

            totalStudyTimeSeconds,

            questionsAnswered,

            accuracy,

            notesCount,

            lastSessionAt:
              lastSession?.finished_at ??
              null,
          };
        }
      );

    setTopics(
      formattedTopics
    );
  }

  /* -------------------------------------------------------------------------- */
  /* FETCH NOTES                                                                */
  /* -------------------------------------------------------------------------- */

  async function fetchNotes() {
    const {
      data: notesData,
      error: notesError,
    } = await supabase
      .from("notes")
      .select(
        "id, subject_id, topic_id, title, description, created_at, updated_at"
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

    if (notesError) {
      console.error(
        "Erro ao carregar anotações:",
        notesError
      );

      setNotes([]);

      return;
    }

    if (
      !notesData ||
      notesData.length === 0
    ) {
      setNotes([]);

      return;
    }

    /* ------------------------------------------------------------------------ */
    /* TÓPICOS DAS ANOTAÇÕES                                                    */
    /* ------------------------------------------------------------------------ */

    const topicIds = [
      ...new Set(
        notesData
          .map(
            (note) =>
              note.topic_id
          )
          .filter(
            (topicId): topicId is string =>
              Boolean(topicId)
          )
      ),
    ];

    let noteTopics: {
      id: string;
      title: string;
    }[] = [];

    if (
      topicIds.length > 0
    ) {
      const {
        data: topicsData,
        error: topicsError,
      } = await supabase
        .from("topics")
        .select("id, title")
        .in(
          "id",
          topicIds
        );

      if (topicsError) {
        console.error(
          "Erro ao carregar tópicos das anotações:",
          topicsError
        );
      } else {
        noteTopics =
          topicsData ?? [];
      }
    }

    /* ------------------------------------------------------------------------ */
    /* MONTA OS DADOS DOS CARDS                                                 */
    /* ------------------------------------------------------------------------ */

    const formattedNotes: NoteCardData[] =
      notesData.map(
        (note) => {
          const topic =
            noteTopics.find(
              (item) =>
                item.id ===
                note.topic_id
            );

          return {
            id: note.id,
            title: note.title,
            content:
              note.description,
            topicId:
              note.topic_id ?? "",
            topicName:
              topic?.title ??
              "Sem tópico",
            createdAt:
              note.created_at,
            updatedAt:
              note.updated_at ??
              note.created_at,
          };
        }
      );

    setNotes(
      formattedNotes
    );
  }

  /* -------------------------------------------------------------------------- */
  /* FETCH GOALS                                                                */
  /* -------------------------------------------------------------------------- */

  async function fetchGoals() {
    const {
      data: goalsData,
      error: goalsError,
    } = await supabase
      .from("goals")
      .select("*")
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
        "Erro ao carregar metas:",
        goalsError
      );

      return;
    }

    if (
      !goalsData ||
      goalsData.length === 0
    ) {
      setGoals([]);
      return;
    }

    /*
     * O progresso das metas agora é manual.
     *
     * Não calculamos mais current_value
     * com base nas sessões de estudo.
     *
     * O valor salvo na tabela "goals" é
     * considerado a fonte oficial do progresso.
     */

    setGoals(
      mapGoalsToCardData(
        goalsData
      )
    );
  }

  /* -------------------------------------------------------------------------- */
  /* FETCH QUESTIONS                                                            */
  /* -------------------------------------------------------------------------- */

  async function fetchQuestions() {
    const {
      data,
      error,
    } = await supabase
      .from("questions")
      .select("*")
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

    if (error) {
      console.error(
        "Erro ao carregar questões:",
        error
      );

      setQuestions([]);

      return [];
    }

    setQuestions(
      data ?? []
    );

    return data ?? [];
  }

  /* -------------------------------------------------------------------------- */
  /* PERFORMANCE                                                                */
  /* -------------------------------------------------------------------------- */

  function calculatePerformance(
    questionsData: any[]
  ) {
    const totalSolved =
      questionsData.reduce(
        (
          total,
          question
        ) =>
          total +
          Number(
            question.total_solved ??
              0
          ),
        0
      );

    const totalCorrect =
      questionsData.reduce(
        (
          total,
          question
        ) =>
          total +
          Number(
            question.total_correct ??
              0
          ),
        0
      );

    setStats({
      totalSolved,

      totalCorrect,

      overallAccuracy:
        totalSolved > 0
          ? Math.round(
              (totalCorrect /
                totalSolved) *
                100
            )
          : 0,
    });
  }

  /* -------------------------------------------------------------------------- */
  /* LOAD PAGE                                                                  */
  /* -------------------------------------------------------------------------- */

  async function loadPage() {
    const [
      ,
      ,
      ,
      ,
      questionsData,
    ] = await Promise.all([
      fetchSubject(),
      fetchTopics(),
      fetchNotes(),
      fetchGoals(),
      fetchQuestions(),
    ]);

    calculatePerformance(
      questionsData
    );
  }

  useEffect(() => {
    loadPage();
  }, [
    subjectId,
  ]);

  /* -------------------------------------------------------------------------- */
  /* TOPICS                                                                     */
  /* -------------------------------------------------------------------------- */

  async function handleCreateTopic(
    values: TopicFormData
  ) {
    const {
      data,
      error,
    } = await supabase
      .from("topics")
      .insert({
        subject_id:
          subjectId,

        title:
          values.title,

        subtitle:
          values.subtitle ||
          null,

        description:
          values.description ||
          null,

        status:
          values.status,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "ERRO AO CRIAR TÓPICO"
      );

      console.error(
        "code:",
        error.code
      );

      console.error(
        "message:",
        error.message
      );

      console.error(
        "details:",
        error.details
      );

      console.error(
        "hint:",
        error.hint
      );

      throw error;
    }

    console.log(
      "Tópico criado com sucesso:",
      data
    );

    await fetchTopics();
  }

  async function handleUpdateTopic(
    values: TopicFormData
  ) {
    if (!editingTopic) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("topics")
      .update({
        title:
          values.title,

        subtitle:
          values.subtitle ||
          null,

        description:
          values.description ||
          null,

        status:
          values.status,
      })
      .eq(
        "id",
        editingTopic.id
      );

    if (error) {
      console.error(
        "Erro ao atualizar tópico:",
        error
      );

      throw error;
    }

    await fetchTopics();

    setEditingTopic(
      null
    );
  }

  async function handleDeleteTopic(
    topic: TopicCardData
  ) {
    const {
      error,
    } = await supabase
      .from("topics")
      .delete()
      .eq(
        "id",
        topic.id
      );

    if (error) {
      console.error(
        "Erro ao excluir tópico:",
        error
      );

      return;
    }

    setSelectedTopic(
      null
    );

    await fetchTopics();
  }

  /* -------------------------------------------------------------------------- */
  /* NOTES                                                                      */
  /* -------------------------------------------------------------------------- */

  async function handleCreateNote(
    values: NoteFormData
  ) {
    const {
      error,
    } = await supabase
      .from("notes")
      .insert({
        subject_id:
          subjectId,

        title:
          values.title,

        description:
          values.content,

        topic_id:
          values.topicId,
      });

    if (error) {
      console.error(
        "Erro ao criar anotação:",
        error
      );

      throw error;
    }

    await fetchNotes();

    await fetchTopics();
  }

  async function handleUpdateNote(
    values: NoteFormData
  ) {
    if (!editingNote) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("notes")
      .update({
        title:
          values.title,

        description:
          values.content,

        topic_id:
          values.topicId,
      })
      .eq(
        "id",
        editingNote.id
      );

    if (error) {
      console.error(
        "Erro ao atualizar anotação:",
        error
      );

      throw error;
    }

    await fetchNotes();

    await fetchTopics();

    setEditingNote(
      null
    );
  }

  async function handleDeleteNote(
    note: NoteCardData
  ) {
    const {
      error,
    } = await supabase
      .from("notes")
      .delete()
      .eq(
        "id",
        note.id
      );

    if (error) {
      console.error(
        "Erro ao excluir anotação:",
        error
      );

      return;
    }

    setSelectedNote(
      null
    );

    await fetchNotes();

    await fetchTopics();
  }

  /* -------------------------------------------------------------------------- */
  /* GOALS                                                                      */
  /* -------------------------------------------------------------------------- */

  async function handleCreateGoal(
    values: GoalFormData
  ) {
    const {
      error,
    } = await supabase
      .from("goals")
      .insert({
        subject_id:
          subjectId,

        title:
          values.title,

        type:
          values.type,

        target_value:
          values.targetValue,

        due_date:
          values.dueDate,

        current_value:
          0,

        completed:
          false,

        completed_at:
          null,
      });

    if (error) {
      console.error(
        "Erro ao criar meta:",
        error
      );

      throw error;
    }

    await fetchGoals();
  }

  async function handleUpdateGoal(
    values: GoalFormData
  ) {
    if (!editingGoal) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("goals")
      .update({
        title:
          values.title,

        type:
          values.type,

        target_value:
          values.targetValue,

        due_date:
          values.dueDate,
      })
      .eq(
        "id",
        editingGoal.id
      );

    if (error) {
      console.error(
        "Erro ao atualizar meta:",
        error
      );

      throw error;
    }

    await fetchGoals();

    setEditingGoal(
      null
    );
  }

  /* -------------------------------------------------------------------------- */
  /* UPDATE GOAL PROGRESS                                                       */
  /* -------------------------------------------------------------------------- */

  async function handleUpdateGoalProgress(
    currentValue: number
  ) {
    if (!selectedGoal) {
      return;
    }

    setGoalProgressLoading(
      true
    );

    try {
      const targetValue =
        Number(
          selectedGoal.targetValue
        );

      /*
       * Mantemos o valor entre 0 e o objetivo.
       * Assim evitamos situações como:
       * "25 de 20 horas".
       */
      const normalizedValue =
        Math.min(
          Math.max(
            Number(currentValue) || 0,
            0
          ),
          targetValue
        );

      const completed =
        targetValue > 0 &&
        normalizedValue >=
          targetValue;

      const {
        error,
      } = await supabase
        .from("goals")
        .update({
          current_value:
            normalizedValue,

          completed,

          completed_at:
            completed
              ? new Date().toISOString()
              : null,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          selectedGoal.id
        );

      if (error) {
        console.error(
          "Erro ao atualizar progresso da meta:",
          error
        );

        throw error;
      }

      /*
       * Recarrega as metas para que:
       * - percentual seja atualizado;
       * - status seja atualizado;
       * - card seja atualizado.
       */
      await fetchGoals();

      /*
       * Atualiza também a referência local
       * da meta selecionada.
       */
      setSelectedGoal(
        (current) =>
          current
            ? {
                ...current,

                currentValue:
                  normalizedValue,

                progress:
                  targetValue > 0
                    ? Math.min(
                        Math.round(
                          (normalizedValue /
                            targetValue) *
                            100
                        ),
                        100
                      )
                    : 0,

                status:
                  completed
                    ? "COMPLETED"
                    : normalizedValue >
                        0
                      ? "IN_PROGRESS"
                      : "NOT_STARTED",
              }
            : null
      );
    } finally {
      setGoalProgressLoading(
        false
      );
    }
  }

  async function handleDeleteGoal(
    goal: GoalCardData
  ) {
    const {
      error,
    } = await supabase
      .from("goals")
      .delete()
      .eq(
        "id",
        goal.id
      );

    if (error) {
      console.error(
        "Erro ao excluir meta:",
        error
      );

      return;
    }

    setSelectedGoal(
      null
    );

    await fetchGoals();
  }

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-8">

      {/* ---------------------------------------------------------------------- */}
      {/* HEADER                                                                 */}
      {/* ---------------------------------------------------------------------- */}

      <ContentHeader
        routeId={routeId}
        routeName={routeName}
        subjectName={
          subjectName
        }
        totalTopics={
          topics.length
        }
        performance={
          stats.overallAccuracy
        }
      />

      {/* ---------------------------------------------------------------------- */}
      {/* STUDY SESSION                                                           */}
      {/* ---------------------------------------------------------------------- */}

      <StudySession
        routeId={routeId}
        subjectId={
          subjectId
        }
        subjectName={
          subjectName
        }
        onSessionSaved={
          async () => {
            /*
             * Sessões continuam atualizando
             * os dados dos tópicos.
             *
             * Metas não são mais alteradas
             * automaticamente pelas sessões.
             */
            await fetchTopics();
          }
        }
      />

      {/* ---------------------------------------------------------------------- */}
      {/* CONTENT TABS                                                            */}
      {/* ---------------------------------------------------------------------- */}

      <Tabs
        defaultValue="content"
        className="space-y-6"
      >

        <ContentTabs />

        {/* -------------------------------------------------------------------- */}
        {/* CONTENT                                                               */}
        {/* -------------------------------------------------------------------- */}

        <TabsContent
          value="content"
          className="mt-0"
        >
          <ContentPanel
            topics={topics}
            onCreate={() => {
              setEditingTopic(
                null
              );

              setTopicFormOpen(
                true
              );
            }}
            onSelect={(topic) => {
              setSelectedTopic(
                topic
              );
            }}
          />
        </TabsContent>

        {/* -------------------------------------------------------------------- */}
        {/* GOALS                                                                 */}
        {/* -------------------------------------------------------------------- */}

        <TabsContent
          value="goals"
          className="mt-0"
        >
          <GoalsPanel
            goals={goals}
            onCreate={() => {
              setEditingGoal(
                null
              );

              setGoalFormOpen(
                true
              );
            }}
            onSelect={(goal) => {
              setSelectedGoal(
                goal
              );
            }}
            onUpdateProgress={(goal) => {
              setSelectedGoal(
                goal
              );

              setGoalProgressOpen(
                true
              );
            }}
          />
        </TabsContent>

        {/* -------------------------------------------------------------------- */}
        {/* NOTES                                                                 */}
        {/* -------------------------------------------------------------------- */}

        <TabsContent
          value="notes"
          className="mt-0"
        >
          <NotesPanel
            notes={notes}
            onCreate={() => {
              setEditingNote(
                null
              );

              setNoteFormOpen(
                true
              );
            }}
            onSelect={(note) => {
              setSelectedNote(
                note
              );
            }}
          />
        </TabsContent>

      </Tabs>

      {/* ---------------------------------------------------------------------- */}
      {/* TOPIC DETAILS                                                           */}
      {/* ---------------------------------------------------------------------- */}

      <TopicDetailsDialog
        open={
          selectedTopic !==
          null
        }
        topic={
          selectedTopic
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setSelectedTopic(
              null
            );
          }
        }}
        onEdit={(topic) => {
          setSelectedTopic(
            null
          );

          setEditingTopic(
            topic
          );

          setTopicFormOpen(
            true
          );
        }}
        onDelete={
          handleDeleteTopic
        }
      />

      {/* ---------------------------------------------------------------------- */}
      {/* TOPIC FORM                                                              */}
      {/* ---------------------------------------------------------------------- */}

      <TopicFormDialog
        mode={
          editingTopic
            ? "edit"
            : "create"
        }
        open={
          topicFormOpen
        }
        topic={
          editingTopic
        }
        onOpenChange={(
          open
        ) => {
          setTopicFormOpen(
            open
          );

          if (!open) {
            setEditingTopic(
              null
            );
          }
        }}
        onSubmit={async (
          values
        ) => {
          if (editingTopic) {
            await handleUpdateTopic(
              values
            );
          } else {
            await handleCreateTopic(
              values
            );
          }
        }}
      />

      {/* ---------------------------------------------------------------------- */}
      {/* NOTE DETAILS                                                            */}
      {/* ---------------------------------------------------------------------- */}

      <NoteDetailsDialog
        open={
          selectedNote !==
          null
        }
        note={
          selectedNote
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setSelectedNote(
              null
            );
          }
        }}
        onEdit={(note) => {
          setSelectedNote(
            null
          );

          setEditingNote(
            note
          );

          setNoteFormOpen(
            true
          );
        }}
        onDelete={
          handleDeleteNote
        }
      />

      {/* ---------------------------------------------------------------------- */}
      {/* NOTE FORM                                                               */}
      {/* ---------------------------------------------------------------------- */}

      <NoteFormDialog
        mode={
          editingNote
            ? "edit"
            : "create"
        }
        open={
          noteFormOpen
        }
        note={
          editingNote
        }
        topics={topics.map(
          (topic) => ({
            id: topic.id,
            title:
              topic.title,
          })
        )}
        onOpenChange={(
          open
        ) => {
          setNoteFormOpen(
            open
          );

          if (!open) {
            setEditingNote(
              null
            );
          }
        }}
        onSubmit={async (
          values
        ) => {
          if (editingNote) {
            await handleUpdateNote(
              values
            );
          } else {
            await handleCreateNote(
              values
            );
          }
        }}
      />

      {/* ---------------------------------------------------------------------- */}
      {/* GOAL DETAILS                                                            */}
      {/* ---------------------------------------------------------------------- */}

      <GoalDetailsDialog
        open={
          selectedGoal !==
          null
        }
        goal={
          selectedGoal
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setSelectedGoal(
              null
            );
          }
        }}
        onEdit={(goal) => {
          setSelectedGoal(
            null
          );

          setEditingGoal(
            goal
          );

          setGoalFormOpen(
            true
          );
        }}
        onDelete={
          handleDeleteGoal
        }
      />

      {/* ---------------------------------------------------------------------- */}
      {/* GOAL FORM                                                               */}
      {/* ---------------------------------------------------------------------- */}

      <GoalFormDialog
        open={
          goalFormOpen
        }
        initialData={
          editingGoal
        }
        onOpenChange={(
          open
        ) => {
          setGoalFormOpen(
            open
          );

          if (!open) {
            setEditingGoal(
              null
            );
          }
        }}
        onSubmit={async (
          values
        ) => {
          if (editingGoal) {
            await handleUpdateGoal(
              values
            );
          } else {
            await handleCreateGoal(
              values
            );
          }
        }}
      />

      {/* ---------------------------------------------------------------------- */}
      {/* GOAL PROGRESS                                                           */}
      {/* ---------------------------------------------------------------------- */}

      <GoalProgressDialog
        open={
          goalProgressOpen
        }
        goal={
          selectedGoal
        }
        onOpenChange={(
          open
        ) => {
          setGoalProgressOpen(
            open
          );

          if (!open) {
            /*
             * Não limpamos selectedGoal aqui,
             * porque ele ainda pode ser utilizado
             * pelo GoalDetailsDialog.
             */
          }
        }}
        onSave={
          handleUpdateGoalProgress
        }
        isLoading={
          goalProgressLoading
        }
      />

      {/* ---------------------------------------------------------------------- */}
      {/* PERFORMANCE DETAILS                                                    */}
      {/* ---------------------------------------------------------------------- */}

      <PerformanceDetailsDialog
        open={
          selectedPerformance !==
          null
        }
        performance={
          selectedPerformance
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setSelectedPerformance(
              null
            );
          }
        }}
      />

    </div>
  );
}