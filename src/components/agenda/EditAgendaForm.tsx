"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

interface AgendaItem {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  completed: boolean
}

export function EditAgendaForm({ 
  event, 
  onSuccess 
}: { 
  event: AgendaItem
  onSuccess: () => void 
}) {
  const [loading, setLoading] = useState(false)

  // Converte string ISO do Supabase de forma segura para o input datetime-local do navegador
  const formatToLocalDatetime = (isoString: string) => {
    const date = new Date(isoString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const { error } = await supabase
      .from("agenda")
      .update({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        start_time: formData.get("start_time") as string,
        end_time: formData.get("end_time") as string,
      })
      .eq("id", event.id)

    if (!error) {
      onSuccess()
    } else {
      console.error("Erro ao atualizar compromisso:", error)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        name="title" 
        defaultValue={event.title}
        placeholder="Título do compromisso" 
        required 
        className="bg-zinc-950 border-zinc-800 text-zinc-100"
      />
      
      <textarea
        name="description"
        defaultValue={event.description || ""}
        placeholder="Descrição (opcional)"
        className="flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Início</label>
          <Input 
            type="datetime-local" 
            name="start_time" 
            defaultValue={formatToLocalDatetime(event.start_time)}
            required 
            className="bg-zinc-950 border-zinc-800 text-zinc-100 [color-scheme:dark]" 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Fim</label>
          <Input 
            type="datetime-local" 
            name="end_time" 
            defaultValue={formatToLocalDatetime(event.end_time)}
            required 
            className="bg-zinc-950 border-zinc-800 text-zinc-100 [color-scheme:dark]" 
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#ff5f3a] hover:bg-[#e65535] text-white" 
        disabled={loading}
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  )
}