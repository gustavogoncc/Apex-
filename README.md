# Apex Studies

O **Apex Studies** é uma plataforma voltada para estudantes que buscam mais clareza, organização e controle sobre seus estudos.

O sistema permite organizar rotas de estudo, disciplinas e sessões, acompanhar indicadores de utilização e visualizar informações relevantes através de dashboards responsivos.

Além da área destinada aos estudantes, o APEX possui uma **área administrativa exclusiva**, destinada ao acompanhamento da utilização da plataforma e dos principais indicadores do sistema.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando um stack moderno, com foco em simplicidade, segurança e escalabilidade:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes de interface:** shadcn/ui
* **Autenticação & Banco de Dados:** [Supabase](https://supabase.com/)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Visualização de dados:** SVG integrado ao React

---

## ✨ Funcionalidades

### 👨‍🎓 Área do estudante

* **Autenticação:** Login e cadastro de usuários utilizando o Supabase Auth.
* **Dashboard:** Visão centralizada das principais informações de estudo.
* **Rotas de estudo:** Criação e organização de rotas de estudo.
* **Disciplinas:** Organização das disciplinas utilizadas nas rotas.
* **Sessões de estudo:** Registro e acompanhamento das sessões realizadas.
* **Acompanhamento:** Visualização do progresso e dos principais indicadores de estudo.
* **Design responsivo:** Interface adaptada para diferentes tamanhos de tela.
* **Interface minimalista:** Design focado em clareza, organização e redução de distrações.

---

## 🛡️ Área Administrativa

O APEX possui uma área administrativa separada da experiência dos estudantes.

O acesso administrativo é protegido por autenticação e validação da função do usuário através da tabela `user_roles`.

### 🔐 Acesso administrativo

O fluxo administrativo possui:

* Login exclusivo para administradores.
* Validação da sessão autenticada.
* Verificação da `role` do usuário.
* Acesso permitido somente para usuários com `role = admin`.
* Utilização da chave administrativa do Supabase exclusivamente no servidor.

A área administrativa está organizada separadamente da área comum dos estudantes.

### 📊 Indicadores administrativos

O dashboard administrativo apresenta atualmente:

* **Usuários cadastrados**
* **Usuários ativos**
* **Novos cadastros**
* **Rotas de estudo**
* **Sessões realizadas**
* **Disciplinas**

Os indicadores são obtidos diretamente das informações atuais do Supabase.

### 📈 Atividade da plataforma

O painel administrativo também apresenta um gráfico com:

* Novos cadastros realizados nos últimos 30 dias.
* Quantidade de novos usuários agrupada por dia.
* Dias sem cadastro representados com valor `0`.
* Total de cadastros realizados no período.

A atividade administrativa é carregada através da action:

```text
src/actions/admin/getAdminActivity.ts
```

Enquanto os indicadores gerais são obtidos através de:

```text
src/actions/admin/getAdminStats.ts
```

---

## 🗂️ Estrutura administrativa

A área administrativa segue uma estrutura independente dentro do App Router:

```text
src/
├── actions/
│   └── admin/
│       ├── getAdminActivity.ts
│       └── getAdminStats.ts
│
└── app/
    └── (admin)/
        ├── login/
        │   └── page.tsx
        │
        └── page.tsx
```

A separação permite manter as responsabilidades da área administrativa isoladas da experiência dos estudantes.

---

## 🔒 Segurança

A área administrativa utiliza duas camadas principais de validação:

1. **Autenticação**
2. **Autorização administrativa**

O usuário precisa possuir uma sessão válida e também possuir a função administrativa registrada em:

```text
user_roles
```

com:

```text
role = admin
```

A chave administrativa do Supabase é utilizada somente em Server Actions e nunca deve ser exposta ao cliente.

---

## 🛠️ Como Instalar e Rodar

### 1. Clone o repositório

```bash
git clone https://github.com/gustavogoncc/seu-repositorio.git
cd seu-repositorio
```

### 2. Instale as dependências

```bash
npm install
```

ou:

```bash
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SECRET_KEY=sua_chave_secreta_aqui
```

### ⚠️ Sobre `SUPABASE_SECRET_KEY`

A variável `SUPABASE_SECRET_KEY` é utilizada exclusivamente no servidor para operações administrativas do Supabase.

**Nunca utilize essa chave em código executado no navegador e nunca a versione no Git.**

As variáveis `NEXT_PUBLIC_*` podem ser utilizadas pelo cliente, enquanto `SUPABASE_SECRET_KEY` deve permanecer exclusivamente no ambiente do servidor.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

### 5. Acesse

Abra:

```text
http://localhost:3000
```

---

## 🌐 Ambiente de Produção

Em produção, as mesmas variáveis utilizadas localmente precisam estar configuradas no provedor de hospedagem:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...
```

Após adicionar ou alterar variáveis de ambiente, é necessário realizar um novo deploy para que elas estejam disponíveis na aplicação.

---

## 🎨 Design System

O projeto utiliza uma identidade visual baseada em uma interface escura, minimalista e orientada à produtividade.

### Cores principais

* **Background:** Zinc 950 / Zinc 900
* **Azul:** `#192e5b`
* **Laranja:** `#ff5f3a`
* **Texto:** Tons claros de Zinc
* **Elementos secundários:** Tons de Zinc e transparências

### Filosofia

O design busca:

* Clareza
* Organização
* Hierarquia visual
* Baixa distração
* Responsividade
* Interface limpa
* Foco na produtividade

A área administrativa segue a mesma identidade visual da plataforma, mantendo uma experiência consistente.

---

## 📊 Indicadores atuais do Admin

Atualmente o painel administrativo acompanha:

| Indicador | Fonte |
|---|---|
| Usuários cadastrados | Supabase Auth |
| Usuários ativos | Supabase Auth |
| Novos cadastros | Supabase Auth |
| Rotas de estudo | `study_routes` |
| Sessões realizadas | `study_sessions` |
| Disciplinas | `subjects` |

O gráfico de atividade utiliza os dados de criação das contas no Supabase Auth para construir a série dos últimos 30 dias.

---

## 📈 Roadmap

### Concluído

- [x] Autenticação de usuários.
- [x] Login e cadastro.
- [x] Dashboard do estudante.
- [x] Gestão de rotas de estudo.
- [x] Gestão de disciplinas.
- [x] Registro de sessões de estudo.
- [x] Indicadores do dashboard.
- [x] Interface responsiva.
- [x] Área administrativa.
- [x] Login exclusivo do administrador.
- [x] Controle de acesso por `role`.
- [x] Indicadores administrativos.
- [x] Contagem de usuários cadastrados.
- [x] Contagem de usuários ativos.
- [x] Contagem de novos cadastros.
- [x] Contagem de rotas de estudo.
- [x] Contagem de sessões realizadas.
- [x] Contagem de disciplinas.
- [x] Gráfico de novos cadastros dos últimos 30 dias.
- [x] Favicon do APEX.

### Próximos passos

- [ ] Evolução das análises administrativas conforme novas demandas.
- [ ] Melhorias e novos indicadores de utilização da plataforma.
- [ ] CRUD completo de rotas de estudo.
- [ ] Exportação de relatórios de desempenho.
- [ ] Novos recursos de acompanhamento e análise de estudos.

---

## 📁 Organização das principais actions

As operações administrativas estão separadas em Server Actions específicas:

```text
src/actions/admin/
├── getAdminActivity.ts
└── getAdminStats.ts
```

### `getAdminStats`

Responsável pelos indicadores gerais:

```text
Usuários
Usuários ativos
Novos cadastros
Rotas
Sessões
Disciplinas
```

### `getAdminActivity`

Responsável pelos dados temporais utilizados no gráfico de atividade:

```text
Cadastros por dia
Últimos 30 dias
```

Essa separação permite que novos indicadores sejam adicionados posteriormente sem concentrar toda a lógica administrativa em uma única action.

---

## 👨‍💻 Autor

Projeto desenvolvido por **[Gustavo Gonçalves](https://github.com/gustavogoncc)**.

---

**Apex Studies — Organize seus estudos com mais clareza e evolua com propósito.**
