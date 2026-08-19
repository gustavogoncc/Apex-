"use server";

import { createClient } from "@supabase/supabase-js";

interface AdminActivity {
  date: string;
  count: number;
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
/* GET ADMIN ACTIVITY                                                         */
/* -------------------------------------------------------------------------- */

export async function getAdminActivity(
  accessToken: string
): Promise<AdminActivity[]> {
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
    throw new Error(
      "Acesso administrativo não autorizado."
    );
  }

  /* ------------------------------------------------------------------------ */
  /* DATE RANGE                                                                */
  /* ------------------------------------------------------------------------ */

  const today =
    new Date();

  const thirtyDaysAgo =
    new Date(today);

  thirtyDaysAgo.setDate(
    thirtyDaysAgo.getDate() - 29
  );

  thirtyDaysAgo.setHours(
    0,
    0,
    0,
    0
  );

  /* ------------------------------------------------------------------------ */
  /* FETCH USERS                                                              */
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
      "Não foi possível carregar os dados de atividade."
    );
  }

  /* ------------------------------------------------------------------------ */
  /* INITIALIZE 30 DAYS                                                       */
  /* ------------------------------------------------------------------------ */

  const activityMap =
    new Map<string, number>();

  for (
    let index = 0;
    index < 30;
    index++
  ) {
    const date =
      new Date(
        thirtyDaysAgo
      );

    date.setDate(
      thirtyDaysAgo.getDate() + index
    );

    const key =
      date.toISOString().slice(
        0,
        10
      );

    activityMap.set(
      key,
      0
    );
  }

  /* ------------------------------------------------------------------------ */
  /* COUNT NEW USERS                                                          */
  /* ------------------------------------------------------------------------ */

  for (const authUser of data.users) {
    if (!authUser.created_at) {
      continue;
    }

    const createdAt =
      new Date(
        authUser.created_at
      );

    if (
      createdAt <
      thirtyDaysAgo
    ) {
      continue;
    }

    const key =
      createdAt
        .toISOString()
        .slice(
          0,
          10
        );

    if (
      activityMap.has(key)
    ) {
      activityMap.set(
        key,
        (activityMap.get(key) ?? 0) + 1
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* RETURN                                                                  */
  /* ------------------------------------------------------------------------ */

  return Array.from(
    activityMap.entries()
  ).map(
    ([date, count]) => ({
      date,
      count,
    })
  );
}