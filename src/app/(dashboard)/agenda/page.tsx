"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Trash2, Loader2, CheckCircle2, Circle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { CreateAgendaForm } from "@/components/agenda/CreateAgendaForm"
import { EditAgendaForm } from "@/components/agenda/EditAgendaForm"
import { supabase } from "@/lib/supabase"

interface AgendaItem {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  completed: boolean
}

export default function AgendaPage() {
  const [events, setEvents] = useState<AgendaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [detailEvent, setDetailEvent] = useState<AgendaItem | null>(null)
  const [editEvent, setEditEvent] = useState<AgendaItem | null>(null)

  // Busca os compromissos locais do Supabase
  async function fetchEvents() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("agenda")
        .select("id, title, description, start_time, end_time, completed")
        .order("start_time", { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      console.error("Erro ao carregar dados:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Altera o status de concluído
  async function toggleComplete(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from("agenda")
      .update({ completed: !currentStatus })
      .eq("id", id)

    if (!error) {
      setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, completed: !currentStatus } : ev))
    } else {
      console.error("Erro ao atualizar status:", error)
    }
  }

  // Deleta compromisso
  async function handleDelete(id: string) {
    if (confirm("Deseja realmente excluir este compromisso?")) {
      const { error } = await supabase
        .from("agenda")
        .delete()
        .eq("id", id)

      if (!error) {
        fetchEvents()
      } else {
        console.error("Erro ao deletar compromisso:", error)
      }
    }
  }

  const formatDateTime = (isoString: string) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-100">Agenda</h1>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger render={<Button className="bg-[#ff5f3a] hover:bg-[#e65535] text-white" />}>
            Novo Compromisso
          </DialogTrigger>
          
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-zinc-100">Novo Compromisso</DialogTitle>
            </DialogHeader>
            <CreateAgendaForm onSuccess={() => {
              setIsCreateOpen(false)
              fetchEvents()
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-zinc-800 bg-zinc-900 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h3 className="text-lg font-medium text-zinc-100">Seus Próximos Eventos</h3>
          <Button 
            variant="outline" 
            size="icon" 
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            onClick={fetchEvents}
            title="Atualizar"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8 text-zinc-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#ff5f3a]" />
            <span>Carregando...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="text-zinc-500 italic text-sm py-4">
            Nenhum compromisso agendado ainda.
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div 
                key={event.id} 
                className={`p-4 rounded-lg bg-zinc-950 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  event.completed 
                    ? "border-emerald-500/20 opacity-60 bg-zinc-950/40" 
                    : "border-zinc-800/60 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start gap-3 max-w-xl">
                  <button 
                    onClick={() => toggleComplete(event.id, event.completed)}
                    className="mt-1 flex-shrink-0 transition-transform active:scale-95"
                  >
                    {event.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-zinc-600 hover:text-emerald-500" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <h4 className={`font-medium transition-all ${
                      event.completed ? "line-through text-zinc-500" : "text-zinc-100"
                    }`}>
                      {event.title}
                    </h4>
                    {event.description && (
                      <p className={`text-sm line-clamp-1 ${
                        event.completed ? "text-zinc-600" : "text-zinc-400"
                      }`}>
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 justify-between md:justify-end">
                  <div className="text-xs text-zinc-400 space-y-1">
                    <p><span className="text-zinc-500">Início:</span> {formatDateTime(event.start_time)}</p>
                    <p><span className="text-zinc-500">Fim:</span> {formatDateTime(event.end_time)}</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                      onClick={() => setDetailEvent(event)}
                    >
                      Detalhes
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-zinc-400 hover:text-[#ff5f3a] hover:bg-zinc-900"
                      onClick={() => setEditEvent(event)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-zinc-500 hover:text-red-400 hover:bg-zinc-900"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={!!detailEvent} onOpenChange={(open) => !open && setDetailEvent(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-md">
          <DialogHeader><DialogTitle>Detalhes</DialogTitle></DialogHeader>
          {detailEvent && (
            <div className="space-y-4 pt-4">
              <p className="text-lg font-medium">{detailEvent.title}</p>
              <p className="text-zinc-300 text-sm">{detailEvent.description || "Sem descrição."}</p>
              <div className="grid grid-cols-2 gap-4 text-xs text-zinc-400">
                <p>Início: {formatDateTime(detailEvent.start_time)}</p>
                <p>Fim: {formatDateTime(detailEvent.end_time)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editEvent} onOpenChange={(open) => !open && setEditEvent(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-md">
          <DialogHeader><DialogTitle>Editar Compromisso</DialogTitle></DialogHeader>
          {editEvent && (
            <EditAgendaForm 
              event={editEvent} 
              onSuccess={() => {
                setEditEvent(null)
                fetchEvents()
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}