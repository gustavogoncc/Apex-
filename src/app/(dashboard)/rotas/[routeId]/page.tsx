"use client";

import { use, useEffect, useState } from "react";

import { BookOpen } from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";

import { DashboardSection } from "@/components/dashboard";

import {
  CreateDisciplineCard,
  DisciplineCard,
  DisciplineHeader,
  DisciplinesGrid,
  EmptyDisciplines,
} from "@/components/disciplines";

interface Subject {
  id: string;

  name: string;

  created_at: string;

  updated_at?: string | null;

  status?: "A_ESTUDAR" | "CONCLUIDO";
}

export default function RouteDetailsPage({
  params,
}: {
  params: Promise<{
    routeId: string;
  }>;
}) {
  const { routeId } = use(params);

  const [routeName, setRouteName] = useState("");

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [subjectName, setSubjectName] = useState("");

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  async function fetchData() {
    setLoading(true);

    const [routeResult, subjectsResult] =
      await Promise.all([
        supabase
          .from("study_routes")
          .select("name")
          .eq("id", routeId)
          .single(),

        supabase
          .from("subjects")
          .select("*")
          .eq("route_id", routeId)
          .order("created_at", {
            ascending: true,
          }),
      ]);

    if (routeResult.data) {
      setRouteName(routeResult.data.name);
    }

    if (subjectsResult.data) {
      setSubjects(subjectsResult.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [routeId]);


    async function handleCreateDiscipline(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!subjectName.trim()) return;

    setCreating(true);

    const { data, error } = await supabase
      .from("subjects")
      .insert([
        {
          name: subjectName,
          route_id: routeId,
          status: "A_ESTUDAR",
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setSubjects((current) => [...current, data]);

      setSubjectName("");
    } else {
      console.error(error);
    }

    setCreating(false);
  }

  async function handleDeleteDiscipline(
    subjectId: string
  ) {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir esta disciplina?"
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", subjectId);

    if (!error) {
      setSubjects((current) =>
        current.filter(
          (subject) => subject.id !== subjectId
        )
      );
    } else {
      console.error(error);
    }
  }

  async function handleToggleComplete(
    subject: Subject
  ) {
    const newStatus =
      subject.status === "CONCLUIDO"
        ? "A_ESTUDAR"
        : "CONCLUIDO";

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("subjects")
      .update({
        status: newStatus,
        updated_at: now,
      })
      .eq("id", subject.id);

    if (!error) {
      setSubjects((current) =>
        current.map((item) =>
          item.id === subject.id
            ? {
                ...item,
                status: newStatus,
                updated_at: now,
              }
            : item
        )
      );
    } else {
      console.error(error);
    }
  }

  return (
    <div className="space-y-12 pb-10">

      <DisciplineHeader
        routeName={routeName}
        totalDisciplines={subjects.length}
      />

      <CreateDisciplineCard
        value={subjectName}
        loading={creating}
        onChange={setSubjectName}
        onSubmit={handleCreateDiscipline}
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Carregando disciplinas...
        </p>
      ) : subjects.length === 0 ? (
        <EmptyDisciplines
          action={
            <Button
              size="lg"
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>(
                    "input"
                  )
                  ?.focus()
              }
            >
              <BookOpen className="size-5" />

              Criar primeira disciplina
            </Button>
          }
        />
      ) : (
        <DashboardSection
          title="Disciplinas"
          description="Gerencie os principais blocos de estudo desta rota."
        >
          <DisciplinesGrid>
            {subjects.map((subject) => (
              <DisciplineCard
                key={subject.id}
                id={subject.id}
                routeId={routeId}
                name={subject.name}
                createdAt={subject.created_at}
                updatedAt={subject.updated_at}
                completed={
                  subject.status === "CONCLUIDO"
                }
                onDelete={() =>
                  handleDeleteDiscipline(
                    subject.id
                  )
                }
                onToggleComplete={() =>
                  handleToggleComplete(
                    subject
                  )
                }
              />
            ))}
          </DisciplinesGrid>
        </DashboardSection>
      )}

    </div>
  );
}