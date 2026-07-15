'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, Compass, LogOut, Menu, X, Calendar } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Minhas Rotas', href: '/rotas', icon: Compass },
    {name: 'Agenda', href: '/agenda', icon: Calendar}
  ]

  return (
    // Mudança principal aqui: min-h-screen e grid no desktop
    <div className="min-h-screen bg-zinc-950 text-zinc-50 md:grid md:grid-cols-[256px_1fr]">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-4 z-40">
        <Image src="/img/APEX.png" alt="Logo" width={80} height={30} className="object-contain" />
        <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 p-2">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* SIDEBAR */}
      {/* 
         - Mobile: fixed para o menu abrir por cima.
         - Desktop: sticky top-0 h-screen para ficar travada e ocupar toda a altura.
      */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between p-4 transition-transform duration-300
        md:sticky md:top-0 md:h-screen md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-6">
          <div className="px-2 py-2 hidden md:block">
            <Image src="/img/APEX.png" alt="Logo" width={100} height={40} className="object-contain" />
          </div>
          
          <div className="md:hidden h-10" />

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#192e5b] text-white'
                      : 'text-zinc-400 hover:bg-[#192e5b] hover:text-zinc-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 transition-colors w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Sair do Sistema
        </button>
      </aside>

      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="p-4 md:p-8 mt-16 md:mt-0 w-full overflow-hidden">
        {children}
      </main>

    </div>
  )
}