'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, Compass, LogOut, GraduationCap } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Links de navegação da barra lateral
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Minhas Rotas', href: '/rotas', icon: Compass },
  ]

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col justify-between p-4 fixed h-full">
        <div className="space-y-6">
          {/* Logo / Nome do Sistema */}
          <div className="flex items-center gap-2 px-2 py-1">
            <GraduationCap className="h-6 w-6 text-zinc-200" />
            <span className="text-xl font-bold tracking-tight">Ápice</span>
          </div>

          {/* Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-50'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Botão de Logout no rodapé da Sidebar */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 transition-colors w-full text-left border border-transparent hover:border-red-900/30"
        >
          <LogOut className="h-4 w-4" />
          Sair do Sistema
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>

    </div>
  )
}