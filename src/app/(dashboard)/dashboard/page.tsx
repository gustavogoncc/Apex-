"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Award,
  BookOpen,
  Compass,
  Target,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import {
  DashboardHeader,
  DashboardSection,
  MetricCard,
  StatsGrid,
  ChartCard,
  PerformanceSummary,
  EmptyDashboard,
} from "@/components/dashboard";

type ChartPoint = {
  date: string;
  acertos: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [totalRoutes, setTotalRoutes] = useState(0);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [completionPercentage, setCompletionPercentage] =
    useState(0);

  const [globalQuestions, setGlobalQuestions] =
    useState(0);

  const [globalCorrect, setGlobalCorrect] =
    useState(0);

  const [globalRate, setGlobalRate] =
    useState(0);

  const [chartData, setChartData] = useState<
    ChartPoint[]
  >([]);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, []);

  const dashboardEmpty =
    totalRoutes === 0 &&
    totalSubjects === 0 &&
    globalQuestions === 0;

      useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const { count: routesCount } = await supabase
          .from("study_routes")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id);

        setTotalRoutes(routesCount ?? 0);

        const { data: userRoutes } = await supabase
          .from("study_routes")
          .select("id")
          .eq("user_id", user.id);

        if (userRoutes?.length) {
          const routeIds = userRoutes.map((route) => route.id);

          const { count: subjectsCount } = await supabase
            .from("subjects")
            .select("*", {
              count: "exact",
              head: true,
            })
            .in("route_id", routeIds);

          setTotalSubjects(subjectsCount ?? 0);

          const { data: subjects } = await supabase
            .from("subjects")
            .select("id")
            .in("route_id", routeIds);

          if (subjects?.length) {
            const subjectIds = subjects.map((subject) => subject.id);

            const { data: topics } = await supabase
              .from("topics")
              .select("completed")
              .in("subject_id", subjectIds);

            if (topics?.length) {
              const completed = topics.filter(
                (topic) => topic.completed
              ).length;

              setCompletionPercentage(
                Math.round((completed / topics.length) * 100)
              );
            }
          }
        }

        const { data: logs } = await supabase
          .from("question_logs")
          .select(
            "total_questions, correct_answers, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at");

        if (logs?.length) {
          const totalQuestions = logs.reduce(
            (acc, item) => acc + item.total_questions,
            0
          );

          const totalCorrect = logs.reduce(
            (acc, item) => acc + item.correct_answers,
            0
          );

          setGlobalQuestions(totalQuestions);
          setGlobalCorrect(totalCorrect);

          setGlobalRate(
            totalQuestions > 0
              ? Math.round(
                  (totalCorrect / totalQuestions) * 100
                )
              : 0
          );

          setChartData(
            logs.map((item) => ({
              date: new Date(item.created_at).toLocaleDateString(
                "pt-BR",
                {
                  day: "2-digit",
                  month: "2-digit",
                }
              ),
              acertos:
                Math.round(
                  (item.correct_answers /
                    item.total_questions) *
                    100
                ) || 0,
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return null;
  }

  if (dashboardEmpty) {
    return (
      <EmptyDashboard
  onCreateRoute={() =>
    router.push("/rotas")
  }
/>
    );
  }

  return (
    <div className="space-y-12 pb-10">

      <DashboardHeader
        title="Dashboard"
        description="Organize seus estudos e acompanhe sua evolução."
      />

      <DashboardSection
        title="Visão Geral"
        description="Acompanhe rapidamente seus principais indicadores."
      >
        <StatsGrid>

          <MetricCard
            title="Rotas"
            value={totalRoutes}
            description="Rotas cadastradas"
            icon={Compass}
          />

          <MetricCard
            title="Conteúdos"
            value={totalSubjects}
            description="Conteúdos disponíveis"
            icon={BookOpen}
          />

          <MetricCard
            title="Questões"
            value={globalQuestions}
            description="Questões respondidas"
            icon={Target}
          />

          <MetricCard
            title="Aproveitamento"
            value={`${globalRate}%`}
            description="Média geral de acertos"
            icon={Award}
            accent="success"
          />

        </StatsGrid>
      </DashboardSection>

      <DashboardSection
        title="Evolução"
        description="Veja como seu desempenho evoluiu ao longo do tempo."
      >
        <div className="grid gap-6 xl:grid-cols-[2fr_360px]">

          <ChartCard
            title="Desempenho"
            description="Aproveitamento nas resoluções"
            data={chartData}
            dataKey="acertos"
            xAxisKey="date"
          />

          <PerformanceSummary
            items={[
              {
                label: "Aproveitamento",
                value: `${globalRate}%`,
                icon: Award,
                accent: "success",
              },
              {
                label: "Questões",
                value: globalQuestions,
                icon: Target,
              },
              {
                label: "Conteúdos",
                value: totalSubjects,
                icon: BookOpen,
              },
              {
                label: "Rotas",
                value: totalRoutes,
                icon: Compass,
              },
            ]}
          />

        </div>
      </DashboardSection>

    </div>
  );
}