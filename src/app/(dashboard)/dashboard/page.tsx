'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, LayoutDashboard, Compass, BookOpen, CheckCircle, BarChart3, Target, Award } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface ChartDataPoint {
  date: string
  'Aproveitamento (%)': number
}

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>('')
  const [loadingStats, setLoadingStats] = useState(true)
  
  // Estados para Organização e Edital
  const [totalRoutes, setTotalRoutes] = useState(0)
  const [totalSubjects, setTotalSubjects] = useState(0)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  // Estados para Desempenho Global (Questões)
  const [globalQuestions, setGlobalQuestions] = useState(0)
  const [globalCorrect, setGlobalCorrect] = useState(0)
  const [globalRate, setGlobalRate] = useState(0)
  
  // Estado para os dados do Gráfico
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    const getDashboardData = async () => {
      setLoadingStats(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserEmail(user.email ?? '')

      try {
        // 1. Busca total de Rotas Ativas
        const { count: routesCount } = await supabase.from('study_routes').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
        setTotalRoutes(routesCount || 0)

        // 2. Busca todas as rotas para amarrar as disciplinas
        const { data: userRoutes } = await supabase.from('study_routes').select('id').eq('user_id', user.id)

        if (userRoutes && userRoutes.length > 0) {
          const routeIds = userRoutes.map(r => r.id)

          // Contagem de disciplinas mapeadas
          const { count: subjectsCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true }).in('route_id', routeIds)
          setTotalSubjects(subjectsCount || 0)

          // 3. Busca tópicos para calcular progresso do edital
          const { data: subjects } = await supabase.from('subjects').select('id').in('route_id', routeIds)

          if (subjects && subjects.length > 0) {
            const subjectIds = subjects.map(s => s.id)
            const { data: topics } = await supabase.from('topics').select('completed').in('subject_id', subjectIds)

            if (topics && topics.length > 0) {
              const completed = topics.filter(t => t.completed).length
              setCompletionPercentage(Math.round((completed / topics.length) * 100))
            }
          }
        }

        // 4. Busca métricas globais e dados do gráfico
        const { data: globalLogs } = await supabase
          .from('question_logs')
          .select('total_questions, correct_answers, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true }) // Ordena do mais antigo para o mais recente para o gráfico

        if (globalLogs && globalLogs.length > 0) {
          const totalQ = globalLogs.reduce((acc, curr) => acc + curr.total_questions, 0)
          const totalC = globalLogs.reduce((acc, curr) => acc + curr.correct_answers, 0)
          
          setGlobalQuestions(totalQ)
          setGlobalCorrect(totalC)
          setGlobalRate(totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0)

          // Agrupar ou mapear dados para o gráfico por dia de treino
          const formattedPoints: ChartDataPoint[] = globalLogs.map(log => {
            const dateObj = new Date(log.created_at)
            return {
              date: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
              'Aproveitamento (%)': Math.round((log.correct_answers / log.total_questions) * 100)
            }
          })

          setChartData(formattedPoints)
        }

      } catch (err) {
        console.error('Erro ao carregar ecossistema do dashboard:', err)
      } finally {
        setLoadingStats(false)
      }
    }

    getDashboardData()
  }, [router])

  return (
    <div className="space-y-10 pb-12">
      {/* Header do Dashboard */}
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-zinc-50">
          <LayoutDashboard className="h-8 w-8 text-zinc-400" /> Dashboard
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Bem-vindo de volta, <span className="text-zinc-200 font-medium">{userEmail}</span>.
        </p>
      </div>

      {/* SEÇÃO 1: ESTADO DA PREPARAÇÃO */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">Organização & Editais</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Rotas Ativas</CardTitle>
              <Compass className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              {loadingStats ? <Loader2 className="h-7 w-7 animate-spin text-zinc-600" /> : <div className="text-3xl font-bold tracking-tight">{totalRoutes}</div>}
            </CardContent>
          </Card>
          
          <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Disciplinas Mapeadas</CardTitle>
              <BookOpen className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              {loadingStats ? <Loader2 className="h-7 w-7 animate-spin text-zinc-600" /> : <div className="text-3xl font-bold tracking-tight">{totalSubjects}</div>}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Conclusão do Edital</CardTitle>
              <CheckCircle className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              {loadingStats ? <Loader2 className="h-7 w-7 animate-spin text-zinc-600" /> : <div className="text-3xl font-bold tracking-tight">{completionPercentage}%</div>}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SEÇÃO 2: PERFORMANCE ACUMULADA */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">Desempenho Geral (Questões)</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Resolvidas</CardTitle>
              <BarChart3 className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              {loadingStats ? <Loader2 className="h-7 w-7 animate-spin text-zinc-600" /> : <div className="text-3xl font-bold tracking-tight">{globalQuestions}</div>}
            </CardContent>
          </Card>
          
          <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total de Acertos</CardTitle>
              <Target className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              {loadingStats ? <Loader2 className="h-7 w-7 animate-spin text-zinc-600" /> : <div className="text-3xl font-bold tracking-tight text-emerald-400">{globalCorrect}</div>}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Aproveitamento Médio</CardTitle>
              <Award className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {loadingStats ? <Loader2 className="h-7 w-7 animate-spin text-zinc-600" /> : <div className="text-3xl font-bold tracking-tight text-blue-400">{globalRate}%</div>}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SEÇÃO 3: GRÁFICO DE EVOLUÇÃO */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">Gráfico de Linha de Tendência</h2>
        <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
          <CardHeader>
            <CardTitle className="text-base font-medium">Evolução do Aproveitamento</CardTitle>
            <CardDescription className="text-zinc-400 text-xs">Acompanhe seu percentual de acertos ordem cronológica de treinos.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {loadingStats ? (
              <div className="h-[240px] flex items-center justify-center text-zinc-500 text-sm gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Carregando gráfico...
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-zinc-500 text-sm italic">
                Insira registros de questões dentro de suas disciplinas para gerar a linha de tendência.
              </div>
            ) : (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5', fontSize: '12px' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Area type="monotone" dataKey="Aproveitamento (%)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRate)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}