'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, CheckCircle2, Circle, Plus, ExternalLink, BookOpen, Loader2, Trash2 } from 'lucide-react'

export default function SubjectDetailsPage({ params }: { params: Promise<{ routeId: string; subjectId: string }> }) {
  const resolvedParams = use(params)
  const { routeId, subjectId } = resolvedParams

  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [subjectName, setSubjectName] = useState('Carregando...')
  const [topics, setTopics] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  
  const [newTopicName, setNewTopicName] = useState('')
  const [difficulty, setDifficulty] = useState('MEDIO')
  const [status, setStatus] = useState('A_ESTUDAR')
  
  const [materialTitle, setMaterialTitle] = useState('')
  const [materialUrl, setMaterialUrl] = useState('')
  const [dailyGoal, setDailyGoal] = useState('')
  const [weeklyGoal, setWeeklyGoal] = useState('')

  const [qTotal, setQTotal] = useState('')
  const [qCorrect, setQCorrect] = useState('')
  const [qWrong, setQWrong] = useState('')
  
  const [creatingTopic, setCreatingTopic] = useState(false)
  const [creatingMaterial, setCreatingMaterial] = useState(false)
  const [savingGoals, setSavingGoals] = useState(false)
  const [savingQuest, setSavingQuest] = useState(false)
  const [stats, setStats] = useState({ totalSolved: 0, totalCorrect: 0, rate: 0 })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    else if (timeLeft === 0) setIsActive(false)
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const fetchData = async () => {
    const { data: s } = await supabase.from('subjects').select('*').eq('id', subjectId).single()
    if (s) {
      setSubjectName(s.name)
      setDailyGoal(s.daily_goal || '')
      setWeeklyGoal(s.weekly_goal || '')
    }
    
    const { data: t } = await supabase.from('topics').select('*').eq('subject_id', subjectId).order('created_at', { ascending: true })
    setTopics(t || [])
    
    const { data: q } = await supabase.from('questions').select('*').eq('subject_id', subjectId).order('created_at', { ascending: false })
    setQuestions(q || [])
    
    if (q) {
      const total = q.reduce((acc, curr) => acc + (Number(curr.total_solved) || 0), 0)
      const correct = q.reduce((acc, curr) => acc + (Number(curr.total_correct) || 0), 0)
      setStats({ totalSolved: total, totalCorrect: correct, rate: total > 0 ? Math.round((correct / total) * 100) : 0 })
    }
    
    const { data: m } = await supabase.from('documents').select('*').eq('subject_id', subjectId)
    setMaterials(m || [])
  }

  useEffect(() => { fetchData() }, [subjectId])

  const handleDelete = async (table: string, id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      alert("Erro ao excluir: O banco de dados bloqueou a ação. Verifique o RLS.")
      return
    }
    await fetchData()
  }

  const toggleTopicStatus = async (topic: any) => {
    const newStatus = topic.status === 'CONCLUIDO' ? 'A_ESTUDAR' : 'CONCLUIDO'
    const { error } = await supabase.from('topics').update({ status: newStatus }).eq('id', topic.id)
    if (error) {
        alert("Erro ao atualizar status. O banco de dados bloqueou a ação.")
        return
    }
    await fetchData()
  }

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTopicName.trim()) return
    setCreatingTopic(true)
    const { error } = await supabase.from('topics').insert([{ title: newTopicName.trim(), subject_id: subjectId, difficulty, status }])
    if (error) alert("Erro ao criar tópico: " + error.message)
    setNewTopicName('')
    await fetchData()
    setCreatingTopic(false)
  }

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materialTitle.trim()) return
    setCreatingMaterial(true)
    const { error } = await supabase.from('documents').insert([{ subject_id: subjectId, file_name: materialTitle, file_url: materialUrl }])
    if (error) alert("Erro ao salvar material: " + error.message)
    setMaterialTitle(''); setMaterialUrl('')
    await fetchData()
    setCreatingMaterial(false)
  }

  const handleSaveGoals = async () => {
    setSavingGoals(true)
    const { error } = await supabase.from('subjects').update({ daily_goal: dailyGoal, weekly_goal: weeklyGoal }).eq('id', subjectId)
    if (error) alert("Erro ao salvar metas: " + error.message)
    else alert("Metas atualizadas!")
    await fetchData()
    setSavingGoals(false)
  }

  const handleSaveQuestions = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingQuest(true)
    const { error } = await supabase.from('questions').insert([{ 
      subject_id: subjectId, 
      total_solved: Number(qTotal), 
      total_correct: Number(qCorrect), 
      total_wrong: Number(qWrong) 
    }])
    
    if (error) {
      alert("Erro ao salvar questões: " + error.message)
    } else {
      setQTotal(''); setQCorrect(''); setQWrong('')
      await fetchData()
    }
    setSavingQuest(false)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href={`/rotas/${routeId}`} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200">
          <ChevronLeft className="h-4 w-4" /> Voltar para a grade
        </Link>
        <h1 className="text-3xl font-bold text-zinc-50">{subjectName}</h1>
      </div>

      <Card className="border-zinc-800 bg-zinc-950 p-6 flex items-center justify-between">
        <div className="text-4xl font-mono font-bold text-[#ff5f3a]">{formatTime(timeLeft)}</div>
        <div className="flex gap-2">
          <Button className="bg-[#192e5b] hover:bg-[#192e5b]/90" onClick={() => setIsActive(!isActive)}>
            {isActive ? 'Pausar' : 'Iniciar'}
          </Button>
          <Button variant="ghost" className="text-zinc-400" onClick={() => { setIsActive(false); setTimeLeft(25 * 60) }}>Reset</Button>
        </div>
      </Card>

      <Tabs defaultValue="edital" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
          {['edital', 'questoes', 'materiais', 'metas'].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="text-zinc-400 data-[state=active]:bg-[#192e5b] data-[state=active]:text-zinc-50 capitalize">{tab}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="edital" className="mt-6 space-y-4">
          <Card className="border-zinc-800 bg-zinc-900 p-4">
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <Input placeholder="Nome do assunto" value={newTopicName} onChange={e => setNewTopicName(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
              <div className="flex gap-4">
                <Select value={difficulty} onValueChange={(val) => setDifficulty(val ?? "")}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-300"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="FACIL">Fácil</SelectItem>
                    <SelectItem value="MEDIO">Médio</SelectItem>
                    <SelectItem value="DIFICIL">Difícil</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={(val) => setStatus(val ?? "")}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-300"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="A_ESTUDAR">A Estudar</SelectItem>
                    <SelectItem value="ESTUDANDO">Estudando</SelectItem>
                    <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={creatingTopic} className="bg-[#ff5f3a] text-white">
                  {creatingTopic ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </Card>
          <div className="border border-zinc-800 rounded-lg divide-y divide-zinc-800">
            {topics.map(t => (
              <div key={t.id} className="p-4 flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => toggleTopicStatus(t)}>
                    {t.status === 'CONCLUIDO' ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-zinc-500" />}
                    <span className={t.status === 'CONCLUIDO' ? 'text-zinc-500 line-through' : ''}>{t.title}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" onClick={() => handleDelete('topics', t.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="questoes" className="mt-6 space-y-6">
          <Card className="border-zinc-800 bg-zinc-900 p-4">
            <form onSubmit={handleSaveQuestions} className="grid grid-cols-3 gap-4">
              <Input type="number" required placeholder="Total" value={qTotal} onChange={e => setQTotal(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
              <Input type="number" required placeholder="Acertos" value={qCorrect} onChange={e => setQCorrect(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
              <Input type="number" required placeholder="Erros" value={qWrong} onChange={e => setQWrong(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
              <Button type="submit" disabled={savingQuest} className="col-span-3 bg-[#ff5f3a]">Salvar Registro</Button>
            </form>
          </Card>
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-zinc-800 bg-zinc-900 p-4"><p className="text-xs text-zinc-400">Total Geral</p><p className="text-xl font-bold text-zinc-50">{stats.totalSolved}</p></Card>
            <Card className="border-zinc-800 bg-zinc-900 p-4"><p className="text-xs text-zinc-400">Acertos</p><p className="text-xl font-bold text-emerald-400">{stats.totalCorrect}</p></Card>
            <Card className="border-zinc-800 bg-zinc-900 p-4"><p className="text-xs text-zinc-400">Aproveitamento</p><p className="text-xl font-bold text-[#192e5b]">{stats.rate}%</p></Card>
          </div>
          <div className="space-y-2">
            {questions.map(q => (
              <div key={q.id} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex justify-between items-center text-sm text-zinc-300">
                <span>{q.total_solved} questões | {q.total_correct} acertos | {q.total_wrong} erros</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" onClick={() => handleDelete('questions', q.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="materiais" className="mt-6 space-y-4">
          <Card className="border-zinc-800 bg-zinc-900 p-6">
            <form onSubmit={handleCreateMaterial} className="space-y-4">
              <Input placeholder="Título" value={materialTitle} onChange={e => setMaterialTitle(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
              <Input placeholder="URL" value={materialUrl} onChange={e => setMaterialUrl(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
              <Button type="submit" disabled={creatingMaterial} className="bg-[#ff5f3a]">Salvar Material</Button>
            </form>
          </Card>
          {materials.map(m => (
            <div key={m.id} className="p-4 border border-zinc-800 bg-zinc-900 rounded-lg flex justify-between items-center text-zinc-300">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> {m.file_name}
                {m.file_url && <a href={m.file_url} target="_blank" className="text-[#ff5f3a] ml-2"><ExternalLink className="h-4 w-4" /></a>}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" onClick={() => handleDelete('documents', m.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="metas" className="mt-6 space-y-6">
          <Card className="border-zinc-800 bg-zinc-900 p-6">
            <div className="space-y-4">
              <Input placeholder="Horas/dia" value={dailyGoal} onChange={e => setDailyGoal(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
              <Input placeholder="Horas/semana" value={weeklyGoal} onChange={e => setWeeklyGoal(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
              <div className="flex gap-2">
                  <Button onClick={handleSaveGoals} disabled={savingGoals} className="bg-[#ff5f3a] flex-1">Salvar Metas</Button>
                  <Button variant="outline" className="border-zinc-700 hover:bg-red-500 hover:text-white" onClick={() => { setDailyGoal(''); setWeeklyGoal(''); setTimeout(handleSaveGoals, 100) }}>Limpar Metas</Button>
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-zinc-800 bg-zinc-950 p-4">
              <p className="text-xs text-zinc-500 uppercase">Meta Diária</p>
              <p className="text-2xl font-bold text-zinc-100">{dailyGoal || 0} <span className="text-sm font-normal text-zinc-400">horas</span></p>
            </Card>
            <Card className="border-zinc-800 bg-zinc-950 p-4">
              <p className="text-xs text-zinc-500 uppercase">Meta Semanal</p>
              <p className="text-2xl font-bold text-zinc-100">{weeklyGoal || 0} <span className="text-sm font-normal text-zinc-400">horas</span></p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}