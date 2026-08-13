"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Badge,
} from "@/components/ui/badge";

import {
  CreateAgendaForm,
} from "@/components/agenda/CreateAgendaForm";

import {
  EditAgendaForm,
} from "@/components/agenda/EditAgendaForm";

import { supabase } from "@/lib/supabase";

import { cn } from "@/lib/utils";

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

/* -------------------------------------------------------------------------- */
/* DATE HELPERS                                                               */
/* -------------------------------------------------------------------------- */

function formatDate(
  value: string
): string {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(new Date(value));
}

function formatShortDate(
  value: string
): string {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "short",
    }
  )
    .format(new Date(value))
    .replace(".", "");
}

function formatTime(
  value: string
): string {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

function isToday(
  value: string
): boolean {
  const date =
    new Date(value);

  const today =
    new Date();

  return (
    date.getDate() ===
      today.getDate() &&
    date.getMonth() ===
      today.getMonth() &&
    date.getFullYear() ===
      today.getFullYear()
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function AgendaPage() {
  const [
    events,
    setEvents,
  ] = useState<AgendaItem[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    isCreateOpen,
    setIsCreateOpen,
  ] = useState(false);

  const [
    detailEvent,
    setDetailEvent,
  ] = useState<AgendaItem | null>(
    null
  );

  const [
    editEvent,
    setEditEvent,
  ] = useState<AgendaItem | null>(
    null
  );

  /* ------------------------------------------------------------------------ */
  /* FETCH EVENTS                                                             */
  /* ------------------------------------------------------------------------ */

  async function fetchEvents(
    showRefresh = false
  ) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const {
        data: {
          user,
        },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        console.error(
          "Erro ao identificar usuário:",
          userError
        );

        setEvents([]);

        return;
      }

      const {
        data,
        error,
      } =
        await supabase
          .from("agenda")
          .select(
            `
              id,
              title,
              description,
              start_time,
              end_time,
              completed
            `
          )
          .eq(
            "user_id",
            user.id
          )
          .order(
            "start_time",
            {
              ascending: true,
            }
          );

      if (error) {
        throw error;
      }

      setEvents(
        data ?? []
      );
    } catch (error) {
      console.error(
        "Erro ao carregar agenda:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* INITIAL LOAD                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ------------------------------------------------------------------------ */
  /* TOGGLE COMPLETE                                                          */
  /* ------------------------------------------------------------------------ */

  async function toggleComplete(
    id: string,
    currentStatus: boolean
  ) {
    const newStatus =
      !currentStatus;

    const {
      error,
    } =
      await supabase
        .from("agenda")
        .update({
          completed: newStatus,
        })
        .eq(
          "id",
          id
        );

    if (error) {
      console.error(
        "Erro ao atualizar status:",
        error
      );

      return;
    }

    setEvents(
      (current) =>
        current.map(
          (event) =>
            event.id === id
              ? {
                  ...event,
                  completed:
                    newStatus,
                }
              : event
        )
    );
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleDelete(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Deseja realmente excluir este compromisso?"
      );

    if (!confirmed) {
      return;
    }

    const {
      error,
    } =
      await supabase
        .from("agenda")
        .delete()
        .eq(
          "id",
          id
        );

    if (error) {
      console.error(
        "Erro ao deletar compromisso:",
        error
      );

      return;
    }

    setEvents(
      (current) =>
        current.filter(
          (event) =>
            event.id !== id
        )
    );

    if (
      detailEvent?.id === id
    ) {
      setDetailEvent(null);
    }

    if (
      editEvent?.id === id
    ) {
      setEditEvent(null);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* DERIVED DATA                                                             */
  /* ------------------------------------------------------------------------ */

  const pendingEvents =
    useMemo(
      () =>
        events.filter(
          (event) =>
            !event.completed
        ),
      [events]
    );

  const completedEvents =
    useMemo(
      () =>
        events.filter(
          (event) =>
            event.completed
        ),
      [events]
    );

  const todayEvents =
    useMemo(
      () =>
        events.filter(
          (event) =>
            isToday(
              event.start_time
            )
        ),
      [events]
    );

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-10 pb-10">

      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-5">

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
            <CalendarDays className="size-7" />
          </div>

          <div>

            <h1
              className="
                heading
                text-4xl
                font-bold
                tracking-tight
              "
            >
              Agenda
            </h1>

            <p className="mt-2 text-muted-foreground">
              Organize seus compromissos e mantenha sua rotina de estudos em dia.
            </p>

          </div>

        </div>

        <Dialog
          open={isCreateOpen}
          onOpenChange={
            setIsCreateOpen
          }
        >

          <DialogTrigger
            render={
              <Button
                size="lg"
              >
                <Plus className="size-5" />

                Novo compromisso
              </Button>
            }
          />

          <DialogContent className="sm:max-w-lg">

            <DialogHeader>

              <DialogTitle>
                Novo compromisso
              </DialogTitle>

              <DialogDescription>
                Adicione um novo compromisso à sua agenda.
              </DialogDescription>

            </DialogHeader>

            <CreateAgendaForm
              onSuccess={() => {
                setIsCreateOpen(
                  false
                );

                fetchEvents();
              }}
            />

          </DialogContent>

        </Dialog>

      </header>

      {/* ------------------------------------------------------------------ */}
      {/* SUMMARY                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center gap-4">

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
                <CalendarDays className="size-5" />
              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Compromissos
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {events.length}
                </p>

              </div>

            </div>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-amber-500/10
                  text-amber-600
                "
              >
                <Clock3 className="size-5" />
              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Pendentes
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {pendingEvents.length}
                </p>

              </div>

            </div>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-500/10
                  text-emerald-600
                "
              >
                <CheckCircle2 className="size-5" />
              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Concluídos
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {completedEvents.length}
                </p>

              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* AGENDA                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="space-y-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <h2 className="text-xl font-semibold tracking-tight">
              Seus compromissos
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Acompanhe sua rotina e mantenha seus estudos organizados.
            </p>

          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              fetchEvents(true)
            }
            disabled={
              loading ||
              refreshing
            }
            title="Atualizar agenda"
          >
            {refreshing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
          </Button>

        </div>

        {/* ---------------------------------------------------------------- */}
        {/* LOADING                                                          */}
        {/* ---------------------------------------------------------------- */}

        {loading ? (

          <div className="space-y-4">

            {Array.from({
              length: 3,
            }).map(
              (_, index) => (
                <Card
                  key={index}
                >
                  <CardContent className="p-6">

                    <div className="animate-pulse space-y-4">

                      <div className="h-5 w-2/5 rounded bg-muted" />

                      <div className="h-4 w-3/5 rounded bg-muted" />

                      <div className="h-4 w-1/3 rounded bg-muted" />

                    </div>

                  </CardContent>
                </Card>
              )
            )}

          </div>

        ) : events.length === 0 ? (

          /* -------------------------------------------------------------- */
          /* EMPTY                                                           */
          /* -------------------------------------------------------------- */

          <Card className="border-dashed">

            <CardContent
              className="
                flex
                flex-col
                items-center
                justify-center
                px-6
                py-16
                text-center
              "
            >

              <div
                className="
                  flex
                  size-16
                  items-center
                  justify-center
                  rounded-full
                  bg-primary/10
                  text-primary
                "
              >
                <CalendarDays className="size-8" />
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                Sua agenda está vazia
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Adicione compromissos, sessões de estudo ou outras atividades para organizar melhor sua rotina.
              </p>

              <Button
                className="mt-6"
                onClick={() =>
                  setIsCreateOpen(
                    true
                  )
                }
              >
                <Plus className="size-4" />

                Adicionar compromisso
              </Button>

            </CardContent>

          </Card>

        ) : (

          /* -------------------------------------------------------------- */
          /* EVENTS                                                          */
          /* -------------------------------------------------------------- */

          <div className="space-y-4">

            {events.map(
              (event) => {

                const today =
                  isToday(
                    event.start_time
                  );

                return (
                  <Card
                    key={event.id}
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      !event.completed &&
                        "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
                      event.completed &&
                        "opacity-70"
                    )}
                  >

                    <CardContent className="p-0">

                      <div className="flex flex-col md:flex-row">

                        {/* ------------------------------------------------ */}
                        {/* DATE / TIME                                      */}
                        {/* ------------------------------------------------ */}

                        <div
                          className="
                            flex
                            shrink-0
                            items-center
                            gap-4
                            border-b
                            border-border
                            bg-muted/20
                            px-6
                            py-5
                            md:w-48
                            md:flex-col
                            md:items-start
                            md:justify-center
                            md:border-b-0
                            md:border-r
                          "
                        >

                          <div className="flex items-center gap-2 text-primary">

                            <Clock3 className="size-4" />

                            <span className="text-lg font-bold">
                              {formatTime(
                                event.start_time
                              )}
                            </span>

                          </div>

                          <div className="text-sm capitalize text-muted-foreground">
                            {today
                              ? "Hoje"
                              : formatShortDate(
                                  event.start_time
                                )}
                          </div>

                        </div>

                        {/* ------------------------------------------------ */}
                        {/* CONTENT                                           */}
                        {/* ------------------------------------------------ */}

                        <div className="flex min-w-0 flex-1 flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3
                                className={cn(
                                  "text-lg font-semibold tracking-tight",
                                  event.completed &&
                                    "text-muted-foreground line-through"
                                )}
                              >
                                {event.title}
                              </h3>

                              {today &&
                                !event.completed && (
                                  <Badge
                                    variant="outline"
                                    className="
                                      border-primary/20
                                      bg-primary/10
                                      text-primary
                                    "
                                  >
                                    Hoje
                                  </Badge>
                                )}

                              {event.completed && (
                                <Badge
                                  variant="outline"
                                  className="
                                    border-emerald-500/20
                                    bg-emerald-500/10
                                    text-emerald-600
                                  "
                                >
                                  Concluído
                                </Badge>
                              )}

                            </div>

                            {event.description && (
                              <p
                                className="
                                  mt-2
                                  line-clamp-2
                                  max-w-2xl
                                  text-sm
                                  leading-6
                                  text-muted-foreground
                                "
                              >
                                {event.description}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">

                              <span>
                                {formatDate(
                                  event.start_time
                                )}
                              </span>

                              <span className="hidden sm:inline">
                                •
                              </span>

                              <span>
                                {formatTime(
                                  event.start_time
                                )}{" "}
                                –{" "}
                                {formatTime(
                                  event.end_time
                                )}
                              </span>

                            </div>

                          </div>

                          {/* ------------------------------------------------ */}
                          {/* ACTIONS                                          */}
                          {/* ------------------------------------------------ */}

                          <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border pt-4 lg:border-0 lg:pt-0">

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                toggleComplete(
                                  event.id,
                                  event.completed
                                )
                              }
                              title={
                                event.completed
                                  ? "Marcar como pendente"
                                  : "Marcar como concluído"
                              }
                            >
                              {event.completed ? (
                                <CheckCircle2 className="text-emerald-600" />
                              ) : (
                                <Circle className="text-muted-foreground hover:text-emerald-600" />
                              )}
                            </Button>

                            <div className="flex items-center gap-1">

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setDetailEvent(
                                    event
                                  )
                                }
                              >
                                Detalhes
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setEditEvent(
                                    event
                                  )
                                }
                              >
                                <Pencil className="size-4" />

                                <span className="hidden sm:inline">
                                  Editar
                                </span>
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDelete(
                                    event.id
                                  )
                                }
                                title="Excluir compromisso"
                              >
                                <Trash2 className="size-4 text-destructive" />
                              </Button>

                            </div>

                          </div>

                        </div>

                      </div>

                    </CardContent>

                  </Card>
                );
              }
            )}

          </div>

        )}

      </section>

      {/* ------------------------------------------------------------------ */}
      {/* TODAY SUMMARY                                                      */}
      {/* ------------------------------------------------------------------ */}

      {!loading &&
        events.length > 0 &&
        todayEvents.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">

            <CardContent className="p-5">

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <CalendarDays className="size-5" />
                </div>

                <div>

                  <p className="font-semibold">
                    Você tem{" "}
                    {todayEvents.length}{" "}
                    compromisso
                    {todayEvents.length !==
                      1 &&
                      "s"}{" "}
                    hoje
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Mantenha o foco e acompanhe sua rotina ao longo do dia.
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>
        )}

      {/* ------------------------------------------------------------------ */}
      {/* DETAILS DIALOG                                                     */}
      {/* ------------------------------------------------------------------ */}

      <Dialog
        open={
          !!detailEvent
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setDetailEvent(
              null
            );
          }
        }}
      >

        <DialogContent className="sm:max-w-lg">

          <DialogHeader>

            <DialogTitle>
              Detalhes do compromisso
            </DialogTitle>

            <DialogDescription>
              Confira as informações deste compromisso.
            </DialogDescription>

          </DialogHeader>

          {detailEvent && (
            <div className="space-y-6 pt-2">

              <div>

                <h3 className="text-xl font-semibold tracking-tight">
                  {detailEvent.title}
                </h3>

                {detailEvent.description && (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {detailEvent.description}
                  </p>
                )}

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border bg-muted/20 p-4">

                  <div className="flex items-center gap-2 text-sm font-medium">

                    <Clock3 className="size-4 text-primary" />

                    Início

                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatDate(
                      detailEvent.start_time
                    )}
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatTime(
                      detailEvent.start_time
                    )}
                  </p>

                </div>

                <div className="rounded-xl border bg-muted/20 p-4">

                  <div className="flex items-center gap-2 text-sm font-medium">

                    <Clock3 className="size-4 text-primary" />

                    Término

                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatDate(
                      detailEvent.end_time
                    )}
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {formatTime(
                      detailEvent.end_time
                    )}
                  </p>

                </div>

              </div>

              <div className="flex items-center justify-between rounded-xl border p-4">

                <span className="text-sm font-medium">
                  Status
                </span>

                {detailEvent.completed ? (
                  <Badge
                    variant="outline"
                    className="
                      border-emerald-500/20
                      bg-emerald-500/10
                      text-emerald-600
                    "
                  >
                    <CheckCircle2 className="mr-1 size-3" />

                    Concluído
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="
                      border-primary/20
                      bg-primary/10
                      text-primary
                    "
                  >
                    <Circle className="mr-1 size-3" />

                    Pendente
                  </Badge>
                )}

              </div>

            </div>
          )}

        </DialogContent>

      </Dialog>

      {/* ------------------------------------------------------------------ */}
      {/* EDIT DIALOG                                                        */}
      {/* ------------------------------------------------------------------ */}

      <Dialog
        open={
          !!editEvent
        }
        onOpenChange={(
          open
        ) => {
          if (!open) {
            setEditEvent(
              null
            );
          }
        }}
      >

        <DialogContent className="sm:max-w-lg">

          <DialogHeader>

            <DialogTitle>
              Editar compromisso
            </DialogTitle>

            <DialogDescription>
              Atualize as informações e o horário do compromisso.
            </DialogDescription>

          </DialogHeader>

          {editEvent && (
            <EditAgendaForm
              event={
                editEvent
              }
              onSuccess={() => {
                setEditEvent(
                  null
                );

                fetchEvents();
              }}
            />
          )}

        </DialogContent>

      </Dialog>

    </div>
  );
}