import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" className={`${inter.className} dark`}>
      <body className="bg-zinc-950 text-zinc-50 min-h-screen">
        {/* 
          Container global:
          - mx-auto: centraliza o conteúdo.
          - max-w-7xl: limita a largura máxima em telas grandes.
          - px-4 md:px-6: dá um respiro lateral, que aumenta em telas maiores.
        */}
        <main className="mx-auto w-full max-w-7xl px-4 md:px-6">
          {children}
        </main>
      </body>
    </html>
  )
}