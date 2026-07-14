import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, CheckCircle2, LayoutDashboard } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-[#ff5f3a]/30">
      {/* Header */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="w-32">
          <Image src="/img/APEX.png" alt="APEX Study" width={128} height={42} className="object-contain" />
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-400 hover:text-zinc-50">Entrar</Button>
          </Link>
          <Link href="/cadastro">
            <Button className="bg-[#ff5f3a] text-white hover:bg-[#ff5f3a]/90">Cadastrar</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Domine seus estudos com o <span className="text-[#ff5f3a]">APEX</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          A plataforma definitiva para organizar suas rotas, mapear conteúdos e alcançar seus objetivos de forma simples e eficiente.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/cadastro">
            <Button size="lg" className="bg-[#ff5f3a] text-white hover:bg-[#ff5f3a]/90 h-12 px-8 text-lg">
              Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Destaques com Animação Hover */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            { icon: LayoutDashboard, title: "Organização", desc: "Estruture suas rotas de estudos e acompanhe seu progresso." },
            { icon: BookOpen, title: "Conteúdo", desc: "Mapeie tópicos, materiais e métricas de desempenho." },
            { icon: CheckCircle2, title: "Conclusão", desc: "Marque o que já foi dominado e mantenha o foco no próximo passo." }
          ].map((item, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 transition-all duration-300 hover:border-[#ff5f3a]/50 hover:shadow-lg hover:shadow-[#ff5f3a]/10 hover:-translate-y-2 cursor-default"
            >
              <item.icon className="h-8 w-8 text-[#192e5b] mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="border-t border-zinc-900 mt-20 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
         {/* Logo e Powered By */}
<div className="flex flex-col items-center md:items-start gap-1">
  <Image src="/img/APEX.png" alt="APEX Study" width={100} height={33} />
  <a 
    href="https://www.instagram.com/verosoftwares/"
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-[10px] uppercase tracking-widest text-zinc-600 hover:text-[#ff5f3a] transition-colors"
  >
    Powered by Vero Softwares
  </a>
</div>
          
          {/* Copyright */}
          <p className="text-sm text-zinc-600">
            © 2026 Apex Studies. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}