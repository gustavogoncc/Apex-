"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  FolderPlus,
} from "lucide-react";

import {
  supabase,
} from "@/lib/supabase";

import {
  Button,
} from "@/components/ui/button";

import {
  DashboardSection,
} from "@/components/dashboard";

import {
  CreateRouteCard,
  EmptyRoutes,
  RouteCard,
  RoutesGrid,
  RoutesHeader,
} from "@/components/routes";

interface Route {
  id: string;

  name: string;

  created_at: string;

  updated_at?: string | null;

  is_completed?: boolean;
}

export default function RotasPage() {
  const [
    routes,
    setRoutes,
  ] = useState<Route[]>([]);

  const [
    routeName,
    setRouteName,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    creating,
    setCreating,
  ] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* FETCH ROUTES                                                               */
  /* -------------------------------------------------------------------------- */

  async function fetchRoutes() {
    setLoading(true);

    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);

      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from("study_routes")
      .select("*")
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (
      !error &&
      data
    ) {
      setRoutes(data);
    }

    setLoading(false);
  }

  /* -------------------------------------------------------------------------- */
  /* INITIAL LOAD                                                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    fetchRoutes();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* CREATE ROUTE                                                               */
  /* -------------------------------------------------------------------------- */

  async function handleCreateRoute(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !routeName.trim()
    ) {
      return;
    }

    setCreating(true);

    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser();

    if (user) {
      const {
        error,
      } = await supabase
        .from("study_routes")
        .insert([
          {
            name:
              routeName,

            user_id:
              user.id,
          },
        ]);

      if (!error) {
        setRouteName("");

        await fetchRoutes();
      } else {
        console.error(
          error
        );
      }
    }

    setCreating(false);
  }

  /* -------------------------------------------------------------------------- */
  /* DELETE ROUTE                                                               */
  /* -------------------------------------------------------------------------- */

  async function handleDeleteRoute(
    id: string
  ) {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir esta rota?"
      )
    ) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("study_routes")
      .delete()
      .eq(
        "id",
        id
      );

    if (!error) {
      setRoutes(
        (current) =>
          current.filter(
            (route) =>
              route.id !== id
          )
      );
    } else {
      console.error(
        error
      );
    }
  }

  /* -------------------------------------------------------------------------- */
  /* TOGGLE COMPLETE                                                            */
  /* -------------------------------------------------------------------------- */

  async function handleToggleComplete(
    id: string,
    currentStatus?: boolean
  ) {
    const newStatus =
      !currentStatus;

    const {
      error,
    } = await supabase
      .from("study_routes")
      .update({
        is_completed:
          newStatus,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        id
      );

    if (!error) {
      setRoutes(
        (current) =>
          current.map(
            (route) =>
              route.id === id
                ? {
                    ...route,

                    is_completed:
                      newStatus,

                    updated_at:
                      new Date().toISOString(),
                  }
                : route
          )
      );
    } else {
      console.error(
        error
      );
    }
  }

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-12 pb-10">

      {/* ---------------------------------------------------------------------- */}
      {/* HEADER                                                                 */}
      {/* ---------------------------------------------------------------------- */}

      <RoutesHeader />

      {/* ---------------------------------------------------------------------- */}
      {/* CREATE ROUTE                                                           */}
      {/* ---------------------------------------------------------------------- */}

      <CreateRouteCard
        value={
          routeName
        }
        loading={
          creating
        }
        onChange={
          setRouteName
        }
        onSubmit={
          handleCreateRoute
        }
      />

      {/* ---------------------------------------------------------------------- */}
      {/* ROUTES                                                                  */}
      {/* ---------------------------------------------------------------------- */}

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Carregando rotas...
        </p>
      ) : routes.length === 0 ? (
        <EmptyRoutes
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
              <FolderPlus className="size-5" />

              Criar primeira rota
            </Button>
          }
        />
      ) : (
        <DashboardSection
          title="Suas Rotas"
          description="Gerencie seus objetivos de estudo."
        >
          <RoutesGrid>
            {routes.map(
              (route) => (
                <RouteCard
                  key={
                    route.id
                  }
                  id={
                    route.id
                  }
                  name={
                    route.name
                  }
                  createdAt={
                    route.created_at
                  }
                  updatedAt={
                    route.updated_at
                  }
                  completed={
                    route.is_completed
                  }
                  onDelete={() =>
                    handleDeleteRoute(
                      route.id
                    )
                  }
                  onToggleComplete={() =>
                    handleToggleComplete(
                      route.id,
                      route.is_completed
                    )
                  }
                />
              )
            )}
          </RoutesGrid>
        </DashboardSection>
      )}

    </div>
  );
}