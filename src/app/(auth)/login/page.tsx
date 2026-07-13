'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      // Login com sucesso! Redireciona para o painel principal
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-zinc-50">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Ápice</CardTitle>
          <CardDescription className="text-zinc-400">
            Insira suas credenciais para acessar sua rota de estudos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">E-mail</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-zinc-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-zinc-400"
                required
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-red-400 text-center font-medium bg-red-950/30 py-2 rounded border border-red-900/50">
                {errorMsg}
              </p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}