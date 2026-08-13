"use client";

import { Loader2, Lightbulb, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

type CreateDisciplineCardProps = {
  value: string;

  loading?: boolean;

  onChange: (value: string) => void;

  onSubmit: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;
};

export function CreateDisciplineCard({
  value,
  loading = false,
  onChange,
  onSubmit,
}: CreateDisciplineCardProps) {
  return (
    <Card>

      <CardContent className="p-8">

        <div className="grid gap-8 xl:grid-cols-[2fr_340px]">

          <div>

            <CardTitle className="text-2xl">
              Nova Disciplina
            </CardTitle>

            <CardDescription className="mt-2">
              Adicione os principais blocos de estudo desta rota.
            </CardDescription>

            <form
              onSubmit={onSubmit}
              className="mt-8 flex flex-col gap-4 lg:flex-row"
            >

              <Input
                value={value}
                onChange={(e) =>
                  onChange(e.target.value)
                }
                placeholder="Ex.: Direito Constitucional, Informática, Programação Web..."
                className="flex-1"
                required
              />

              <Button
                type="submit"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Plus className="size-5" />
                )}

                Adicionar
              </Button>

            </form>

          </div>

          <Card className="border-border/60 bg-card/50">

            <CardContent className="flex h-full flex-col justify-center p-6">

              <div
                className="
                  mb-5
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                  text-primary
                "
              >
                <Lightbulb className="size-6" />
              </div>

              <h3 className="text-lg font-semibold">
                Dica
              </h3>

              <p className="mt-3 leading-7 text-muted-foreground">
                Cada disciplina representa um grande bloco de estudo.
                Depois você poderá cadastrar conteúdos, tópicos e
                questões para organizar seu aprendizado de forma
                progressiva e acompanhar sua evolução dentro desta
                rota.
              </p>

            </CardContent>

          </Card>

        </div>

      </CardContent>

    </Card>
  );
}