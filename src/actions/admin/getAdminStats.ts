"use server";

import { createClient } from "@supabase/supabase-js";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalRoutes: number;
  totalSessions: number;
  totalSubjects: number;
}

/* -------------------------------------------------------------------------- */
/* ADMIN CLIENT                                                               */
/* -------------------------------------------------------------------------- */

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const secretKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL não está configurada."
    );
  }

  if (!secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY não está configurada."
    );
  }

  return createClient(
    supabaseUrl,
    secretKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/* -------------------------------------------------------------------------- */
/* AUTH CLIENT                                                                */
/* -------------------------------------------------------------------------- */

function getAuthClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL não está configurada."
    );
  }

  if (!anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurada."
    );
  }

  return createClient(
    supabaseUrl,
    anonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/* -------------------------------------------------------------------------- */
/* GET ADMIN STATS                                                            */
/* -------------------------------------------------------------------------- */

export async function getAdminStats(
  accessToken: string
): Promise<AdminStats> {
  if (!accessToken) {
    throw new Error(
      "Sessão de autenticação não encontrada."
    );
  }

  /* ------------------------------------------------------------------------ */
  /* VERIFY USER                                                              */
  /* ------------------------------------------------------------------------ */

  const authClient =
    getAuthClient();

  const {
    data: {
      user,
    },
    error: userError,
  } =
    await authClient.auth.getUser(
      accessToken
    );

  if (userError || !user) {
    console.error(
      "Erro ao verificar usuário:",
      userError
    );

    throw new Error(
      "Usuário não autenticado."
    );
  }

  console.log(
    "Usuário autenticado:",
    user.id
  );

  /* ------------------------------------------------------------------------ */
  /* ADMIN CLIENT                                                             */
  /* ------------------------------------------------------------------------ */

  const adminClient =
    getAdminClient();

  /* ------------------------------------------------------------------------ */
  /* VERIFY ADMIN ROLE                                                        */
  /* ------------------------------------------------------------------------ */

  const {
    data: adminRole,
    error: roleError,
  } =
    await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

  if (roleError) {
    console.error(
      "Erro ao verificar role administrativa:",
      roleError
    );

    throw new Error(
      "Não foi possível verificar as permissões administrativas."
    );
  }

  if (!adminRole) {
    console.error(
      "Usuário autenticado não possui role admin:",
      user.id
    );

    throw new Error(
      "Acesso administrativo não autorizado."
    );
  }

  /* ------------------------------------------------------------------------ */
  /* FETCH AUTH USERS                                                         */
  /* ------------------------------------------------------------------------ */

  const {
    data,
    error,
  } =
    await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

  if (error) {
    console.error(
      "Erro ao buscar usuários:",
      error
    );

    throw new Error(
      "Não foi possível carregar os usuários."
    );
  }

  /* ------------------------------------------------------------------------ */
  /* TOTAL USERS                                                              */
  /* ------------------------------------------------------------------------ */

  const totalUsers =
    data.total ?? data.users.length;

  /* ------------------------------------------------------------------------ */
  /* DATE REFERENCE                                                           */
  /* ------------------------------------------------------------------------ */

  const thirtyDaysAgo =
    new Date();

  thirtyDaysAgo.setDate(
    thirtyDaysAgo.getDate() - 30
  );

  /* ------------------------------------------------------------------------ */
  /* ACTIVE USERS                                                             */
  /* ------------------------------------------------------------------------ */

  const activeUsers =
    data.users.filter((authUser) => {
      if (!authUser.last_sign_in_at) {
        return false;
      }

      const lastSignIn =
        new Date(
          authUser.last_sign_in_at
        );

      return (
        lastSignIn >= thirtyDaysAgo
      );
    }).length;

  /* ------------------------------------------------------------------------ */
  /* NEW USERS                                                                */
  /* ------------------------------------------------------------------------ */

  const newUsers =
    data.users.filter((authUser) => {
      if (!authUser.created_at) {
        return false;
      }

      const createdAt =
        new Date(
          authUser.created_at
        );

      return (
        createdAt >= thirtyDaysAgo
      );
    }).length;

  /* ------------------------------------------------------------------------ */
  /* TOTAL ROUTES                                                             */
  /* ------------------------------------------------------------------------ */

  const {
    count: totalRoutes,
    error: routesError,
  } =
    await adminClient
      .from("study_routes")
      .select("id", {
        count: "exact",
        head: true,
      });

  if (routesError) {
    console.error(
      "Erro ao buscar rotas de estudo:",
      routesError
    );

    throw new Error(
      "Não foi possível carregar as rotas de estudo."
    );
  }

  /* ------------------------------------------------------------------------ */
  /* TOTAL SESSIONS                                                           */
  /* ------------------------------------------------------------------------ */

  const {
    count: totalSessions,
    error: sessionsError,
  } =
    await adminClient
      .from("study_sessions")
      .select("id", {
        count: "exact",
        head: true,
      });

  if (sessionsError) {
    console.error(
      "Erro ao buscar sessões de estudo:",
      sessionsError
    );

    throw new Error(
      "Não foi possível carregar as sessões de estudo."
    );
  }

  /* ------------------------------------------------------------------------ */
  /* TOTAL SUBJECTS                                                           */
  /* ------------------------------------------------------------------------ */

  const {
    count: totalSubjects,
    error: subjectsError,
  } =
    await adminClient
      .from("subjects")
      .select("id", {
        count: "exact",
        head: true,
      });

  if (subjectsError) {
    console.error(
      "Erro ao buscar disciplinas:",
      subjectsError
    );

    throw new Error(
      "Não foi possível carregar as disciplinas."
    );
  }

  /* ------------------------------------------------------------------------ */
  /* RETURN                                                                  */
  /* ------------------------------------------------------------------------ */

  return {
    totalUsers,
    activeUsers,
    newUsers,
    totalRoutes: totalRoutes ?? 0,
    totalSessions: totalSessions ?? 0,
    totalSubjects: totalSubjects ?? 0,
  };
}