"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

import { supabase } from "@/lib/supabase";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState("");

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setErrorMsg("");

    try {
      /* -------------------------------------------------------------------- */
      /* AUTHENTICATION                                                       */
      /* -------------------------------------------------------------------- */

      const {
        error,
      } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        if (
          error.message ===
          "Invalid login credentials"
        ) {
          setErrorMsg(
            "E-mail ou senha incorretos."
          );
        } else {
          setErrorMsg(
            error.message
          );
        }

        return;
      }

      /* -------------------------------------------------------------------- */
      /* REDIRECT                                                             */
      /* -------------------------------------------------------------------- */

      router.push("/admin");
      router.refresh();

    } catch (error) {
      console.error(
        "Erro ao realizar login administrativo:",
        error
      );

      setErrorMsg(
        "Não foi possível realizar o login. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-zinc-950
        px-4
        py-8
        text-zinc-100
      "
    >

      {/* ------------------------------------------------------------------ */}
      {/* BACKGROUND                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          size-[500px]
          rounded-full
          bg-[#2563EB]/10
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-40
          size-[500px]
          rounded-full
          bg-[#ff5f3a]/5
          blur-[130px]
        "
      />

      {/* ------------------------------------------------------------------ */}
      {/* LOGIN CARD                                                          */}
      {/* ------------------------------------------------------------------ */}

      <Card
        className="
          relative
          z-10
          w-full
          max-w-md
          overflow-hidden
          border-zinc-800
          bg-zinc-900/70
          text-zinc-100
          shadow-2xl
          backdrop-blur-xl
        "
      >

        <CardHeader
          className="
            space-y-5
            px-8
            pb-5
            pt-8
            text-center
          "
        >

          {/* LOGO */}

          <div className="flex justify-center">

            <Image
              src="/img/APEX.png"
              alt="APEX Studies"
              width={110}
              height={48}
              priority
              className="h-auto w-[110px] object-contain"
            />

          </div>

          {/* ADMIN BADGE */}

          <div className="flex justify-center">

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-500/20
                bg-blue-500/10
                px-3
                py-1.5
                text-xs
                font-medium
                text-blue-400
              "
            >
              <ShieldCheck className="size-3.5" />

              Área administrativa
            </div>

          </div>

          <div className="space-y-2">

            <h1 className="text-2xl font-bold tracking-tight">
              Acesso administrativo
            </h1>

            <CardDescription
              className="
                mx-auto
                max-w-[300px]
                text-sm
                leading-6
                text-zinc-400
              "
            >
              Entre com suas credenciais para
              acessar o painel administrativo do APEX.
            </CardDescription>

          </div>

        </CardHeader>

        <CardContent
          className="
            px-8
            pb-8
          "
        >

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* ------------------------------------------------------------ */}
            {/* E-MAIL                                                        */}
            {/* ------------------------------------------------------------ */}

            <div className="space-y-2">

              <label
                htmlFor="email"
                className="
                  text-sm
                  font-medium
                  text-zinc-200
                "
              >
                E-mail
              </label>

              <div className="relative">

                <Mail
                  className="
                    absolute
                    left-3
                    top-1/2
                    size-4
                    -translate-y-1/2
                    text-zinc-500
                  "
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  required
                  className="
                    h-11
                    border-zinc-800
                    bg-zinc-950
                    pl-10
                    text-zinc-100
                    placeholder:text-zinc-600
                    focus-visible:ring-1
                    focus-visible:ring-blue-500
                  "
                />

              </div>

            </div>

            {/* ------------------------------------------------------------ */}
            {/* SENHA                                                         */}
            {/* ------------------------------------------------------------ */}

            <div className="space-y-2">

              <label
                htmlFor="password"
                className="
                  text-sm
                  font-medium
                  text-zinc-200
                "
              >
                Senha
              </label>

              <div className="relative">

                <Lock
                  className="
                    absolute
                    left-3
                    top-1/2
                    size-4
                    -translate-y-1/2
                    text-zinc-500
                  "
                />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  required
                  className="
                    h-11
                    border-zinc-800
                    bg-zinc-950
                    pl-10
                    text-zinc-100
                    placeholder:text-zinc-600
                    focus-visible:ring-1
                    focus-visible:ring-blue-500
                  "
                />

              </div>

            </div>

            {/* ------------------------------------------------------------ */}
            {/* ERROR                                                         */}
            {/* ------------------------------------------------------------ */}

            {errorMsg && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/5
                  px-4
                  py-3
                  text-center
                  text-sm
                  leading-5
                  text-red-400
                "
              >
                {errorMsg}
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* SUBMIT                                                        */}
            {/* ------------------------------------------------------------ */}

            <Button
              type="submit"
              disabled={loading}
              className="
                h-11
                w-full
                bg-[#2563EB]
                text-white
                shadow-lg
                shadow-blue-500/10
                hover:bg-[#1D4ED8]
              "
            >

              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />

                  Entrando...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />

                  Entrar na administração
                </>
              )}

            </Button>

          </form>

          {/* ---------------------------------------------------------------- */}
          {/* FOOTER                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="mt-6 border-t border-zinc-800 pt-5">

            <p className="text-center text-xs leading-5 text-zinc-600">
              Acesso restrito aos administradores
              autorizados da plataforma.
            </p>

          </div>

        </CardContent>

      </Card>

    </main>
  );
}