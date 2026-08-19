"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  BookOpen,
  Clock3,
  Route,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { getAdminStats } from "@/actions/admin/getAdminStats";
import { getAdminActivity } from "@/actions/admin/getAdminActivity";

import { supabase } from "@/lib/supabase";

interface AdminStat {
  label: string;
  value: number | null;
  description: string;
  icon: React.ElementType;
}

interface AdminActivity {
  date: string;
  count: number;
}

export default function AdminPage() {
  const [totalUsers, setTotalUsers] =
    useState<number | null>(null);

  const [activeUsers, setActiveUsers] =
    useState<number | null>(null);

  const [newUsers, setNewUsers] =
    useState<number | null>(null);

  const [totalRoutes, setTotalRoutes] =
    useState<number | null>(null);

  const [totalSessions, setTotalSessions] =
    useState<number | null>(null);

  const [totalSubjects, setTotalSubjects] =
    useState<number | null>(null);

  const [activity, setActivity] =
    useState<AdminActivity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [activityLoading, setActivityLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [activityError, setActivityError] =
    useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /* LOAD ADMIN DATA                                                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        setActivityLoading(true);

        setError(null);
        setActivityError(null);

        /* -------------------------------------------------------------------- */
        /* GET CURRENT SESSION                                                  */
        /* -------------------------------------------------------------------- */

        const {
          data: {
            session,
          },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (
          sessionError ||
          !session
        ) {
          throw new Error(
            "Sessão não encontrada."
          );
        }

        /* -------------------------------------------------------------------- */
        /* GET ADMIN STATS                                                      */
        /* -------------------------------------------------------------------- */

        const stats =
          await getAdminStats(
            session.access_token
          );

        setTotalUsers(
          stats.totalUsers
        );

        setActiveUsers(
          stats.activeUsers
        );

        setNewUsers(
          stats.newUsers
        );

        setTotalRoutes(
          stats.totalRoutes
        );

        setTotalSessions(
          stats.totalSessions
        );

        setTotalSubjects(
          stats.totalSubjects
        );

        setLoading(false);

        /* -------------------------------------------------------------------- */
        /* GET ADMIN ACTIVITY                                                   */
        /* -------------------------------------------------------------------- */

        try {
          const activityData =
            await getAdminActivity(
              session.access_token
            );

          setActivity(
            activityData
          );
        } catch (error) {
          console.error(
            "Erro ao carregar atividade administrativa:",
            error
          );

          setActivityError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar a atividade da plataforma."
          );
        } finally {
          setActivityLoading(false);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar estatísticas administrativas:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os indicadores."
        );

        setLoading(false);
        setActivityLoading(false);
      }
    }

    loadAdminData();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* ACTIVITY CHART DATA                                                       */
  /* -------------------------------------------------------------------------- */

  const chartData = useMemo(() => {
    if (!activity.length) {
      return {
        maxValue: 0,
        points: "",
      };
    }

    const maxValue =
      Math.max(
        ...activity.map(
          (item) => item.count
        ),
        1
      );

    const width = 1000;
    const height = 280;

    const horizontalPadding = 20;
    const verticalPadding = 25;

    const chartWidth =
      width -
      horizontalPadding * 2;

    const chartHeight =
      height -
      verticalPadding * 2;

    const points =
      activity
        .map((item, index) => {
          const x =
            activity.length === 1
              ? width / 2
              : horizontalPadding +
                (index /
                  (activity.length - 1)) *
                  chartWidth;

          const y =
            height -
            verticalPadding -
            (item.count /
              maxValue) *
              chartHeight;

          return `${x},${y}`;
        })
        .join(" ");

    return {
      maxValue,
      points,
    };
  }, [activity]);

  /* -------------------------------------------------------------------------- */
  /* STAT CARDS                                                                 */
  /* -------------------------------------------------------------------------- */

  const stats: AdminStat[] = [
    {
      label: "Usuários cadastrados",
      value: totalUsers,
      description:
        "Total de contas criadas no APEX.",
      icon: Users,
    },

    {
      label: "Usuários ativos",
      value: activeUsers,
      description:
        "Contas com atividade nos últimos 30 dias.",
      icon: Activity,
    },

    {
      label: "Novos cadastros",
      value: newUsers,
      description:
        "Contas criadas nos últimos 30 dias.",
      icon: Users,
    },

    {
      label: "Rotas de estudo",
      value: totalRoutes,
      description:
        "Rotas criadas pelos usuários.",
      icon: Route,
    },

    {
      label: "Sessões realizadas",
      value: totalSessions,
      description:
        "Sessões de estudo registradas.",
      icon: Clock3,
    },

    {
      label: "Disciplinas",
      value: totalSubjects,
      description:
        "Disciplinas cadastradas na plataforma.",
      icon: BookOpen,
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* DATE FORMATTER                                                             */
  /* -------------------------------------------------------------------------- */

  function formatChartDate(
    date: string
  ) {
    const [year, month, day] =
      date.split("-").map(Number);

    const formattedDate =
      new Date(
        year,
        month - 1,
        day
      );

    return formattedDate.toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
      }
    );
  }

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-10 px-6 pb-10 sm:px-8 lg:px-10 xl:px-12">

      {/* -------------------------------------------------------------------- */}
      {/* HEADER                                                               */}
      {/* -------------------------------------------------------------------- */}

      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-start gap-4">

          <div
            className="
              flex
              size-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-primary
            "
          >
            <ShieldCheck className="size-7" />
          </div>

          <div>

            <p className="text-sm font-medium text-primary">
              Administração
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Visão geral
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Acompanhe os principais indicadores e a utilização
              da plataforma APEX.
            </p>

          </div>

        </div>

        <Card className="w-fit">

          <CardContent className="flex items-center gap-3 px-5 py-3">

            <span className="size-2 rounded-full bg-emerald-500" />

            <div>

              <p className="text-xs text-muted-foreground">
                Status da plataforma
              </p>

              <p className="text-sm font-semibold">
                Operacional
              </p>

            </div>

          </CardContent>

        </Card>

      </header>

      {/* -------------------------------------------------------------------- */}
      {/* INDICADORES                                                          */}
      {/* -------------------------------------------------------------------- */}

      <section className="space-y-5">

        <div>

          <h2 className="text-lg font-semibold tracking-tight">
            Indicadores
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Visão rápida dos principais números do APEX.
          </p>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {stats.map((stat) => {

            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:border-primary/30
                  hover:shadow-lg
                "
              >

                <CardContent className="p-6">

                  <div className="flex items-start justify-between">

                    <div
                      className="
                        flex
                        size-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-primary/10
                        text-primary
                      "
                    >
                      <Icon className="size-5" />
                    </div>

                  </div>

                  <div className="mt-6">

                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-4xl font-bold tracking-tight">
                      {loading
                        ? "..."
                        : stat.value ?? "—"}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {stat.description}
                    </p>

                  </div>

                </CardContent>

              </Card>
            );
          })}

        </div>

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

      </section>

      {/* -------------------------------------------------------------------- */}
      {/* ATIVIDADE                                                            */}
      {/* -------------------------------------------------------------------- */}

      <section className="space-y-5">

        <div>

          <h2 className="text-lg font-semibold tracking-tight">
            Atividade da plataforma
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe a evolução dos cadastros no APEX.
          </p>

        </div>

        <Card>

          <CardContent className="p-6">

            {/* -------------------------------------------------------------- */}
            {/* ACTIVITY HEADER                                                */}
            {/* -------------------------------------------------------------- */}

            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <h3 className="font-semibold">
                  Novos cadastros
                </h3>

                <p className="text-sm text-muted-foreground">
                  Contas criadas nos últimos 30 dias.
                </p>

              </div>

              {!activityLoading &&
                activity.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Total no período:{" "}
                    <span className="font-semibold text-foreground">
                      {activity.reduce(
                        (total, item) =>
                          total + item.count,
                        0
                      )}
                    </span>
                  </div>
                )}

            </div>

            {/* -------------------------------------------------------------- */}
            {/* CHART                                                          */}
            {/* -------------------------------------------------------------- */}

            <div className="mt-8">

              {activityLoading ? (

                <div className="flex h-72 items-center justify-center">

                  <div className="text-center">

                    <Activity className="mx-auto size-6 animate-pulse text-primary" />

                    <p className="mt-3 text-sm text-muted-foreground">
                      Carregando atividade...
                    </p>

                  </div>

                </div>

              ) : activityError ? (

                <div className="flex h-72 items-center justify-center">

                  <div className="max-w-md text-center">

                    <div
                      className="
                        mx-auto
                        flex
                        size-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-destructive/10
                        text-destructive
                      "
                    >
                      <Activity className="size-5" />
                    </div>

                    <h3 className="mt-4 font-semibold">
                      Não foi possível carregar a atividade
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {activityError}
                    </p>

                  </div>

                </div>

              ) : activity.length === 0 ? (

                <div className="flex h-72 items-center justify-center">

                  <div className="max-w-md text-center">

                    <div
                      className="
                        mx-auto
                        flex
                        size-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-muted
                        text-muted-foreground
                      "
                    >
                      <Activity className="size-5" />
                    </div>

                    <h3 className="mt-4 font-semibold">
                      Nenhuma atividade encontrada
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Ainda não existem cadastros no período
                      analisado.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="w-full">

                  <div className="relative h-72 w-full">

                    {/* ------------------------------------------------------ */}
                    {/* Y AXIS GRID                                            */}
                    {/* ------------------------------------------------------ */}

                    <div className="absolute inset-0 flex flex-col justify-between">

                      {Array.from(
                        {
                          length:
                            Math.min(
                              chartData.maxValue,
                              5
                            ) + 1,
                        },
                        (_, index) => {
                          const steps =
                            Math.min(
                              chartData.maxValue,
                              5
                            );

                          const value =
                            chartData.maxValue -
                            Math.round(
                              (chartData.maxValue /
                                steps) *
                                index
                            );

                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >

                              <span className="w-5 text-right text-[11px] text-muted-foreground">
                                {value}
                              </span>

                              <div className="h-px flex-1 bg-border/60" />

                            </div>
                          );
                        }
                      )}

                    </div>

                    {/* ------------------------------------------------------ */}
                    {/* SVG CHART                                               */}
                    {/* ------------------------------------------------------ */}

                    <svg
                      viewBox="0 0 1000 280"
                      preserveAspectRatio="none"
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        overflow-visible
                        pl-8
                      "
                    >

                      <defs>

                        <linearGradient
                          id="activityGradient"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >

                          <stop
                            offset="0%"
                            stopColor="currentColor"
                            stopOpacity="0.18"
                          />

                          <stop
                            offset="100%"
                            stopColor="currentColor"
                            stopOpacity="0"
                          />

                        </linearGradient>

                      </defs>

                      {/* ---------------------------------------------------- */}
                      {/* AREA                                                   */}
                      {/* ---------------------------------------------------- */}

                      {activity.length > 1 && (
                        <polygon
                          points={`
                            20,255
                            ${chartData.points}
                            980,255
                          `}
                          fill="url(#activityGradient)"
                          className="text-primary"
                        />
                      )}

                      {/* ---------------------------------------------------- */}
                      {/* LINE                                                   */}
                      {/* ---------------------------------------------------- */}

                      {activity.length > 1 && (
                        <polyline
                          points={
                            chartData.points
                          }
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        />
                      )}

                      {/* ---------------------------------------------------- */}
                      {/* POINTS                                                 */}
                      {/* ---------------------------------------------------- */}

                      {activity.map(
                        (
                          item,
                          index
                        ) => {

                          const width = 1000;
                          const height = 280;

                          const horizontalPadding = 20;
                          const verticalPadding = 25;

                          const chartWidth =
                            width -
                            horizontalPadding *
                              2;

                          const chartHeight =
                            height -
                            verticalPadding *
                              2;

                          const x =
                            activity.length ===
                            1
                              ? width / 2
                              : horizontalPadding +
                                (index /
                                  (activity.length -
                                    1)) *
                                  chartWidth;

                          const y =
                            height -
                            verticalPadding -
                            (item.count /
                              chartData.maxValue) *
                              chartHeight;

                          return (
                            <circle
                              key={item.date}
                              cx={x}
                              cy={y}
                              r="4"
                              fill="currentColor"
                              className="text-primary"
                            />
                          );
                        }
                      )}

                    </svg>

                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* X AXIS                                                    */}
                  {/* -------------------------------------------------------- */}

                  <div className="ml-8 mt-3 flex justify-between">

                    {activity.map(
                      (item, index) => {

                        const shouldShow =
                          index === 0 ||
                          index ===
                            activity.length -
                              1 ||
                          index % 5 === 0;

                        if (!shouldShow) {
                          return (
                            <span
                              key={item.date}
                              className="w-0 overflow-hidden text-[11px]"
                            />
                          );
                        }

                        return (
                          <span
                            key={item.date}
                            className="text-[11px] text-muted-foreground"
                          >
                            {formatChartDate(
                              item.date
                            )}
                          </span>
                        );
                      }
                    )}

                  </div>

                </div>

              )}

            </div>

          </CardContent>

        </Card>

      </section>

    </main>
  );
}