'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ChevronLeft, CheckCircle2, Circle, Plus, ExternalLink, BookOpen, Loader2, Trash2, Calendar, Link as LinkIcon, FileText } from 'lucide-react'

export default function SubjectDetailsPage({ params }: { params: Promise<{ routeId: string; subjectId: string }> }) {
  const resolvedParams = use(params)
  const { routeId, subjectId } = resolvedParams

  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [subjectName, setSubjectName] = useState('Carregando...')
  
  // Estados de dados
  const [topics, setTopics] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  
  // Estados de formulário - Tópicos
  const [newTopicName, setNewTopicName] = useState('')
  const [difficulty, setDifficulty] = useState('MEDIO')
  const [status, setStatus] = useState('A_ESTUDAR')
  
  // Estados de formulário - Anotações
  const [noteTitle, setNoteTitle] = useState('')
  const [noteDescription, setNoteDescription] = useState('')
  const [noteUrl, setNoteUrl] = useState('')
  
  // Estados de formulário - Metas e Questões
  const [dailyGoal, setDailyGoal] = useState('')
  const [weeklyGoal, setWeeklyGoal] = useState('')
  const [qTotal, setQTotal] = useState('')
  const [qCorrect, setQCorrect] = useState('')
  const [qWrong, setQWrong] = useState('')
  
  // Loaders
  const [creatingTopic, setCreatingTopic] = useState(false)
  const [creatingNote, setCreatingNote] = useState(false)
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
    
    const { data: n } = await supabase.from('notes').select('*').eq('subject_id', subjectId).order('created_at', { ascending: false })
    setNotes(n || [])
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

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteTitle.trim() || !noteDescription.trim()) return
    setCreatingNote(true)
    
    const { error } = await supabase.from('notes').insert([{
      subject_id: subjectId,
      title: noteTitle.trim(),
      description: noteDescription.trim(),
      url: noteUrl.trim() ? noteUrl.trim() : null
    }])
    
    if (error) {
      alert("Erro ao salvar anotação: " + error.message)
    } else {
      setNoteTitle('')
      setNoteDescription('')
      setNoteUrl('')
      await fetchData()
    }
    setCreatingNote(false)
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

  const getDisplayDate = (note: any) => {
    const dateToFormat = note.updated_at || note.created_at
    const isModified = !!note.updated_at
    const formattedDate = new Date(dateToFormat).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
    return isModified ? `Modificado em ${formattedDate}` : `Criado em ${formattedDate}`
  }

  const tabList = [
    { value: 'edital', label: 'Edital' },
    { value: 'questoes', label: 'Questões' },
    { value: 'anotacoes', label: 'Anotações' },
    { value: 'metas', label: 'Metas' }
  ]

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
          {tabList.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-zinc-400 data-[state=active]:bg-[#192e5b] data-[state=active]:text-zinc-50 capitalize">
              {tab.label}
            </TabsTrigger>
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
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-800">Detalhes</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <DialogHeader><DialogTitle>{t.title}</DialogTitle></DialogHeader>
                      <div className="space-y-4 pt-4">
                        <p><span className="text-zinc-500">Nivel:</span> {t.difficulty}</p>
                        <p><span className="text-zinc-500">Status:</span> {t.status}</p>
                        <div className="p-4 bg-zinc-950 rounded-md border border-zinc-800 min-h-[100px]">
                          <p className="text-sm text-zinc-300">{t.description || "Sem descricao."}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger>
                      <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700">Editar</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <DialogHeader><DialogTitle>Editar Assunto</DialogTitle></DialogHeader>
                      <EditTopicForm topic={t} onSave={fetchData} />
                    </DialogContent>
                  </Dialog>

                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" onClick={() => handleDelete('topics', t.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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

        <TabsContent value="anotacoes" className="mt-6 space-y-4">
          <Card className="border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-zinc-100">Nova Anotação</h3>
              <p className="text-sm text-zinc-400">Adicione resumos, tópicos ou links úteis.</p>
            </div>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <Input placeholder="Título da anotação..." required value={noteTitle} onChange={e => setNoteTitle(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
              <textarea placeholder="Digite suas anotações aqui..." required value={noteDescription} onChange={(e) => setNoteDescription(e.target.value)} className="flex min-h-[120px] w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#192e5b] resize-y" />
              <Input type="url" placeholder="URL / Link de Apoio (Opcional)" value={noteUrl} onChange={e => setNoteUrl(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
              <Button type="submit" disabled={creatingNote} className="bg-[#ff5f3a]">
                {creatingNote ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Salvar Anotação
              </Button>
            </form>
          </Card>
          {notes.length === 0 ? (
            <p className="text-zinc-500 text-sm italic text-center pt-4">Nenhuma anotação criada ainda.</p>
          ) : (
            <div className="grid gap-4 mt-6">
              {notes.map(note => (
                <Card key={note.id} className="border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#192e5b]" /> {note.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {getDisplayDate(note)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500 -mt-1 -mr-1" onClick={() => handleDelete('notes', note.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {note.description}
                  </div>
                  {note.url && (
                    <div className="pt-3 border-t border-zinc-800/60 mt-1">
                      <a href={note.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-[#ff5f3a] hover:text-[#ff5f3a]/80">
                        <LinkIcon className="h-3 w-3 mr-1.5" />
                        Acessar Material Anexo
                      </a>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
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

  function EditTopicForm({ topic, onSave }: { topic: any, onSave: () => void }) {
  const [desc, setDesc] = useState(topic.description || '')
  const [diff, setDiff] = useState(topic.difficulty)
  const [stat, setStat] = useState(topic.status)

  const handleUpdate = async () => {
    await supabase.from('topics').update({ 
      description: desc, 
      difficulty: diff, 
      status: stat 
    }).eq('id', topic.id)
    onSave()
  }

  return (
    <div className="space-y-4 pt-4">
      <textarea 
        className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-zinc-100 min-h-[100px]" 
        placeholder="Descrição do assunto..." 
        value={desc} 
        onChange={(e) => setDesc(e.target.value)} 
      />
      <Select value={diff} onValueChange={setDiff}>
        <SelectTrigger className="bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="FACIL">Fácil</SelectItem>
            <SelectItem value="MEDIO">Médio</SelectItem>
            <SelectItem value="DIFICIL">Difícil</SelectItem>
        </SelectContent>
      </Select>
      <Select value={stat} onValueChange={setStat}>
        <SelectTrigger className="bg-zinc-800 border-zinc-700"><SelectValue /></SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="A_ESTUDAR">A Estudar</SelectItem>
            <SelectItem value="ESTUDANDO">Estudando</SelectItem>
            <SelectItem value="CONCLUIDO">Concluído</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleUpdate} className="w-full bg-[#ff5f3a]">Salvar Alterações</Button>
    </div>
  )
}
}