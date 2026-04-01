# REFORMA EM AÇÃO

> Plataforma SaaS para empresas brasileiras se prepararem para a Reforma Tributária  
> Base normativa: **EC 132/2023 · LC 214/2025 · LC 227/2026**

---

## Descrição

**REFORMA EM AÇÃO** é uma aplicação web full-stack que guia empresários brasileiros por uma jornada estruturada de diagnóstico e planejamento frente à Reforma Tributária (IBS, CBS, Imposto Seletivo). O sistema coleta dados operacionais e fiscais da empresa em 6 telas sequenciais, computa automaticamente um diagnóstico multi-eixo de prontidão (CRÍTICO → AVANÇADO) e gera um plano de ação personalizado com cronograma e relatório em PDF.

**Público-alvo:** PMEs do Lucro Real, Lucro Presumido e Simples Nacional.

---

## Arquitetura

```
reforma-em-acao/
├── client/          # Frontend React (SPA)
├── server/          # Backend Express (API REST)
├── shared/          # Schema compartilhado (Drizzle ORM + Zod)
├── migrations/      # SQL de criação do banco
└── script/          # Build script (esbuild)
```

### Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 · Vite 7 · TailwindCSS 4 · shadcn/ui (Radix UI) |
| Roteamento | Wouter |
| Estado / Cache | TanStack Query v5 |
| Formulários | React Hook Form + Zod |
| Backend | Express 5 · TypeScript · tsx |
| Autenticação | express-session + bcryptjs (hash bcrypt) |
| ORM | Drizzle ORM |
| Banco de Dados | PostgreSQL 14+ |
| Session Store | connect-pg-simple (PostgreSQL) |
| PDF | jsPDF |
| Build | esbuild (script customizado) |
| Deploy | Replit Autoscale |

---

## Funcionalidades

- **Autenticação segura** — login/logout com sessão persistida em PostgreSQL
- **Jornada de diagnóstico em 6 etapas**
  - Perfil Fiscal (regime, setor, faturamento)
  - Operação e Mercado (B2B/B2C, estados, perfil de compras)
  - Sistemas e NF-e (ERP, volume de notas)
  - Precificação (margens, sensibilidade, capital de giro)
  - Fornecedores (perfil Simples vs. outros regimes)
  - Contratos e Governança (cláusulas de revisão, Split Payment)
- **Diagnóstico consolidado** — score de prontidão por 5 eixos com pesos diferenciados
- **Plano de ação personalizado** — cronograma por prioridade (Crítico / Alto / Moderado)
- **Relatório Final em PDF** — exportação completa com diagnóstico e plano
- **Base de conhecimento** — artigos sobre IBS, CBS, IS, Split Payment, LC 227/2026
- **Simuladores auxiliares** — Financeiro e Simples Nacional
- **Área do usuário** — múltiplos diagnósticos por conta, edição de perfil
- **API de administração** — criação de usuários via endpoint protegido por chave

---

## Instalação

### Pré-requisitos

- Node.js 20+
- PostgreSQL 14+
- npm

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/danielhsg-png/reforma-em-acao.git
cd reforma-em-acao

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# 4. Crie as tabelas no banco de dados
npm run db:push

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
# Banco de dados PostgreSQL (obrigatório)
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco

# Segredo da sessão (obrigatório em produção — use uma string longa e aleatória)
SESSION_SECRET=mude-para-uma-string-secreta-longa

# Chave de administração para criar usuários via API (opcional)
ADMIN_KEY=reforma-admin-2025

# Porta do servidor (padrão: 5000)
PORT=5000
```

> **Atenção:** nunca commite o arquivo `.env`. Ele já está no `.gitignore`.

---

## Configuração do Banco de Dados

### Opção 1 — Drizzle (recomendado)

Sincroniza o schema automaticamente a partir de `shared/schema.ts`:

```bash
npm run db:push
```

### Opção 2 — SQL manual

Execute os arquivos na pasta `migrations/` em ordem:

```bash
psql $DATABASE_URL -f migrations/001_create_users.sql
psql $DATABASE_URL -f migrations/002_create_companies.sql
psql $DATABASE_URL -f migrations/003_create_checklist_items.sql
psql $DATABASE_URL -f migrations/004_create_implementation_tasks.sql
```

Consulte [`migrations/README.md`](migrations/README.md) para instruções detalhadas incluindo Supabase.

---

## Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

Inicia o servidor Express com hot-reload via `tsx`. Acesse em `http://localhost:5000`.

### Produção (build)

```bash
npm run build    # Compila frontend (Vite) + backend (esbuild)
npm run start    # Inicia o servidor compilado
```

O build gera:
- `dist/public/` — assets estáticos do frontend
- `dist/index.cjs` — bundle do servidor Node.js

---

## Deploy

### Replit (configuração atual)

O projeto já está configurado para Replit Autoscale em `.replit`:

```toml
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["node", "./dist/index.cjs"]
```

### Railway / Render / Fly.io

1. Defina as variáveis de ambiente no painel da plataforma
2. Configure o comando de build: `npm run build`
3. Configure o comando de start: `node ./dist/index.cjs`
4. Garanta que `DATABASE_URL` aponta para um PostgreSQL externo

### Supabase (banco de dados)

Use o SQL Editor do Supabase para executar as migrations na pasta `/migrations/`.  
Configure `DATABASE_URL` com a connection string do Supabase (modo `Transaction Pooler`).

---

## API

Todos os endpoints da API estão prefixados em `/api`. A autenticação é por sessão HTTP.

### Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login com email e senha |
| GET | `/api/auth/me` | Retorna o usuário autenticado |
| POST | `/api/auth/logout` | Encerra a sessão |

### Usuário

| Método | Endpoint | Descrição |
|---|---|---|
| PATCH | `/api/user` | Atualiza nome e email |
| POST | `/api/user/change-password` | Altera a senha |
| POST | `/api/admin/create-user` | Cria usuário (requer `adminKey`) |

### Diagnósticos (Companies)

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/my/companies` | Lista diagnósticos do usuário |
| POST | `/api/companies` | Cria novo diagnóstico |
| GET | `/api/companies/:id` | Retorna um diagnóstico |
| PATCH | `/api/companies/:id` | Atualiza dados do diagnóstico |
| DELETE | `/api/companies/:id` | Remove um diagnóstico |

### Checklist e Tarefas

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/companies/:id/checklist` | Lista itens do checklist |
| PUT | `/api/companies/:id/checklist` | Substitui todos os itens |
| PATCH | `/api/checklist/:id` | Atualiza status de um item |
| GET | `/api/companies/:id/tasks` | Lista tarefas do plano de ação |
| PUT | `/api/companies/:id/tasks` | Substitui todas as tarefas |
| PATCH | `/api/tasks/:id` | Marca tarefa como concluída |

---

## Estrutura de Pastas

```
reforma-em-acao/
│
├── client/
│   ├── index.html              # HTML raiz com meta tags Open Graph
│   └── src/
│       ├── App.tsx             # Roteamento principal (Wouter)
│       ├── index.css           # Tema global (variáveis CSS + Tailwind)
│       ├── components/
│       │   ├── layout/         # MainLayout, AppLogo
│       │   └── ui/             # Componentes shadcn/ui
│       ├── lib/
│       │   ├── store.tsx       # Estado global + chamadas de API
│       │   ├── riskConfig.ts   # Configurações de score e prontidão
│       │   ├── reformaContent.ts # Artigos da base de conhecimento
│       │   ├── generatePdf.ts  # Geração do relatório PDF (jsPDF)
│       │   └── queryClient.ts  # TanStack Query config
│       └── pages/
│           ├── Login.tsx
│           ├── HomePage.tsx
│           ├── PlanoDeAcaoJornada.tsx   # Jornada principal (telas 0–10)
│           ├── Dashboard-Educational.tsx # Base de conhecimento
│           ├── FinancialSimulation.tsx
│           ├── SimplesSimulator.tsx
│           ├── MyPlans.tsx
│           └── ProfilePage.tsx
│
├── server/
│   ├── index.ts        # Entry point + seed de usuários padrão
│   ├── routes.ts       # Todos os endpoints da API REST
│   ├── storage.ts      # Interface de acesso ao banco (IStorage)
│   ├── db.ts           # Conexão PostgreSQL via Drizzle
│   ├── static.ts       # Serve os assets do frontend em produção
│   └── vite.ts         # Integração Vite (modo dev)
│
├── shared/
│   └── schema.ts       # Modelos Drizzle + schemas Zod
│
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_companies.sql
│   ├── 003_create_checklist_items.sql
│   ├── 004_create_implementation_tasks.sql
│   └── README.md
│
├── script/
│   └── build.ts        # Build customizado (Vite + esbuild)
│
├── drizzle.config.ts   # Configuração do Drizzle Kit
├── vite.config.ts      # Configuração do Vite
├── tsconfig.json       # TypeScript config
└── package.json
```

---

## Melhorias Futuras

- Integração com sistemas ERP via API (TOTVS, Omie, Bling)
- Módulo de monitoramento de atualizações legislativas
- Notificações por e-mail com alertas de prazo
- Dashboard analytics para gestores de múltiplas empresas
- Exportação do plano de ação em formato Excel
- Autenticação OAuth (Google / Microsoft)
- Suporte a múltiplos idiomas (PT-BR / EN)

---

## Licença

MIT © 2025 — REFORMA EM AÇÃO
