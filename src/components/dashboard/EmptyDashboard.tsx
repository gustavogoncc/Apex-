import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type EmptyDashboardProps = {
  onCreateRoute?: () => void;
};

export function EmptyDashboard({
  onCreateRoute,
}: EmptyDashboardProps) {
  return (
    <Card>

      <CardContent className="flex flex-col items-center px-8 py-16 text-center">

        <div
          className="
            mb-8
            flex
            size-20
            items-center
            justify-center
            rounded-full
            bg-primary/10
            text-primary
          "
        >
          <Compass className="size-10" />
        </div>

        <h2 className="heading text-3xl font-bold tracking-tight">
          Bem-vindo ao Apex Studies
        </h2>

        <p className="mt-4 max-w-lg text-muted-foreground leading-7">
          Você ainda não possui dados suficientes para visualizar seu
          Dashboard.
        </p>

        <p className="mt-2 max-w-lg text-muted-foreground leading-7">
          Crie sua primeira rota de estudos e comece a acompanhar sua evolução.
        </p>

        <Button
          className="mt-10"
          size="lg"
          onClick={onCreateRoute}
        >
          Criar primeira rota
        </Button>

      </CardContent>

    </Card>
  );
}