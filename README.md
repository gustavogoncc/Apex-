# Apex Studies

O **Apex Studies** é uma plataforma inteligente voltada para estudantes que buscam alta performance, organização de editais e controle de rotas de estudo. O sistema permite o gerenciamento completo de disciplinas, monitoramento de progresso e análise de dados de desempenho através de um dashboard intuitivo e responsivo.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando um stack moderno e focado em escalabilidade:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
*   **Autenticação & Banco de Dados:** [Supabase](https://supabase.com/)
*   **Visualização de Dados:** [Recharts](https://recharts.org/)
*   **Ícones:** [Lucide React](https://lucide.dev/)

## ✨ Funcionalidades Principais

*   **Autenticação Segura:** Fluxo de login e cadastro integrado ao Supabase, com proteção de rotas via Middleware.
*   **Dashboard Executivo:** Visão centralizada com KPIs (Rotas, Disciplinas, Progresso) e gráficos de tendência de aprendizado.
*   **Gestão de Rotas:** Ferramentas para mapear e acompanhar o progresso de disciplinas e tópicos.
*   **Design Responsivo:** Interface "Mobile-First" com menu lateral adaptável (sidebar), garantindo uma experiência fluida em qualquer dispositivo.
*   **Minimalismo:** Foco em uma estética limpa, utilizando uma paleta de cores sofisticada e tipografia precisa.

## 🛠️ Como Instalar e Rodar

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/gustavogoncc/seu-repositorio.git](https://github.com/gustavogoncc/seu-repositorio.git)
    cd seu-repositorio
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto com as credenciais do seu Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  **Acesse:** Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🎨 Design System

O projeto utiliza uma identidade visual cuidadosamente escolhida:
*   **Cores Principais:** Dark mode (Zinc-950/900), com detalhes em Azul (#192e5b) para credibilidade e Laranja (#ff5f3a) para destaque em ações.
*   **Filosofia:** Minimalismo focado em B2B/Educational, eliminando distrações para o estudante.

## 📈 Roadmap

- [x] Autenticação e Middleware.
- [x] Dashboard com métricas.
- [x] Gráficos de evolução (Tendência de Acertos).
- [ ] Implementação do CRUD completo de Rotas de Estudo.
- [ ] Exportação de relatórios de desempenho.

---

*Projeto desenvolvido por [Gustavo Gonçalves](https://github.com/gustavogoncc).*