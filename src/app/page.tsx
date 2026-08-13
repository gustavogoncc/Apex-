import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const highlights = [
    {
      icon: LayoutDashboard,
      title: "Organização",
      description:
        "Estruture suas rotas de estudo e acompanhe tudo o que precisa ser feito.",
    },
    {
      icon: BookOpen,
      title: "Conteúdo",
      description:
        "Mapeie disciplinas, tópicos e materiais para manter seus estudos organizados.",
    },
    {
      icon: CheckCircle2,
      title: "Progresso",
      description:
        "Acompanhe sua evolução, conclua etapas e saiba exatamente onde está.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
      {/* ------------------------------------------------------------------ */}
      {/* BACKGROUND                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-[520px] rounded-full bg-blue-600/[0.07] blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 size-[520px] rounded-full bg-[#ff5f3a]/[0.05] blur-[140px]" />

        <div className="absolute left-1/2 top-[35%] size-[420px] -translate-x-1/2 rounded-full bg-blue-500/[0.025] blur-[140px]" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="relative z-10 border-b border-zinc-900/80">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <Image
              src="/img/APEX.png"
              alt="APEX Studies"
              width={112}
              height={38}
              priority
              className="object-contain"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              >
                Entrar
              </Button>
            </Link>

            <Link href="/cadastro">
              <Button>
                Criar conta
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                               */}
      {/* ------------------------------------------------------------------ */}

      <main className="relative z-10">
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-24 text-center sm:pb-24 sm:pt-32">
          {/* Eyebrow */}

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-xs font-medium text-zinc-400 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-blue-500" />

            Sua jornada de estudos, organizada.
          </div>

          {/* Title */}

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-zinc-50 sm:text-5xl md:text-6xl lg:text-7xl">
            Estude com mais clareza.
            <span className="mt-2 block text-blue-500">
              Evolua com propósito.
            </span>
          </h1>

          {/* Description */}

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Organize suas rotas de estudo, acompanhe seu progresso
            e transforme seus objetivos em uma jornada clara e
            estruturada.
          </p>

          {/* CTA */}

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/cadastro">
              <Button
                size="lg"
                className="h-12 px-7"
              >
                Começar agora

                <ArrowRight className="size-5" />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                variant="ghost"
                size="lg"
                className="h-12 px-7 text-zinc-400 hover:text-zinc-100"
              >
                Já tenho uma conta
              </Button>
            </Link>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* HIGHLIGHTS                                                       */}
          {/* ---------------------------------------------------------------- */}

          <div className="mt-24 grid gap-5 text-left md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    group
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900/50
                    p-7
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-blue-500/30
                    hover:bg-zinc-900/80
                    hover:shadow-xl
                    hover:shadow-blue-500/[0.04]
                  "
                >
                  <div
                    className="
                      flex
                      size-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-500/10
                      text-blue-500
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                  >
                    <Icon className="size-5" />
                  </div>

                  <h2 className="mt-6 text-lg font-semibold tracking-tight text-zinc-100">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* VISUAL SEPARATOR                                                 */}
          {/* ---------------------------------------------------------------- */}

          <div className="mx-auto mt-24 flex max-w-2xl items-center gap-4">
            <div className="h-px flex-1 bg-zinc-900" />

            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
              APEX Studies
            </span>

            <div className="h-px flex-1 bg-zinc-900" />
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <footer className="relative z-10 border-t border-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Image
              src="/img/APEX.png"
              alt="APEX Studies"
              width={92}
              height={31}
              className="object-contain opacity-90"
            />

            <a
              href="https://www.instagram.com/verosoftwares/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-zinc-600
                transition-colors
                hover:text-blue-500
              "
            >
              Powered by Vero Softwares
            </a>
          </div>

          <p className="text-center text-xs text-zinc-600 sm:text-right">
            © 2026 Apex Studies. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}