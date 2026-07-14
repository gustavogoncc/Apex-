import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Cria o cliente do Supabase para o middleware
  const supabase = createMiddlewareClient({ req, res })

  // Verifica a sessão
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define as rotas públicas (que não precisam de login)
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/cadastro')
  const isLandingPage = req.nextUrl.pathname === '/'

  // Se o usuário NÃO estiver logado e tentar acessar uma página protegida
  if (!session && !isAuthPage && !isLandingPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Se o usuário ESTIVER logado e tentar acessar login/cadastro, redireciona para o dashboard
  if (session && (isAuthPage)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

// Configura em quais rotas o middleware deve rodar
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|img).*)'],
}