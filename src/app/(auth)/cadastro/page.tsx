"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  UserPlus,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState("");

  const router = useRouter();

  async function handleSignUp(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      alert(
        "Cadastro realizado! Verifique seu e-mail para confirmar."
      );

      router.push("/login");
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
        bg-background
        px-4
        py-10
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/* BACKGROUND                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          size-[420px]
          rounded-full
          bg-primary/8
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-32
          size-[420px]
          rounded-full
          bg-primary/5
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_75%)]
        "
      />

      {/* ------------------------------------------------------------------ */}
      {/* CARD                                                                */}
      {/* ------------------------------------------------------------------ */}

      <Card
        className="
          relative
          z-10
          w-full
          max-w-md
          overflow-hidden
          border-border/70
          bg-card/95
          shadow-2xl
          backdrop-blur-xl
        "
      >
        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                            */}
        {/* ---------------------------------------------------------------- */}

        <CardHeader
          className="
            flex
            flex-col
            items-center
            space-y-0
            px-6
            pb-5
            pt-9
            text-center
            sm:px-8
            sm:pt-10
          "
        >
          {/* Logo */}

          <div
            className="
              flex
              h-16
              w-full
              items-center
              justify-center
            "
          >
            <Image
              src="/img/APEX.png"
              alt="APEX Studies"
              width={130}
              height={60}
              priority
              className="
                h-auto
                w-auto
                max-h-14
                object-contain
              "
            />
          </div>

          {/* Title */}

          <div className="mt-7 space-y-2">
            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                sm:text-3xl
              "
            >
              Crie sua conta
            </h1>

            <CardDescription
              className="
                mx-auto
                max-w-[300px]
                text-sm
                leading-6
              "
            >
              Organize sua jornada de estudos
              e acompanhe sua evolução em um
              só lugar.
            </CardDescription>
          </div>
        </CardHeader>

        {/* ---------------------------------------------------------------- */}
        {/* CONTENT                                                           */}
        {/* ---------------------------------------------------------------- */}

        <CardContent
          className="
            space-y-6
            px-6
            pb-8
            sm:px-8
            sm:pb-10
          "
        >
          <form
            onSubmit={handleSignUp}
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
                  text-foreground
                "
              >
                E-mail
              </label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    size-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                  className="
                    h-11
                    rounded-xl
                    border-border
                    bg-background
                    pl-10
                    transition-all
                    focus-visible:border-primary
                    focus-visible:ring-2
                    focus-visible:ring-primary/20
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
                  text-foreground
                "
              >
                Senha
              </label>

              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    size-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                  className="
                    h-11
                    rounded-xl
                    border-border
                    bg-background
                    pl-10
                    transition-all
                    focus-visible:border-primary
                    focus-visible:ring-2
                    focus-visible:ring-primary/20
                  "
                />
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* ERROR                                                         */}
            {/* ------------------------------------------------------------ */}

            {errorMsg && (
              <div
                role="alert"
                className="
                  rounded-xl
                  border
                  border-destructive/20
                  bg-destructive/5
                  px-4
                  py-3
                  text-sm
                  leading-5
                  text-destructive
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
              size="lg"
              className="
                h-12
                w-full
                rounded-xl
              "
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <UserPlus className="size-4" />

                  Criar conta

                  <ArrowRight className="ml-auto size-4" />
                </>
              )}
            </Button>
          </form>

          {/* ---------------------------------------------------------------- */}
          {/* DIVIDER                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />

            <span
              className="
                text-xs
                font-medium
                uppercase
                tracking-wider
                text-muted-foreground
              "
            >
              ou
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* LOGIN                                                             */}
          {/* ---------------------------------------------------------------- */}

          <p
            className="
              text-center
              text-sm
              text-muted-foreground
            "
          >
            Já tem uma conta?{" "}

            <Link
              href="/login"
              className="
                inline-flex
                items-center
                gap-1
                font-medium
                text-primary
                underline-offset-4
                transition-colors
                hover:text-primary/80
                hover:underline
              "
            >
              Entrar

              <ArrowRight className="size-3.5" />
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}