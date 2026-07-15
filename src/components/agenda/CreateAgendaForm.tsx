"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export function CreateAgendaForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      // 1. Busca o usuário autenticado atual do Supabase Auth
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error("Usuário não autenticado:", userError)
        setLoading(false)
        return
      }

      // 2. Insere o compromisso passando o 'user_id' para passar pela segurança RLS
      const { error } = await supabase.from("agenda").insert({
        user_id: user.id, // <-- CRUCIAL: Vincula o compromisso ao ID do usuário autenticado
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        start_time: formData.get("start_time") as string,
        end_time: formData.get("end_time") as string,
      })

      if (!error) {
        onSuccess()
      } else {
        console.error("Erro retornado pelo Supabase:", error)
      }
    } catch (err) {
      console.error("Erro inesperado ao salvar compromisso:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        name="title" 
        placeholder="Título do compromisso" 
        required 
        className="bg-zinc-950 border-zinc-800 text-zinc-100"
      />
      
      <textarea
        name="description"
        placeholder="Descrição (opcional)"
        className="flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Início</label>
          <Input 
            type="datetime-local" 
            name="start_time" 
            required 
            className="bg-zinc-950 border-zinc-800 text-zinc-100 [color-scheme:dark]" 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Fim</label>
          <Input 
            type="datetime-local" 
            name="end_time" 
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
        {loading ? "Salvando..." : "Salvar Compromisso"}
      </Button>
    </form>
  )
}