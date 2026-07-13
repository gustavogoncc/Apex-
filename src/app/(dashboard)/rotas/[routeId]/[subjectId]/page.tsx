'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, Plus, CheckCircle2, Circle, BarChart3, FileText, Loader2, Target, Award, Link2, ExternalLink } from 'lucide-react'

interface Topic {
  id: string
  title: string
  completed: boolean
}

interface QuestionLog {
  id: string
  total_questions: number
  correct_answers: number
  created_at: string
}

interface Material {
  id: string
  title: string
  url?: string
  notes?: string
  created_at: string
}

export default function SubjectDetailsPage({ 
  params 
}: { 
  params: Promise<{ routeId: string; subjectId: string }> 
}) {
  const resolvedParams = use(params)
  const { routeId, subjectId } = resolvedParams

  const [subjectName, setSubjectName] = useState('Carregando...')
  const [topics, setTopics] = useState<Topic[]>([])
  const [questionLogs, setQuestionLogs] = useState<QuestionLog[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  
  const [newTopicName, setNewTopicName] = useState('')
  const [totalQ, setTotalQ] = useState('')
  const [correctQ, setCorrectQ] = useState('')
  const [materialTitle, setMaterialTitle] = useState('')
  const [materialUrl, setMaterialUrl] = useState('')
  const [materialNotes, setMaterialNotes] = useState('')

  const [loading, setLoading] = useState(true)
  const [creatingTopic, setCreatingTopic] = useState(false)
  const [sendingQuestions, setSendingQuestions] = useState(false)
  const [creatingMaterial, setCreatingMaterial] = useState(false)

  const [stats, setStats] = useState({ totalSolved: 0, totalCorrect: 0, rate: 0 })

  const fetchData = async () => {
    setLoading(true)
    
    const { data: subjectData } = await supabase.from('subjects').select('name').eq('id', subjectId).single()
    if (subjectData) setSubjectName(subjectData.name)

    const { data: topicsData, error: topicsError } = await supabase
      .from('topics')
      .select('id, title, completed')
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: true })
    
    if (topicsData) setTopics(topicsData)
    if (topicsError) console.error('Erro ao buscar tópicos:', topicsError)

    const { data: logsData } = await supabase.from('question_logs').select('*').eq('subject_id', subjectId).order('created_at', { ascending: false })
    if (logsData) {
      setQuestionLogs(logsData)
      const solved = logsData.reduce((acc, curr) => acc + curr.total_questions, 0)
      const correct = logsData.reduce((acc, curr) => acc + curr.correct_answers, 0)
      setStats({ totalSolved: solved, totalCorrect: correct, rate: solved > 0 ? Math.round((correct / solved) * 100) : 0 })
    }

    const { data: materialsData } = await supabase.from('subject_materials').select('*').eq('subject_id', subjectId).order('created_at', { ascending: false })
    if (materialsData) setMaterials(materialsData)

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [subjectId])

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTopicName.trim()) return
    setCreatingTopic(true)
    
    const { error } = await supabase
      .from('topics')
      .insert([{ title: newTopicName.trim(), subject_id: subjectId, completed: false }])
    
    if (error) {
      console.error('Erro ao criar tópico:', error)
      alert(`Erro ao salvar assunto: ${error.message}`)
    } else { 
      setNewTopicName('')
      fetchData()
    }
    setCreatingTopic(false)
  }

  const toggleTopicCompletion = async (topicId: string, currentStatus: boolean) => {
    const { error } = await supabase.from('topics').update({ completed: !currentStatus }).eq('id', topicId)
    if (!error) {
      setTopics(topics.map(t => t.id === topicId ? { ...t, completed: !currentStatus } : t))
    }
  }

  const handleLogQuestions = async (e: React.FormEvent) => {
    e.preventDefault()
    const total = parseInt(totalQ)
    const correct = parseInt(correctQ)
    if (isNaN(total) || isNaN(correct) || total <= 0 || correct < 0 || correct > total) return

    setSendingQuestions(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase.from('question_logs').insert([{ subject_id: subjectId, user_id: user.id, total_questions: total, correct_answers: correct }])
      if (!error) { setTotalQ(''); setCorrectQ(''); fetchData(); }
    }
    setSendingQuestions(false)
  }

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materialTitle.trim()) return

    setCreatingMaterial(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase.from('subject_materials').insert([
        { subject_id: subjectId, user_id: user.id, title: materialTitle, url: materialUrl.trim() || null, notes: materialNotes.trim() || null }
      ])
      if (!error) {
        setMaterialTitle(''); setMaterialUrl(''); setMaterialNotes(''); fetchData()
      }
    }
    setCreatingMaterial(false)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href={`/rotas/${routeId}`} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors w-fit">
          <ChevronLeft className="h-4 w-4" /> Voltar para a grade
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">{subjectName}</h1>
        <p className="text-zinc-400 text-sm">Controle seu edital, métricas de simulados e anotações centrais.</p>
      </div>

      <Tabs defaultValue="edital" className="w-full space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 text-zinc-400">
          <TabsTrigger value="edital" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50">Edital Verticalizado</TabsTrigger>
          <TabsTrigger value="questoes" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50">Questões & Desempenho</TabsTrigger>
          <TabsTrigger value="materiais" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50">Materiais de Apoio</TabsTrigger>
        </TabsList>

        <TabsContent value="edital" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
            <CardHeader><CardTitle className="text-base font-medium">Mapear Novo Assunto</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTopic} className="flex gap-4">
                <Input type="text" placeholder="Ex: Sintaxe da Oração..." value={newTopicName} onChange={e => setNewTopicName(e.target.value)} className="border-zinc-700 bg-zinc-800 text-zinc-100 max-w-md" required />
                <Button type="submit" disabled={creatingTopic} className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
                  {creatingTopic ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />} Mapear
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="border border-zinc-800 bg-zinc-900/20 rounded-xl divide-y divide-zinc-850">
            {loading ? (
              <div className="p-4 flex items-center gap-2 text-zinc-400 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Carregando edital...</div>
            ) : topics.length === 0 ? (
              <p className="p-4 text-zinc-500 text-sm italic">Nenhum assunto cadastrado para esta matéria.</p>
            ) : (
              topics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleTopicCompletion(topic.id, topic.completed)} className="text-zinc-400 hover:text-zinc-100 transition-colors">
                      {topic.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Circle className="h-5 w-5 text-zinc-600" />}
                    </button>
                    <span className={`text-sm font-medium ${topic.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>{topic.title}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="questoes" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
              <CardContent className="pt-4 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-zinc-500" />
                <div><p className="text-xs text-zinc-400 font-medium">Resolvidas</p><p className="text-xl font-bold">{stats.totalSolved}</p></div>
              </CardContent>
            </Card>
            <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
              <CardContent className="pt-4 flex items-center gap-3">
                <Target className="h-8 w-8 text-zinc-500" />
                <div><p className="text-xs text-zinc-400 font-medium">Acertos</p><p className="text-xl font-bold text-emerald-400">{stats.totalCorrect}</p></div>
              </CardContent>
            </Card>
            <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
              <CardContent className="pt-4 flex items-center gap-3">
                <Award className="h-8 w-8 text-zinc-500" />
                <div><p className="text-xs text-zinc-400 font-medium">Aproveitamento</p><p className="text-xl font-bold text-blue-400">{stats.rate}%</p></div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
            <CardHeader><CardTitle className="text-base font-medium">Registrar Sessão de Exercícios</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleLogQuestions} className="flex flex-wrap items-end gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-medium">Total de Questões</label>
                  <Input type="number" placeholder="Ex: 20" value={totalQ} onChange={e => setTotalQ(e.target.value)} className="border-zinc-700 bg-zinc-800 text-zinc-100 w-32" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-medium">Quantidade de Acertos</label>
                  <Input type="number" placeholder="Ex: 15" value={correctQ} onChange={e => setCorrectQ(e.target.value)} className="border-zinc-700 bg-zinc-800 text-zinc-100 w-32" required />
                </div>
                <Button type="submit" disabled={sendingQuestions} className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
                  {sendingQuestions ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar Registro'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300">Histórico de Treinos</h3>
            <div className="border border-zinc-800 bg-zinc-900/20 rounded-xl divide-y divide-zinc-850">
              {questionLogs.length === 0 ? (
                <p className="p-4 text-zinc-500 text-sm italic">Nenhum exercício registrado para esta matéria ainda.</p>
              ) : (
                questionLogs.map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between text-sm">
                    <div className="text-zinc-400">Feito em: <span className="text-zinc-300">{new Date(log.created_at).toLocaleDateString('pt-BR')}</span></div>
                    <div className="font-medium text-zinc-200">{log.correct_answers} acertos de {log.total_questions} ({Math.round((log.correct_answers / log.total_questions) * 100)}%)</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="materiais" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
            <CardHeader><CardTitle className="text-base font-medium">Adicionar Link ou Anotação</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMaterial} className="space-y-4 max-w-xl">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-medium">Título do Recurso</label>
                  <Input type="text" placeholder="Ex: Playlist Completa de Sintaxe no YT..." value={materialTitle} onChange={e => setMaterialTitle(e.target.value)} className="border-zinc-700 bg-zinc-800 text-zinc-100" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-medium">URL / Link (Opcional)</label>
                  <Input type="url" placeholder="https://..." value={materialUrl} onChange={e => setMaterialUrl(e.target.value)} className="border-zinc-700 bg-zinc-800 text-zinc-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-medium">Observações (Opcional)</label>
                  <Input type="text" placeholder="Senha do PDF, resumos..." value={materialNotes} onChange={e => setMaterialNotes(e.target.value)} className="border-zinc-700 bg-zinc-800 text-zinc-100" />
                </div>
                <Button type="submit" disabled={creatingMaterial} className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
                  {creatingMaterial ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />} Salvar Material
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300">Seus Materiais Guardados</h3>
            {loading ? (
              <div className="flex items-center gap-2 text-zinc-400 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Carregando materiais...</div>
            ) : materials.length === 0 ? (
              <div className="border border-zinc-800 bg-zinc-900/10 rounded-xl p-6 text-center">
                <FileText className="h-6 w-6 text-zinc-600 mx-auto mb-2" />
                <p className="text-zinc-500 text-sm italic">Nenhum link ou anotação ainda.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {materials.map((mat) => (
                  <Card key={mat.id} className="border-zinc-800 bg-zinc-900/40 text-zinc-50 hover:bg-zinc-900/60 transition-colors">
                    <CardContent className="p-4 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-medium text-zinc-200"><Link2 className="h-4 w-4 text-zinc-500" /> {mat.title}</div>
                        {mat.notes && <p className="text-xs text-zinc-400 pl-6">{mat.notes}</p>}
                      </div>
                      {mat.url && (
                        <a href={mat.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-1">Acessar <ExternalLink className="h-3.5 w-3.5" /></Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}