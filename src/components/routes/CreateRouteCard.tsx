"use client";

import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type CreateRouteCardProps = {
  value: string;
  loading?: boolean;

  onChange: (value: string) => void;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function CreateRouteCard({
  value,
  loading = false,
  onChange,
  onSubmit,
}: CreateRouteCardProps) {
  return (
    <Card>

      <CardContent className="p-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          <div>

            <h2 className="heading text-2xl font-semibold">
              Nova Rota de Estudos
            </h2>

            <p className="mt-2 text-muted-foreground">
              Crie uma nova rota para organizar disciplinas,
              conteúdos e acompanhar sua evolução.
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >

              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Ex.: Concurso TRT, Pós-graduação, Desenvolvedor Full Stack..."
                className="flex-1"
                required
              />

              <Button
                type="submit"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    Criar Rota
                  </>
                )}
              </Button>

            </form>

          </div>

          <div
            className="
              hidden
              lg:flex
              flex-col
              justify-center
              rounded-2xl
              border
              border-border
              bg-secondary/30
              p-6
            "
          >

            <p className="text-sm font-medium text-foreground">
              Dica
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Utilize um nome claro para identificar seu objetivo.
              Você poderá adicionar disciplinas, conteúdos e acompanhar
              seu progresso ao longo do tempo.
            </p>

          </div>

        </div>

      </CardContent>

    </Card>
  );
}