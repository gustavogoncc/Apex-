'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, Plus, BookOpen, ArrowRight, Loader2 } from 'lucide-react'

interface Subject {
  id: string
  name: string
  created_at: string
}

export default function RouteDetailsPage({ params }: { params: Promise<{ routeId: string }> }) {
  // Desembrulha os parâmetros da URL (padrão obrigatório no Next.js 15/16)
  const resolvedParams = use(params)
  const routeId = resolvedParams.routeId

  const [routeName, setRouteName] = useState('Carregando...')
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectName, setSubjectName] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // Buscar detalhes da rota e suas disciplinas
  const fetchData = async () => {
    setLoading(true)
    
    // 1. Busca o nome da Rota atual
    const { data: routeData } = await supabase
      .from('study_routes')
      .select('name')
      .eq('id', routeId)
      .single()

    if (routeData) setRouteName(routeData.name)

    // 2. Busca as disciplinas vinculadas a esta rota
    const { data: subjectsData } = await supabase
      .from('subjects')
      .select('*')
      .eq('route_id', routeId)
      .order('created_at', { ascending: true })

    if (subjectsData) setSubjects(subjectsData)
    
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [routeId])

  // Criar nova disciplina
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subjectName.trim()) return

    setCreating(true)
    const { error } = await supabase
      .from('subjects')
      .insert([{ name: subjectName, route_id: routeId }])

    if (!error) {
      setSubjectName('')
      fetchData() // Atualiza a lista na tela
    } else {
      console.error(error)
      alert('Erro ao criar disciplina.')
    }
    setCreating(false)
  }

  return (
    <div className="space-y-8">
      {/* Botão Voltar e Título */}
      <div className="space-y-2">
        <Link href="/rotas" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors w-fit">
          <ChevronLeft className="h-4 w-4" /> Voltar para rotas
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">{routeName}</h1>
        <p className="text-zinc-400 text-sm">Organize as matérias e tópicos que você precisa estudar para este objetivo.</p>
      </div>

      {/* Formulário para Adicionar Matéria/Disciplina */}
      <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Adicionar Disciplina / Matéria</CardTitle>
          <CardDescription className="text-zinc-400">
            Insira os blocos principais de estudo (ex: Língua Portuguesa, Direito Constitucional, Banco de Dados).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubject} className="flex gap-4">
            <Input
              type="text"
              placeholder="Nome da matéria (ex: Informática)..."
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-zinc-400 max-w-md"
              required
            />
            <Button type="submit" disabled={creating} className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 whitespace-nowrap">
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Adicionar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Listagem das Matérias */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-200">Grade de Disciplinas</h2>
        
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando disciplinas...
          </div>
        ) : subjects.length === 0 ? (
          <p className="text-zinc-500 text-sm italic">Nenhuma matéria adicionada a este objetivo ainda.</p>
        ) : (
          <div className="grid gap-3">
            {subjects.map((subject) => (
              <div 
                key={subject.id} 
                className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-900/30 rounded-xl hover:bg-zinc-900/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-800/80 text-zinc-400 rounded-lg border border-zinc-700/60">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-zinc-200">{subject.name}</span>
                </div>
                
                <Link href={`/rotas/${routeId}/${subject.id}`}>
                  <Button variant="outline" size="sm" className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 gap-1">
                    Mapear Conteúdo <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}