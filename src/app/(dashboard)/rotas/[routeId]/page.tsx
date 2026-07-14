'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, Plus, BookOpen, ArrowRight, Loader2, Trash2, CheckCircle2, Circle } from 'lucide-react'

interface Subject {
  id: string
  name: string
  created_at: string
  status?: string // Campo opcional para controlar se foi concluído
}

export default function RouteDetailsPage({ params }: { params: Promise<{ routeId: string }> }) {
  const resolvedParams = use(params)
  const routeId = resolvedParams.routeId

  const [routeName, setRouteName] = useState('Carregando...')
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectName, setSubjectName] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    
    const { data: routeData } = await supabase
      .from('study_routes')
      .select('name')
      .eq('id', routeId)
      .single()

    if (routeData) setRouteName(routeData.name)

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

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subjectName.trim()) return

    setCreating(true)
    const { error } = await supabase
      .from('subjects')
      .insert([{ name: subjectName, route_id: routeId, status: 'A_ESTUDAR' }])

    if (!error) {
      setSubjectName('')
      fetchData()
    } else {
      console.error(error)
      alert('Erro ao criar disciplina.')
    }
    setCreating(false)
  }

  const handleDeleteSubject = async (subjectId: string) => {
    const confirmDelete = confirm('Tem certeza que deseja excluir esta disciplina?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', subjectId)

    if (!error) {
      fetchData()
    } else {
      console.error(error)
      alert('Erro ao excluir disciplina. Verifique as restrições do banco.')
    }
  }

  const toggleSubjectStatus = async (subject: Subject) => {
    const newStatus = subject.status === 'CONCLUIDO' ? 'A_ESTUDAR' : 'CONCLUIDO'
    
    const { error } = await supabase
      .from('subjects')
      .update({ status: newStatus })
      .eq('id', subject.id)

    if (!error) {
      fetchData()
    } else {
      console.error(error)
      alert('Erro ao atualizar status da disciplina.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href="/rotas" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors w-fit">
          <ChevronLeft className="h-4 w-4" /> Voltar para rotas
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">{routeName}</h1>
        <p className="text-zinc-400 text-sm">Organize as matérias e tópicos que você precisa estudar para este objetivo.</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Adicionar Disciplina / Matéria</CardTitle>
          <CardDescription className="text-zinc-400">
            Insira os blocos principais de estudo (ex: Língua Portuguesa, Direito Constitucional).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubject} className="flex gap-4">
            <Input
              type="text"
              placeholder="Nome da matéria (ex: Informática)..."
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus-visible:ring-[#192e5b] max-w-md"
              required
            />
            <Button type="submit" disabled={creating} className="bg-[#ff5f3a] text-white hover:bg-[#ff5f3a]/90 whitespace-nowrap">
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

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-50">Grade de Disciplinas</h2>
        
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando disciplinas...
          </div>
        ) : subjects.length === 0 ? (
          <p className="text-zinc-500 text-sm italic">Nenhuma matéria adicionada a este objetivo ainda.</p>
        ) : (
          <div className="grid gap-3">
            {subjects.map((subject) => {
              const isCompleted = subject.status === 'CONCLUIDO'
              return (
                <div 
                  key={subject.id} 
                  className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                    isCompleted 
                      ? 'border-zinc-800/50 bg-zinc-950/20 opacity-75' 
                      : 'border-zinc-800 bg-zinc-900/30 hover:border-[#192e5b]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Botão de Checkbox para concluir */}
                    <button 
                      onClick={() => toggleSubjectStatus(subject)} 
                      className="text-zinc-500 hover:text-emerald-500 transition-colors focus:outline-none"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>

                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border transition-colors ${
                        isCompleted 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-[#192e5b]/20 text-[#192e5b] border-[#192e5b]/30'
                      }`}>
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <span className={`font-medium transition-all ${
                        isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-200'
                      }`}>
                        {subject.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/rotas/${routeId}/${subject.id}`}>
                      <Button variant="outline" size="sm" className="border-zinc-700 bg-transparent text-zinc-300 hover:border-[#192e5b] hover:text-[#ff5f3a] hover:bg-zinc-800 gap-1">
                        Mapear Conteúdo <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>

                    {/* Botão de Excluir */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-zinc-800"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}