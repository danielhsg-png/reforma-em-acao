# REFORMA EM AÇÃO — Resumo Técnico para Desenvolvedor Externo

---

## 1. O que o app faz

**REFORMA EM AÇÃO** é um SaaS voltado a empresários brasileiros para prepará-los para a Reforma Tributária (EC 132/2023, LC 214/2025, LC 227/2026).

**Fluxo principal:**
1. Usuário preenche uma jornada guiada de 7 telas de coleta de dados (setor, regime tributário, faturamento, operações, fornecedores, sistemas, gestão)
2. O sistema computa automaticamente um diagnóstico multi-eixo (score de 0–100)
3. Gera um Plano de Ação personalizado com prioridades e cronograma
4. Exibe relatório final com checklist, infrações aplicáveis e grau de precisão
5. Permite exportar tudo em PDF

**Ferramentas complementares:**
- Simulador Financeiro (comparativo de carga tributária)
- Simulador Simples Nacional
- Seção "O Que Muda?" (em preparação — desabilitada na home)
- Meus Planos (histórico de diagnósticos salvos por empresa)

---

## 2. Stack tecnológica

| Camada | Tecnologia |
|---|---|
| **Linguagem** | TypeScript (full-stack) |
| **Frontend** | React 19, Vite 7 |
| **Roteamento** | Wouter |
| **Estado global** | Context API + store customizado (AppProvider) |
| **Data fetching** | TanStack React Query |
| **UI** | shadcn/ui (Radix UI primitives) + Tailwind CSS v4 |
| **Ícones** | Lucide React |
| **Gráficos** | Recharts |
| **PDF** | jsPDF |
| **Backend** | Node.js + Express 5 |
| **Sessão** | express-session + MemoryStore |
| **Auth** | bcryptjs (hash de senha) + session cookie |
| **ORM** | Drizzle ORM |
| **Banco** | PostgreSQL |
| **Validação** | Zod + drizzle-zod |
| **Build** | esbuild (server), Vite (client) |
| **Runtime de dev** | tsx |

---

## 3. Estrutura de arquivos

```
/
├── client/
│   ├── index.html                        # Entry point HTML (meta OG tags)
│   └── src/
│       ├── App.tsx                       # Roteamento principal (wouter) + auth gate
│       ├── index.css                     # CSS variables — tema dark navy
│       ├── main.tsx                      # Entry React
│       ├── components/
│       │   ├── layout/
│       │   │   └── MainLayout.tsx        # Sidebar + header navegável
│       │   └── ui/                       # Componentes shadcn/ui (button, card, etc.)
│       ├── lib/
│       │   ├── store.tsx                 # AppProvider: estado global (~50 campos)
│       │   ├── generatePdf.ts            # Geração do PDF (8 seções)
│       │   ├── queryClient.ts            # TanStack Query config
│       │   └── utils.ts                  # cn() helper
│       └── pages/
│           ├── Login.tsx                 # Tela de login
│           ├── HomePage.tsx              # Home com 4 cards de ferramentas
│           ├── PlanoDeAcaoJornada.tsx    # ARQUIVO PRINCIPAL (2193 linhas)
│           │                             # 7 telas de coleta + diagnóstico + plano + relatório
│           ├── MyPlans.tsx               # Histórico de diagnósticos
│           ├── FinancialSimulation.tsx   # Simulador financeiro
│           ├── SimplesSimulator.tsx      # Simulador Simples Nacional
│           └── Dashboard-Educational.tsx # "O Que Muda?" (stub)
│
├── server/
│   ├── index.ts        # Entry Express + seed de usuários padrão no startup
│   ├── routes.ts       # Todas as rotas da API REST
│   ├── storage.ts      # Interface IStorage + DatabaseStorage (Drizzle)
│   ├── db.ts           # Conexão Drizzle com PostgreSQL
│   ├── static.ts       # Serve os arquivos de build em produção
│   └── vite.ts         # Middleware Vite em desenvolvimento
│
├── shared/
│   └── schema.ts       # Schema Drizzle + tipos Zod (compartilhado entre client e server)
│
├── script/
│   └── build.ts        # Script esbuild para produção
│
├── drizzle.config.ts   # Config Drizzle Kit
├── vite.config.ts      # Config Vite
├── tailwind.config.ts  # Config Tailwind
├── tsconfig.json
└── package.json
```

---

## 4. Banco de dados — tabelas

```sql
users
  id            VARCHAR PK  DEFAULT gen_random_uuid()
  email         TEXT UNIQUE NOT NULL
  passwordHash  TEXT NOT NULL
  createdAt     TIMESTAMP   DEFAULT now()

companies
  id                    VARCHAR PK  DEFAULT gen_random_uuid()
  userId                VARCHAR NOT NULL
  companyName           TEXT
  cnpj                  TEXT
  sector                TEXT
  regime                TEXT
  operations            TEXT
  specialRegimes        TEXT[]
  salesStates           TEXT[]
  riskScore             INTEGER
  extendedData          JSONB       -- todos os ~40 campos extras da jornada
  ... (+ ~20 colunas de texto individuais para campos mais usados)
  createdAt             TIMESTAMP   DEFAULT now()

checklist_items
  id            VARCHAR PK
  companyId     VARCHAR NOT NULL
  questionId    TEXT
  question      TEXT
  status        TEXT  -- pendente | em_andamento | concluida

implementation_tasks
  id            VARCHAR PK
  companyId     VARCHAR NOT NULL
  week          INTEGER
  taskName      TEXT
  completed     BOOLEAN DEFAULT false
```

---

## 5. API REST

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/login` | — | Login com email + senha |
| GET | `/api/auth/me` | — | Verifica sessão ativa |
| POST | `/api/auth/logout` | — | Destrói sessão |
| POST | `/api/admin/create-user` | adminKey | Cria novo usuário |
| GET | `/api/my/companies` | ✓ | Lista empresas do usuário |
| POST | `/api/companies` | ✓ | Cria empresa / salva diagnóstico |
| GET | `/api/companies/:id` | ✓ | Busca empresa por ID |
| PATCH | `/api/companies/:id` | ✓ | Atualiza dados da empresa |
| GET | `/api/companies/:id/checklist` | ✓ | Lista checklist da empresa |
| PUT | `/api/companies/:id/checklist` | ✓ | Substitui checklist completo |
| PATCH | `/api/checklist/:id` | ✓ | Atualiza status de item |
| GET | `/api/companies/:id/tasks` | ✓ | Lista tarefas de implementação |
| PUT | `/api/companies/:id/tasks` | ✓ | Substitui tarefas |
| PATCH | `/api/tasks/:id` | ✓ | Marca tarefa como concluída |

---

## 6. Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | **Sim** | URL completa do PostgreSQL |
| `SESSION_SECRET` | Recomendada | Segredo para assinar cookies de sessão. Default interno existe mas deve ser substituído em produção |
| `ADMIN_KEY` | Opcional | Chave para criar usuários via API. Default: `reforma-admin-2025` |
| `NODE_ENV` | Automática | `development` ou `production` |
| `PORT` | Automática | Porta do servidor. Default: `5000` |

---

## 7. Como rodar localmente

```bash
# Instalar dependências
npm install

# Criar tabelas no banco (primeira vez)
npm run db:push

# Desenvolvimento — servidor + Vite HMR na mesma porta (5000)
npm run dev

# Build para produção
npm run build

# Rodar em produção
npm run start
```

**Usuários padrão** — criados automaticamente no startup caso não existam:

| E-mail | Senha |
|---|---|
| `admin@reforma.com` | `reforma2025` |
| `teste@reforma.com` | `teste123` |

Para criar usuários adicionais via API:
```bash
curl -X POST http://localhost:5000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{"email":"novo@email.com","password":"senha123","adminKey":"reforma-admin-2025"}'
```

---

## 8. Arquivo principal — PlanoDeAcaoJornada.tsx

Este é o coração do produto (2.193 linhas). Controla toda a jornada de diagnóstico.

**Estado principal:**

| Campo | Tipo | Descrição |
|---|---|---|
| `screen` | `number` (0–11) | Etapa ativa da jornada |
| `data` | `AppState` (~50 campos) | Todo o formulário em memória |
| `diagnosis` | objeto | Resultado de `computeRisk(data)` — score + eixos |
| `plan` | array | Resultado de `generatePlan(data, diagnosis)` — tarefas por semana |

**Mapa de telas (`screen`):**

| Valor | Tela |
|---|---|
| `0` | Apresentação / boas-vindas |
| `1` | Identificação da Empresa |
| `2` | Perfil da Operação (regime, setor, faturamento) |
| `3` | Como a Empresa Vende (operações, canais, contratos) |
| `4` | Fornecedores e Compras |
| `5` | Sistemas e Fiscal |
| `6` | Financeiro e Pagamentos |
| `7` | Gestão e Governança |
| `8` | Diagnóstico Consolidado |
| `9` | Plano de Ação Detalhado |
| `10` | Checklist Interativo |
| `11` | Relatório de Infrações |

**Navegação guiada (UX):**

- `scrollToNext(questionId)` — timer de 220ms, rola suavemente para a próxima pergunta com `data-question`
- `scrollToContinuar()` — chamado quando não há próxima pergunta; rola até o botão "Continuar"
- `focusAndScroll(id)` — foca campo de texto e rola para ele com double-timeout (80ms + 60ms) para compatibilidade mobile
- `useEffect([screen])` — scroll para o topo com `behavior: instant` a cada troca de tela

---

## 9. Geração de PDF — generatePdf.ts

8 seções no relatório exportado:

1. Identificação da Empresa
2. Contexto Operacional
3. Diagnóstico por Eixo (tabela de scores)
4. Pontos de Atenção Críticos
5. Grau de Precisão do Diagnóstico
6. Plano de Ação (tabela por semana)
7. Checklist de Conformidade
8. Infrações e Penalidades Aplicáveis

---

## 10. Design — sistema de cores

Variáveis CSS em `client/src/index.css`:

| Token | Valor HSL | Uso |
|---|---|---|
| `--background` | `218 74% 16%` | Fundo geral (navy escuro #0B2149) |
| `--foreground` | `0 0% 100%` | Texto principal (branco) |
| `--card` | `218 55% 22%` | Cards (navy mais claro) |
| `--primary` | `30 100% 48%` | CTAs e destaque (#F57C00 laranja) |
| `--muted-foreground` | `218 20% 70%` | Texto secundário |
| `--border` | `218 40% 30%` | Bordas |

---

## 11. Pontos que precisam de atenção ou ajuste futuro

| Área | Situação |
|---|---|
| **Sessão em memória** | `MemoryStore` não persiste ao reiniciar o servidor. Em produção escalonada, trocar por `connect-pg-simple` com store no PostgreSQL |
| **`extendedData` JSONB** | Muitos campos da jornada são salvos como JSONB. Se crescer, considerar colunas dedicadas ou schema versionado |
| **Sem sistema de registro** | Usuários só existem via seed automático ou endpoint admin. Não há self-registration |
| **"O Que Muda?"** | Rota existe (`/o-que-muda`) mas a página é um stub "Em preparação" |
| **`passport` instalado** | Está no `package.json` mas não é usado — pode ser removido |
| **Lógica de negócio no frontend** | `computeRisk()` e `generatePlan()` estão inline em `PlanoDeAcaoJornada.tsx`. Candidatos a mover para `lib/` ou para o servidor |
| **Sem testes unitários** | A validação foi feita por testes E2E de UI. Não há testes unitários ou de integração |

---

## 12. Conteúdo dos arquivos principais

### server/index.ts

```typescript
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function seedDefaultUsers() {
  const defaultUsers = [
    { email: "admin@reforma.com", password: "reforma2025" },
    { email: "teste@reforma.com", password: "teste123" },
  ];
  for (const u of defaultUsers) {
    const existing = await storage.getUserByEmail(u.email);
    if (!existing) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      await storage.createUser({ email: u.email, passwordHash });
    }
  }
}

(async () => {
  await registerRoutes(httpServer, app);
  await seedDefaultUsers();

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    console.log(`serving on port ${port}`);
  });
})();
```

### shared/schema.ts

```typescript
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().default(""),
  companyName: text("company_name").notNull(),
  cnpj: text("cnpj").notNull().default(""),
  sector: text("sector").notNull(),
  regime: text("regime").notNull(),
  operations: text("operations").notNull().default("b2c"),
  purchaseProfile: text("purchase_profile").notNull().default("mixed_suppliers"),
  salesStates: text("sales_states").array().notNull().default(sql`'{}'::text[]`),
  costStructure: text("cost_structure").notNull().default("mercadorias"),
  riskScore: integer("risk_score").notNull().default(0),
  monthlyRevenue: text("monthly_revenue").notNull().default("100k_500k"),
  employeeCount: text("employee_count").notNull().default("1_10"),
  profitMargin: text("profit_margin").notNull().default("10_20"),
  erpSystem: text("erp_system").notNull().default("nenhum"),
  nfeEmission: text("nfe_emission").notNull().default("contador"),
  invoiceVolume: text("invoice_volume").notNull().default("ate_100"),
  supplierCount: text("supplier_count").notNull().default("ate_20"),
  simplesSupplierPercent: text("simples_supplier_percent").notNull().default("ate_30"),
  hasLongTermContracts: text("has_long_term_contracts").notNull().default("nao"),
  priceRevisionClause: text("price_revision_clause").notNull().default("nao_sei"),
  taxResponsible: text("tax_responsible").notNull().default("contador_externo"),
  splitPaymentAware: text("split_payment_aware").notNull().default("nao"),
  mainConcern: text("main_concern").notNull().default("custos"),
  specialRegimes: text("special_regimes").array().notNull().default(sql`'{}'::text[]`),
  extendedData: jsonb("extended_data").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companies).omit({ id: true, createdAt: true });
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export const checklistItems = pgTable("checklist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull(),
  questionId: text("question_id").notNull(),
  question: text("question").notNull(),
  status: text("status").notNull().default("validating"),
});

export const insertChecklistItemSchema = createInsertSchema(checklistItems).omit({ id: true });
export type InsertChecklistItem = z.infer<typeof insertChecklistItemSchema>;
export type ChecklistItem = typeof checklistItems.$inferSelect;

export const implementationTasks = pgTable("implementation_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull(),
  week: integer("week").notNull(),
  taskName: text("task_name").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const insertImplementationTaskSchema = createInsertSchema(implementationTasks).omit({ id: true });
export type InsertImplementationTask = z.infer<typeof insertImplementationTaskSchema>;
export type ImplementationTask = typeof implementationTasks.$inferSelect;
```

### client/src/App.tsx

```typescript
import { useEffect } from "react";
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AppProvider, useAppStore } from "@/lib/store";
import Login from "@/pages/Login";
import HomePage from "@/pages/HomePage";
import MyPlans from "@/pages/MyPlans";
import PlanoDeAcaoJornada from "@/pages/PlanoDeAcaoJornada";
import DashboardEducational from "@/pages/Dashboard-Educational";
import FinancialSimulation from "@/pages/FinancialSimulation";
import SimplesSimulator from "@/pages/SimplesSimulator";

function AuthenticatedRoutes() {
  return (
    <Switch>
      <Route path="/inicio" component={HomePage} />
      <Route path="/plano-de-acao" component={PlanoDeAcaoJornada} />
      <Route path="/plano-de-acao/meus-planos" component={MyPlans} />
      <Route path="/simulador-financeiro" component={FinancialSimulation} />
      <Route path="/simulador-simples" component={SimplesSimulator} />
      <Route path="/o-que-muda" component={DashboardEducational} />
      <Route path="/"><Redirect to="/inicio" /></Route>
    </Switch>
  );
}

function Router() {
  const { user, authLoading, checkAuth } = useAppStore();
  useEffect(() => { checkAuth(); }, [checkAuth]);

  if (authLoading) return <div>Carregando...</div>;
  if (!user) return <Login />;
  return <AuthenticatedRoutes />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router />
      </AppProvider>
    </QueryClientProvider>
  );
}
```

---

*Gerado automaticamente em 28/03/2026*
