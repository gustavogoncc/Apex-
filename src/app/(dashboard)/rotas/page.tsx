'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Folder, ArrowRight, Loader2 } from 'lucide-react'

interface Route {
  id: string
  name: string
  created_at: string
}

export default function RotasPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [routeName, setRouteName] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // 1. Buscar as rotas do usuário logado no banco de dados
  const fetchRoutes = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data, error } = await supabase
        .from('study_routes')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setRoutes(data)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  // 2. Inserir uma nova rota atrelada ao ID do usuário
  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!routeName.trim()) return

    setCreating(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { error } = await supabase
        .from('study_routes')
        .insert([{ name: routeName, user_id: user.id }])

      if (!error) {
        setRouteName('')
        fetchRoutes() // Atualiza a lista automaticamente na tela
      } else {
        console.error('Erro ao criar rota:', error.message)
        alert('Erro ao salvar. Certifique-se de que as políticas RLS estão configuradas.')
      }
    }
    setCreating(false)
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho da página */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minhas Rotas de Estudo</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Gerencie e organize seus caminhos de aprendizado para concursos e projetos.
        </p>
      </div>

      {/* Formulário de Criação rápida */}
      <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Nova Rota de Estudos</CardTitle>
          <CardDescription className="text-zinc-400">
            Dê um nome para o seu objetivo atual (ex: Concurso FUB, Dev Fullstack, Foco OAB).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateRoute} className="flex gap-4">
            <Input
              type="text"
              placeholder="Digite o nome da rota..."
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-zinc-400 max-w-md"
              required
            />
            <Button type="submit" disabled={creating} className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 whitespace-nowrap">
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Criar Rota
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Grid de Exibição das Rotas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-200">Seus Objetivos</h2>
        
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando rotas...
          </div>
        ) : routes.length === 0 ? (
          <p className="text-zinc-500 text-sm italic">Nenhuma rota de estudos mapeada ainda. Crie sua primeira acima!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <Card key={route.id} className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all text-zinc-50 flex flex-col justify-between">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg text-zinc-300 border border-zinc-700">
                      <Folder className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-semibold tracking-tight">{route.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-end border-t border-zinc-800/60 pt-3">
                  <Link href={`/rotas/${route.id}`}>
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 gap-1 hover:bg-zinc-800">
                      Acessar Rota <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}