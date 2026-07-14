'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Loader2, Lock, Mail, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message === 'Invalid login credentials') {
        setErrorMsg('E-mail ou senha incorretos.')
      } else {
        setErrorMsg(error.message)
      }
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
      {/* Detalhes de gradiente de fundo para dar profundidade de forma elegante */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#192e5b]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#ff5f3a]/5 blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-md text-zinc-50 shadow-2xl relative z-10">
        <CardHeader className="space-y-4 text-center pb-4 flex flex-col items-center">
          {/* Logo Oficial */}
          <div className="relative w-48 h-16 flex items-center justify-center">
            <Image 
              src="/img/APEX.png" 
              alt="APEX Study" 
              width={100} 
              height={64} 
              priority
              className="object-contain"
            />
          </div>
          <CardDescription className="text-zinc-400 text-sm max-w-[280px]">
            Insira suas credenciais para acessar sua rota de estudos
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Campo E-mail */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-600 focus-visible:ring-1 focus-visible:ring-[#ff5f3a] transition-all"
                  required
                />
              </div>
            </div>
            
            {/* Campo Senha */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Senha
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-600 focus-visible:ring-1 focus-visible:ring-[#ff5f3a] transition-all"
                  required
                />
              </div>
            </div>

            {/* Alerta de Erro */}
            {errorMsg && (
              <div className="text-sm text-red-400 text-center font-medium bg-red-950/20 py-2.5 px-3 rounded-lg border border-red-900/30 transition-all">
                {errorMsg}
              </div>
            )}

            {/* Botão de Submit */}
            <Button 
              type="submit" 
              className="w-full bg-[#ff5f3a] text-white hover:bg-[#ff5f3a]/90 font-medium h-10 transition-colors shadow-lg shadow-[#ff5f3a]/10"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Divisor Visual */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-zinc-600 text-xs">ou</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          {/* Link para criar conta */}
          <p className="text-center text-sm text-zinc-400">
            Ainda não tem conta?{' '}
            <Link 
              href="/cadastro" 
              className="text-[#ff5f3a] hover:text-[#ff5f3a]/80 font-medium inline-flex items-center gap-0.5 hover:underline transition-all"
            >
              Criar conta <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}