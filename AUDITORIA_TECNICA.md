# AUDITORIA TÉCNICA — REFORMA EM AÇÃO
**Documento gerado em: 30 de maio de 2026**  
**Versão do codebase auditada:** GitHub `danielhsg-png/reforma-em-acao` (tarball, mai/2026)  
**Banco de dados:** Railway PostgreSQL (primário); Replit PostgreSQL (fallback configurado)  
**Ambiente de execução:** Replit (NixOS), Node.js 20, porta 5000

---

## Índice

1. [Resumo Executivo](#1-resumo-executivo)
2. [Stack Tecnológico e Arquitetura](#2-stack-tecnológico-e-arquitetura)
3. [Schema do Banco de Dados e Migrações](#3-schema-do-banco-de-dados-e-migrações)
4. [Autenticação e Gerenciamento de Sessão](#4-autenticação-e-gerenciamento-de-sessão)
5. [Design da API e Rotas Backend](#5-design-da-api-e-rotas-backend)
6. [Arquitetura Frontend e Roteamento](#6-arquitetura-frontend-e-roteamento)
7. [Gerenciamento de Estado](#7-gerenciamento-de-estado)
8. [Motor de Diagnóstico (Engine de Risco)](#8-motor-de-diagnóstico-engine-de-risco)
9. [Motor de Geração do Plano de Ação](#9-motor-de-geração-do-plano-de-ação)
10. [Exportação em PDF](#10-exportação-em-pdf)
11. [Painel Administrativo](#11-painel-administrativo)
12. [Infraestrutura de E-mail e Webhooks](#12-infraestrutura-de-e-mail-e-webhooks)
13. [Integrações com APIs Externas](#13-integrações-com-apis-externas)
14. [Sistema de Design e UI/UX](#14-sistema-de-design-e-uiux)
15. [Segurança, Performance e Recomendações](#15-segurança-performance-e-recomendações)

---

## 1. Resumo Executivo

### Visão Geral

O **REFORMA EM AÇÃO** é uma plataforma SaaS B2B voltada a empresários brasileiros, contadores e consultores tributários que precisam compreender e se adaptar à Reforma Tributária promovida pela EC 132/2023 e regulamentada pela LC 214/2025 e LC 227/2026. O produto entrega uma jornada guiada de diagnóstico (7 telas de coleta → diagnóstico em 5 eixos → plano de ação em 3 fases → relatório PDF), complementada por uma base de conhecimento educacional, simuladores e ferramentas auxiliares.

### Estado Atual do Produto

| Dimensão | Status |
|---|---|
| Funcionalidade principal (jornada completa) | **Operacional** |
| Autenticação / sessões | **Operacional** |
| Banco de dados Railway | **Operacional** (9 migrações aplicadas) |
| Painel Admin | **Operacional** |
| E-mail transacional (SMTP2GO) | **Operacional** |
| Webhook Pagar.me | **Operacional** |
| Simulador Financeiro | **Stub** (interface presente, desabilitada) |
| Simulador Simples Nacional | **Stub** (interface presente, desabilitada) |
| Exportação PDF | **Operacional** |

### Dados do Banco (Estado em 30/05/2026)

| Tabela | Registros |
|---|---|
| `users` | 17 |
| `companies` | 11 |
| `checklist_items` | 0 |
| `implementation_tasks` | 0 |
| `email_logs` | 14 |
| `webhook_logs` | 39 |

> **Nota crítica:** As tabelas `checklist_items` e `implementation_tasks` têm zero registros, indicando que as funcionalidades de checklist e tarefas persistidas no banco nunca foram ativadas na jornada atual. Toda a gestão de status de tarefas ocorre exclusivamente no estado React em memória.

### Pontos Fortes

- Motor de diagnóstico completamente baseado em lógica funcional determinística (sem IA, sem chamadas externas) — rápido, auditável e offline.
- Arquitetura limpa de separação frontend/backend com schema Drizzle como fonte de verdade única.
- PDF profissional gerado 100% no cliente via jsPDF, sem overhead de servidor.
- Painel Admin robusto com 4 abas (empresas, usuários, e-mails, webhooks) e confirmação de senha para ações destrutivas.
- Integração BrasilAPI/CNPJ para auto-preenchimento de dados cadastrais.

### Riscos Identificados

- **CRÍTICO — Segurança:** Senhas de usuários seed hardcoded no código-fonte do servidor (`admin@reforma.com/reforma2025`, `teste@reforma.com/teste123`). Qualquer acesso ao repositório expõe credenciais reais de produção.
- **ALTO — Dados:** Rascunho do diagnóstico armazenado em `localStorage` sem criptografia; inclui CNPJ, nome e dados operacionais sensíveis da empresa.
- **ALTO — Persistência:** Status das tarefas do plano de ação nunca é persistido no banco; ao recarregar a página, todo o progresso é perdido.
- **MÉDIO — Confiabilidade:** A lógica completa do diagnóstico (700+ linhas de `computeReadiness`) vive num único arquivo de 2.683 linhas, sem testes unitários.
- **MÉDIO — Token de reset:** O token de reset de senha é armazenado em coluna de texto plano na tabela `users`, sem hash.

---

## 2. Stack Tecnológico e Arquitetura

### Camada Frontend

| Tecnologia | Versão | Papel |
|---|---|---|
| React | 19.1 | Framework de UI |
| TypeScript | 5.x | Tipagem estática |
| Vite | 7.x | Bundler e servidor de desenvolvimento |
| TailwindCSS | 4.x | Utilitários de estilo (config inline via `@theme`) |
| shadcn/ui | latest | Componentes acessíveis (Radix UI por baixo) |
| wouter | 3.x | Roteamento SPA leve |
| jsPDF | 2.x | Geração de PDF no lado cliente |
| lucide-react | 0.x | Ícones SVG |

### Camada Backend

| Tecnologia | Versão | Papel |
|---|---|---|
| Express.js | 5.x | Framework HTTP |
| TypeScript | 5.x | Tipagem estática |
| Drizzle ORM | 0.x | ORM e migrations para PostgreSQL |
| express-session | 1.x | Gerenciamento de sessão server-side |
| bcryptjs | 2.x | Hash de senhas (salt rounds: 10) |
| connect-pg-simple | 9.x | Armazenamento de sessão em PostgreSQL |
| node-postgres (pg) | 8.x | Driver PostgreSQL |
| drizzle-zod | 0.x | Schemas Zod derivados do Drizzle |

### Infraestrutura

| Componente | Detalhe |
|---|---|
| Banco de dados primário | Railway PostgreSQL (via `RAILWAY_DATABASE_URL`) |
| Banco de dados fallback | Replit PostgreSQL (via `DATABASE_URL`) |
| E-mail transacional | SMTP2GO (via API REST autenticada por `SMTP2GO_API_KEY`) |
| Webhook de pagamento | Pagar.me (autenticação HTTP Basic: `PAGARME_WEBHOOK_USER`/`PAGARME_WEBHOOK_PASSWORD`) |
| Hosting | Replit (desenvolvimento); domínio produção: `app.reformaemacao.com.br` |

### Modelo de Deployment

O projeto roda como um monorepo com um único processo Node.js:
- `npm run dev` → Inicia `server/index.ts` via tsx/nodemon
- O Express serve a SPA (`dist/public`) em produção via `express.static`
- Em desenvolvimento, o Vite roda como middleware integrado
- As migrações são executadas **automaticamente no boot** via `runMigrations()` em `server/index.ts`

```
/
├── client/           # Frontend React (raiz do Vite)
│   ├── src/
│   │   ├── pages/    # 15 páginas
│   │   ├── components/
│   │   └── lib/      # store, riskConfig, generatePdf, reformaContent, planExplanations
│   └── index.html
├── server/           # Backend Express
│   ├── index.ts      # Boot: migrations + seed + listen
│   ├── routes.ts     # Todos os endpoints (~1.017 linhas)
│   ├── storage.ts    # Interface IStorage + DatabaseStorage
│   ├── db.ts         # Pool PostgreSQL (Railway ou Replit)
│   └── email.ts      # SMTP2GO integration
├── shared/
│   └── schema.ts     # Schema Drizzle (6 tabelas) — fonte de verdade
└── migrations/       # 9 arquivos SQL sequenciais
```

---

## 3. Schema do Banco de Dados e Migrações

### Visão Geral das Tabelas

O schema (`shared/schema.ts`) define **6 tabelas** gerenciadas pelo Drizzle ORM com 9 migrações sequenciais aplicadas via execução automática no boot.

---

#### Tabela: `users`

Armazena todos os usuários da plataforma.

| Coluna | Tipo | Detalhe |
|---|---|---|
| `id` | `text` PRIMARY KEY | UUID gerado via `crypto.randomUUID()` |
| `email` | `text` UNIQUE NOT NULL | Identificador de login |
| `name` | `text` | Nome opcional |
| `password` | `text` NOT NULL | bcrypt hash (rounds: 10) |
| `role` | `text` | `"user"` ou `"super_admin"` (default: `"user"`) |
| `resetToken` | `text` | Token de reset de senha (**plain text — ver seção 15**) |
| `resetTokenExpiresAt` | `timestamp` | Expiração do token (1 hora após emissão) |
| `createdAt` | `timestamp` | Auto-set no INSERT |

**Observação:** A coluna `resetToken` armazena o token em texto plano. O recomendado é armazenar apenas o hash SHA-256 do token.

---

#### Tabela: `companies`

Armazena todos os diagnósticos de empresas. Cada linha representa um ciclo completo da jornada de 7 telas.

Possui **20+ colunas nativas** (strings e booleans) para os campos principais da jornada, mais uma coluna `extendedData` JSONB que armazena todos os campos adicionados após a versão inicial — garantindo backward-compatibility.

| Grupo | Colunas Notáveis |
|---|---|
| Identificação | `id`, `userId` (FK → users), `companyName`, `cnpj`, `sector`, `regime` |
| Operação | `operations`, `geographicScope`, `employeeCount`, `annualRevenue`, `businessType` |
| Sistemas | `erpSystem`, `nfeEmission`, `invoiceVolume`, `erpVendorReformPlan`, `catalogStandardized` |
| Compras | `supplierCount`, `simplesSupplierPercent`, `hasRegularNF`, `hasNFErrors` |
| Financeiro | `profitMargin`, `splitPaymentAware`, `tightWorkingCapital`, `mainConcern` |
| Contratos | `hasLongTermContracts`, `priceRevisionClause` |
| Governança | `taxResponsible`, `managementAwareOfReform`, `preparationStarted`, `hadInternalTraining` |
| Score | `riskScore` (integer 0–100, calculado no cliente) |
| Arrays | `specialRegimes` (`text[]`), `salesStates` (`text[]`), `mainExpenses` (`text[]`), `paymentMethods` (`text[]`), `fiscalDocTypes` (`text[]`) |
| JSONB | `extendedData` — campos estendidos (v2+) |
| Timestamps | `createdAt`, `updatedAt` |

**Nota crítica sobre `monthlyRevenue`:** O código tem comentário explícito em `store.tsx` que a coluna `monthlyRevenue` do banco, na prática, armazena o valor de `annualRevenue`. Isso é um legado de renomeação e representa uma inconsistência semântica na schema.

---

#### Tabela: `checklist_items`

Itens de checklist por empresa. **Nunca utilizada no fluxo atual** (0 registros).

| Coluna | Tipo |
|---|---|
| `id` | text PK |
| `companyId` | text FK → companies |
| `category` / `text` / `completed` | text / text / boolean |

---

#### Tabela: `implementation_tasks`

Tarefas do plano de ação persistidas por empresa. **Nunca utilizada no fluxo atual** (0 registros).

| Coluna | Tipo |
|---|---|
| `id` | text PK |
| `companyId` | text FK → companies |
| `taskId` / `title` / `phase` / `completed` | campos de texto e boolean |

**Impacto:** Os status de tarefas (`pendente → em_andamento → concluida`) existem apenas como estado React (`useState<Record<string, TaskStatus>>`). Ao navegar para fora da tela de Plano de Ação, todo o progresso é perdido.

---

#### Tabela: `email_logs`

Log de todos os e-mails enviados pela plataforma.

| Coluna | Tipo |
|---|---|
| `id` | text PK |
| `recipient` | text |
| `subject` | text |
| `kind` | `"password_reset"` \| `"welcome"` \| `"generic"` |
| `status` | `"sent"` \| `"failed"` |
| `error` | text (mensagem de erro se falhou) |
| `createdAt` | timestamp |

---

#### Tabela: `webhook_logs`

Log de todas as chamadas recebidas no endpoint `/api/webhook/pagarme` e `/api/webhook/new-user`.

| Coluna | Tipo |
|---|---|
| `id` | text PK |
| `source` | text (ex: `"pagarme"`) |
| `eventType` | text (ex: `"order.paid"`) |
| `status` | `"processed"` \| `"ignored"` \| `"error"` \| `"auth_failed"` \| `"duplicate"` |
| `httpStatus` | integer |
| `ip` | text |
| `authOk` | boolean |
| `externalId` | text (ID externo do pedido/charge) |
| `customerEmail` | text |
| `headers` | jsonb |
| `payload` | jsonb |
| `createdAt` | timestamp |

> 39 webhook logs presentes indica que o endpoint Pagar.me está em uso ativo (possivelmente em ambiente de testes/sandbox).

---

### Fluxo de Migrações

```
migrations/
├── 0000_initial_schema.sql           # Tabelas users, companies, checklist_items, implementation_tasks
├── 0001_add_user_role.sql            # Coluna role em users
├── 0002_add_extended_data.sql        # Coluna extendedData JSONB em companies
├── 0003_add_special_regimes.sql      # Coluna specialRegimes text[] em companies
├── 0004_add_reset_token.sql          # Colunas resetToken, resetTokenExpiresAt em users
├── 0005_add_email_logs.sql           # Tabela email_logs
├── 0006_add_webhook_logs.sql         # Tabela webhook_logs
├── 0007_add_company_fields.sql       # Campos adicionais em companies (v2 da jornada)
└── 0008_add_more_company_fields.sql  # Campos adicionais v3 (governança, compras, comercial)
```

As migrações são executadas via `runMigrations()` chamado em `server/index.ts` na inicialização. A função lê arquivos `.sql` em ordem, verifica quais já foram aplicados por uma tabela de controle interna, e aplica apenas as pendentes.

---

## 4. Autenticação e Gerenciamento de Sessão

### Mecanismo

O sistema usa **autenticação baseada em sessão server-side** com cookies HTTP, implementada via `express-session` + `connect-pg-simple` (sessões armazenadas na tabela `session` do PostgreSQL).

**Não há JWT.** Toda autenticação é validada pelo middleware `requireAuth` que verifica `req.session.userId`.

### Configuração da Sessão

```typescript
// server/index.ts
express-session({
  store: new PgSession({ pool, tableName: "session", createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || "reforma-em-acao-secret-2024",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 dias
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax"
  }
})
```

> **Problema:** O `SESSION_SECRET` tem fallback hardcoded (`"reforma-em-acao-secret-2024"`). Se a variável de ambiente não estiver definida em produção, todas as sessões usam um segredo público e previsível.

### Endpoints de Autenticação

| Endpoint | Método | Descrição |
|---|---|---|
| `/api/auth/login` | POST | Valida email+senha via bcrypt, cria sessão |
| `/api/auth/logout` | POST | Destrói sessão |
| `/api/auth/me` | GET | Retorna usuário da sessão atual |
| `/api/auth/forgot-password` | POST | Gera token, envia e-mail com link |
| `/api/auth/reset-password` | POST | Valida token + expiração, atualiza senha |

### Fluxo de Reset de Senha

1. Usuário submete e-mail em `/esqueci-senha`
2. Backend gera `crypto.randomBytes(32).toString('hex')` → armazena em `users.resetToken` (plain text) com `resetTokenExpiresAt = now + 1h`
3. SMTP2GO envia e-mail com link `${APP_URL}/redefinir-senha?token=XXX`
4. Usuário acessa o link, `ResetPassword.tsx` faz `POST /api/auth/reset-password` com token + nova senha
5. Backend valida token e expiração, atualiza senha com novo bcrypt hash, apaga token

> **Problema:** O token é comparado com `===` direto em texto plano. O correto seria armazenar apenas `SHA-256(token)` no banco e comparar os hashes — evitando exposição em caso de dump do banco.

### Seed de Usuários (RISCO CRÍTICO)

No boot do servidor, `seedDefaultUsers()` cria usuários com senhas fixas se não existirem:

```typescript
{ email: "admin@reforma.com",   password: "reforma2025", role: "super_admin" },
{ email: "teste@reforma.com",   password: "teste123" },
{ email: "demo1@reformaemacao.com.br", password: "Reforma@2026" },
{ email: "demo2@reformaemacao.com.br", password: "Reforma@2026" },
```

Estas senhas estão **no repositório GitHub público** (ou qualquer fork). Qualquer pessoa com acesso ao código tem credenciais de produção.

### Middleware de Autorização

```typescript
requireAuth       — verifica req.session.userId; retorna 401 se ausente
requireSuperAdmin — verifica role === "super_admin"; retorna 403 se não
```

Aplicados em todas as rotas protegidas. O middleware `requireSuperAdmin` é aplicado em todos os endpoints `/api/admin/*`.

### Proteção de Rotas no Frontend

`App.tsx` implementa `<AuthenticatedRoutes>` que:
1. No mount, chama `GET /api/auth/me`
2. Se retornar 401, redireciona para `/` (login)
3. Se autenticado, renderiza as rotas internas

Não há lógica de RBAC no frontend; o controle real é feito no backend.

---

## 5. Design da API e Rotas Backend

### Mapa Completo de Endpoints (`server/routes.ts`, 1.017 linhas)

#### Auth

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/login` | Pública | Login |
| GET | `/api/auth/me` | Opcional | Verificar sessão |
| POST | `/api/auth/logout` | Opcional | Logout |
| POST | `/api/auth/forgot-password` | Pública | Solicitar reset |
| POST | `/api/auth/reset-password` | Pública | Confirmar reset |

#### Usuário

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| PATCH | `/api/user` | `requireAuth` | Atualizar nome/e-mail |
| POST | `/api/user/change-password` | `requireAuth` | Trocar senha |

#### Empresas

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/my/companies` | `requireAuth` | Listar empresas do usuário |
| POST | `/api/companies` | `requireAuth` | Criar empresa |
| GET | `/api/companies/:id` | `requireAuth` | Obter empresa (checa ownership) |
| PATCH | `/api/companies/:id` | `requireAuth` | Atualizar empresa |
| DELETE | `/api/companies/:id` | `requireAuth` | Excluir empresa |

#### Checklist e Tarefas (Implementados mas sem uso atual)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/companies/:id/checklist` | `requireAuth` | Obter checklist |
| PUT | `/api/companies/:id/checklist` | `requireAuth` | Upsert checklist |
| PATCH | `/api/checklist/:id` | `requireAuth` | Atualizar item |
| GET | `/api/companies/:id/tasks` | `requireAuth` | Obter tarefas |
| PUT | `/api/companies/:id/tasks` | `requireAuth` | Upsert tarefas |
| PATCH | `/api/tasks/:id` | `requireAuth` | Toggle tarefa |

#### Admin (Super Admin apenas)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/admin/users` | `requireSuperAdmin` | Listar todos usuários |
| GET | `/api/admin/companies` | `requireSuperAdmin` | Listar todas empresas |
| GET | `/api/admin/email-logs` | `requireSuperAdmin` | Logs de e-mail |
| GET | `/api/admin/webhook-logs` | `requireSuperAdmin` | Logs de webhook |
| GET | `/api/admin/users/:id` | `requireSuperAdmin` | Detalhe do usuário |
| GET | `/api/admin/companies/:id` | `requireSuperAdmin` | Detalhe da empresa |
| PATCH | `/api/admin/users/:id/role` | `requireSuperAdmin` | Alterar role (confirma senha) |
| DELETE | `/api/admin/users/:id` | `requireSuperAdmin` | Excluir usuário (confirma senha) |
| POST | `/api/admin/create-user` | ADMIN_KEY | Criar usuário via chave |

#### Webhooks

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/webhook/pagarme` | HTTP Basic | Receber eventos Pagar.me |
| POST | `/api/webhook/new-user` | ADMIN_KEY | Criar usuário manualmente |

#### Ações Admin via ADMIN_KEY (sem sessão)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/admin/create-user` | `X-Admin-Key` header | Criar usuário |
| POST | `/api/admin/resend-welcome/:id` | `requireSuperAdmin` | Reenviar e-mail de boas-vindas |

### Padrão de Tratamento de Erros

Todas as rotas utilizam `try/catch` com `res.status(500).json({ message })`. Não há middleware centralizado de erro no Express — cada rota captura individualmente. Isso é funcional, mas resulta em tratamento inconsistente entre algumas rotas.

### Validação de Input

A maioria das rotas faz validação manual inline (verificação de campos obrigatórios). Algumas rotas usam schemas Zod do drizzle-zod para validação mais estruturada. Não há validação centralizada via middleware.

---

## 6. Arquitetura Frontend e Roteamento

### Estrutura de Páginas (15 páginas)

| Rota | Arquivo | Função |
|---|---|---|
| `/` | `Login.tsx` | Tela de login |
| `/esqueci-senha` | `ForgotPassword.tsx` | Solicitar reset de senha |
| `/redefinir-senha` | `ResetPassword.tsx` | Confirmar nova senha |
| `/inicio` | `HomePage.tsx` | Hub com 4 caminhos |
| `/plano-de-acao` | `PlanoDeAcaoJornada.tsx` | Jornada completa (telas 0–10) |
| `/plano-de-acao/meus-planos` | `MyPlans.tsx` | Lista de diagnósticos salvos |
| `/plano-de-acao/analise-produtos` | `ProductAnalysis.tsx` | Análise de produtos |
| `/plano-de-acao/preocupacoes` | `MyConcerns.tsx` | Perguntas livres por keywords |
| `/simulador-financeiro` | `FinancialSimulation.tsx` | Stub (desabilitado) |
| `/simulador-simples` | `SimplesSimulator.tsx` | Stub (desabilitado) |
| `/o-que-muda` | `Dashboard-Educational.tsx` | Base de conhecimento (15 artigos) |
| `/perfil` | `ProfilePage.tsx` | Dados pessoais e segurança |
| `/admin` | `AdminPanel.tsx` | Painel admin (super_admin) |
| `/admin/usuarios/:id` | `AdminUserDetail.tsx` | Detalhe de usuário |
| `/admin/empresas/:id` | `AdminCompanyDetail.tsx` | Detalhe de empresa |

### Roteamento

O `App.tsx` separa claramente rotas públicas (login, forgot, reset) de rotas autenticadas via componente `<AuthenticatedRoutes>`. Todas as rotas legadas são redirecionadas para `/plano-de-acao` via `<Redirect>`.

O wouter é usado com `Switch` + `Route` no padrão tradicional, sem lazy loading — todos os componentes são carregados no bundle inicial.

### Estrutura da PlanoDeAcaoJornada (2.683 linhas)

Este é o arquivo central do produto. Ele implementa um wizard multi-tela com estado interno `screen` (0–10):

| Screen | Conteúdo |
|---|---|
| 0 | Tela de apresentação / hub de diagnósticos salvos |
| 1–6 | Telas de coleta de dados (Cadastro → Perfil → Compras → Sistemas → Financeiro → Governança) |
| 7 | (não existe — INPUT_SCREENS = 6) |
| 8 | Diagnóstico consolidado (5 eixos) |
| 9 | Plano de Ação (3 fases) |
| 10 | Relatório Final + download PDF |

A função `computeReadiness(data)` é chamada ao avançar da tela 6 para a 8. A função `generatePlan(data, diagnosis)` é chamada logo após. Os resultados são guardados em `useState<DiagnosisResult>` e `useState<PlanAction[]>`.

---

## 7. Gerenciamento de Estado

### AppStore (`client/src/lib/store.tsx`)

O estado global é gerenciado via React Context com uma interface `AppState` de 69 campos, exposta pelo hook `useAppStore()`.

### Estrutura do Estado

```typescript
interface AppState {
  // Auth
  user: AuthUser | null;
  authLoading: boolean;
  companyId: string | null;

  // Dados da empresa (69 campos)
  data: {
    companyName, cnpj, nomeFantasia, cnaeCode, estado, municipio,
    contactName, contactRole, contactEmail, contactPhone,
    sector, regime, operations, geographicScope, employeeCount,
    annualRevenue, businessType, salesStates[],
    erpSystem, nfeEmission, invoiceVolume, erpVendorReformPlan,
    catalogStandardized, internalFiscalResponsible,
    supplierCount, simplesSupplierPercent, hasRegularNF, hasNFErrors,
    mainExpenses[], fiscalDocTypes[], hasImports, supplierRegimeType,
    splitPaymentAware, profitMargin, tightWorkingCapital, knowsMarginByProduct,
    easePriceAdjustment, paymentMethods[], hasGovernmentContracts,
    priceSensitivity, hasLongTermContracts, priceRevisionClause,
    taxResponsible, managementAwareOfReform, preparationStarted,
    hadInternalTraining, mainConcern, specialRegimes[],
    operations, hasExports, hasFrequentReturns, riskScore,
    erpIntegratedFinance, ...
  };

  // Métodos
  updateData(field, value);
  saveCompany();     // POST /api/companies ou PATCH /api/companies/:id
  loadCompany(id);   // GET /api/companies/:id
  resetData();
  login(email, password);
  logout();
  checkAuth();
}
```

### Persistência Local

O rascunho do diagnóstico é auto-salvo em `localStorage`:
- **Chave:** `reforma_diagnosis_draft_v1`
- **Conteúdo:** Serialização JSON completa de `AppState.data`
- **`companyId`:** Salvo separadamente em `reforma_company_id`

A cada atualização via `updateData()`, o estado é imediatamente escrito no localStorage. Na montagem do componente, o draft é restaurado automaticamente.

> **Implicação de privacidade:** CNPJ, razão social, dados de faturamento e informações operacionais sensíveis ficam em texto claro no `localStorage` do navegador.

### Fluxo de Persistência no Servidor

1. Usuário completa tela 6 → `handleNext()` chama `saveCompany()`
2. `saveCompany()` detecta se `companyId` existe:
   - Se não: `POST /api/companies` → recebe ID → salva em state + localStorage
   - Se sim: `PATCH /api/companies/:id`
3. Dados são mapeados do `AppState.data` flat para o schema do banco (com campos extras em `extendedData`)

### Mapeamento `data → extendedData`

Os campos adicionados após a schema inicial (v2/v3) são serializados em `extendedData` JSONB. Isso inclui: `priceSensitivity`, `easePriceAdjustment`, `knowsMarginByProduct`, `supplierRegimeType`, `hasGovernmentContracts`, `hasFrequentReturns`, `erpIntegratedFinance`, `salesStates`, `fiscalDocTypes`, `paymentMethods`.

---

## 8. Motor de Diagnóstico (Engine de Risco)

### Arquitetura

O diagnóstico é 100% **client-side**, determinístico e sem chamadas externas. A função `computeReadiness(data: AppData): DiagnosisResult` em `PlanoDeAcaoJornada.tsx` (linhas 115–322) implementa todo o motor.

Os tipos e constantes de configuração são definidos em `client/src/lib/riskConfig.ts` como fonte única de verdade, compartilhada entre o componente UI e o gerador de PDF.

### Modelo de Pontuação

```
Score de Prontidão = 100 − Σ(score_eixo_i × peso_i)
                    (clamped entre 0 e 100)
```

| Eixo | Peso | Score Máximo de Risco |
|---|---|---|
| Fiscal / Documental | 25% | 100 |
| Compras / Créditos | 20% | 100 |
| Comercial / Contratos | 20% | 100 |
| Financeiro / Caixa | 20% | 100 |
| Governança / Sistemas | 15% | 100 |

Cada item de risco detectado adiciona pontos ao score de risco do eixo correspondente. O score final de prontidão é o inverso: **quanto maior o score final, melhor a prontidão**.

### Limiares de Prontidão

| Nível | Range | Cor |
|---|---|---|
| AVANÇADO | 85–100 | Verde (#16a34a) |
| MODERADO | 70–84 | Âmbar (#d97706) |
| BAIXO | 45–69 | Laranja (#f97316) |
| CRÍTICO | 0–44 | Vermelho (#dc2626) |

### Regras de Negócio por Eixo

#### Eixo 1 — Fiscal / Documental (25%)

Todos os perfis recebem um item universal (+10 pontos) sobre a obrigatoriedade de novos campos nos documentos fiscais. Regras adicionais:

| Condição | Nível | Pontos |
|---|---|---|
| ERP = "nenhum" ou "planilha" | CRÍTICO | +30 |
| Emissão via emissor gratuito ou contador | MODERADO | +10 |
| Cadastro não padronizado | ALTO | +20 |
| ERP sem plano de adaptação confirmado | MODERADO | +12 |
| Sem responsável fiscal interno | MODERADO | +10 |
| Operação multi-estado | ALTO | +15 |
| Imposto Seletivo (bebidas, tabaco, veículos) | ALTO | +15 |
| B2B (exigência de qualidade de NF) | MODERADO | +8 |

#### Eixo 2 — Compras / Créditos (20%)

| Condição | Nível | Pontos |
|---|---|---|
| >60% fornecedores Simples, não vão optar | CRÍTICO | +28 |
| >60% fornecedores Simples, intenção indefinida | ALTO | +22 |
| >60% fornecedores Simples, vão optar | MODERADO | +8 |
| 30–60% fornecedores Simples | MODERADO | +10 |
| Maioria dos fornecedores é Simples/MEI/PF | ALTO | +15 |
| NFs recebidas com erros frequentes | ALTO | +18 |
| Compras sem NF regular | CRÍTICO | +25 |
| Custo concentrado em folha | ALTO | +20 |
| Importações | MODERADO | +8 |
| B2B + sem NF regular | MODERADO | +5 |

#### Eixo 3 — Comercial / Contratos (20%)

| Condição | Nível | Pontos |
|---|---|---|
| Contratos longos + sem cláusula de revisão | CRÍTICO | +25 |
| Contratos longos + cláusula indefinida | ALTO | +15 |
| B2C (consumidor final absorve carga) | MODERADO | +10 |
| Sem visibilidade de margem por produto | MODERADO | +8 |
| Dificuldade estrutural de reajuste | MODERADO | +8 |
| Contratos públicos (equilíbrio econômico) | MODERADO | +8 |
| Multi-estado + B2B (preço varia por UF) | MODERADO | +5 |
| Agronegócio (regras diferenciadas) | MODERADO | +15 |
| Preço travado em contrato/licitação | ALTO | +12 |
| Preço ditado pelo mercado | — | +6 |

#### Eixo 4 — Financeiro / Caixa (20%)

| Condição | Nível | Pontos |
|---|---|---|
| Desconhece Split Payment | ALTO | +18 |
| Conhece superficialmente o Split Payment | MODERADO | +8 |
| Margem ≤10% | ALTO | +22 |
| Capital de giro apertado | ALTO | +18 |
| B2C + margem apertada | ALTO | +12 |
| Sem visibilidade de margem por produto | MODERADO | +10 |
| Dificuldade de reajustar preços | MODERADO | +10 |
| Lucro Presumido | MODERADO | +8 |

#### Eixo 5 — Governança / Sistemas (15%)

| Condição | Nível | Pontos |
|---|---|---|
| Nenhum responsável fiscal | CRÍTICO | +25 |
| Diretoria não acompanha | ALTO | +20 |
| Zero preparação E zero treinamento | CRÍTICO | +25 |
| Preparação não iniciada | ALTO | +18 |
| Equipe sem treinamento | MODERADO | +12 |
| Só o dono como responsável (sem ponto focal técnico) | MODERADO | +10 |
| Universal (monitoramento transição 2026–2033) | MODERADO | +8 |

### Cálculo da Oportunidade Principal

Após o diagnóstico, `computeReadiness` seleciona **uma mensagem de oportunidade** (`topOpportunity`) baseada no perfil da empresa, na seguinte ordem de prioridade:

1. Regimes especiais de redução/zero (saúde, educação, cesta básica)
2. Simples Nacional + B2B (opção pelo regime regular)
3. Indústria (não-cumulatividade plena)
4. Exportador (imunidade IBS/CBS)
5. B2B com fornecedores em regime regular
6. Fallback genérico

### Precisão do Diagnóstico (`computePrecision`)

Função auxiliar que conta quantos dos **21 campos críticos** foram preenchidos:

```
Precisão% = campos_preenchidos / 21 × 100
```

Campos críticos incluem: Razão Social, CNPJ, Setor, Regime, Tipo de Operação, Colaboradores, Faturamento, ERP, Plano do Fornecedor, Cadastro, Emissão NF-e, NF Regular, Erros NF, Split Payment, Capital de Giro, Margem por Produto, Contratos, Diretoria, Treinamento, Preparação, Responsável Fiscal.

Este percentual aparece na tela de Relatório Final como indicador de "grau de confiança" do diagnóstico.

---

## 9. Motor de Geração do Plano de Ação

### Arquitetura

A função `generatePlan(data: AppData, diagnosis: DiagnosisResult): PlanAction[]` em `PlanoDeAcaoJornada.tsx` (linhas 360–550+) gera uma lista priorizada de ações baseada no perfil coletado.

### Estrutura de uma PlanAction

```typescript
interface PlanAction {
  id: string;            // Chave identificadora única (ex: "erp_adoption")
  phase: 1 | 2 | 3;     // Fase do plano
  title: string;         // Título da ação
  desc: string;          // Descrição detalhada
  motivo: string;        // Por que essa ação é necessária
  prazo: string;         // Prazo recomendado (ex: "7 a 15 dias")
  responsavel: string;   // Sugestão de responsável
  priority: "urgente" | "alta" | "media" | "baixa";
  eixo: string;          // Eixo relacionado
  source: string;        // Dado que originou a ação (rastreabilidade)
  confianca: "verde" | "amarelo" | "laranja" | "vermelho"; // Grau de certeza
}
```

### Estrutura das 3 Fases

| Fase | Prazo | Foco |
|---|---|---|
| Fase 1 | 7 a 15 dias | Ações urgentes/críticas: responsável, ERP, contratos, NF |
| Fase 2 | 30 a 60 dias | Estruturação: governança, cadastro, mapeamento de fornecedores |
| Fase 3 | 60 a 120 dias | Ações estruturantes: treinamento, simulação, validação final |

### Ações Condicionais (seleção)

**Fase 1 — Geradas condicionalmente:**
- `define_responsible` → se `taxResponsible === "ninguem"`
- `erp_adoption` → se ERP é planilha/nenhum
- `erp_contact` → sempre (urgente se sem ERP, urgente se com ERP)
- `top30_items` → sempre
- `contracts_review` → se contratos longos + sem/sem saber cláusula
- `mgmt_briefing` → se diretoria não acompanha
- `nf_formal` → se compras sem NF regular

**Fase 2 — Geradas condicionalmente:**
- `governance_setup` → sempre
- `catalog_std` → sempre (confiança varia por estado do cadastro)
- `supplier_abc` → sempre (mapeamento ABC de fornecedores)
- `fiscal_routine` → sempre
- `supplier_nf_quality` → se NFs com erros frequentes
- `split_simulation` → se desconhece ou conhece superficialmente Split Payment
- `pricing_formula` → se sem visibilidade de margem ou B2C
- `simples_option` → se Simples Nacional + B2B
- `multistate_erp` → se multi-estado

**Fase 3 — Geradas condicionalmente:**
- `team_training` → se sem treinamento
- `nfe_test` → se emissão não integrada
- `export_rules` → se exportador
- `gov_contracts` → se contratos com governo
- `regime_transition` → se Lucro Presumido
- `b2c_pricing_comms` → se B2C
- `marketplace_reform` → se marketplace
- `final_validation` → sempre (ação de encerramento)

### Integração com Base de Conhecimento (reformaContent.ts)

Cada ação do plano tem um `id` que pode ser mapeado para artigos da base de conhecimento via `planActionIds` definidos em cada `ReformaArticle`. Há 30 artigos com mapeamentos para 20+ action IDs diferentes.

A função `getArticleForAction(actionId)` em `PlanoDeAcaoJornada.tsx` busca o artigo correspondente e exibe um botão "Saiba mais" em cada card do plano.

### planExplanations.ts

Arquivo separado com explanações adicionais por action ID (estrutura `PlanItemExplanation`), usadas na UI para exibir contexto extra ao usuário de forma não-intrusiva.

---

## 10. Exportação em PDF

### Tecnologia

O PDF é gerado **100% no cliente** via `jsPDF 2.x` (sem dependência de servidor). A função `generateActionPlanPdf()` está em `client/src/lib/generatePdf.ts` (843 linhas).

### Fluxo de Geração

1. Usuário clica em "Baixar PDF" na Tela 10 (ou no menu lateral da Tela 9)
2. `generateActionPlanPdf(data, diagnosis, plan)` é chamada como `async`
3. Logo da plataforma é carregado via `fetch('/logo-png-branca.png')` e convertido para base64 (com cache em memória)
4. O documento é construído programaticamente com coordenadas absolutas em mm
5. `doc.save('relatorio-reforma-em-acao.pdf')` dispara download automático

### Estrutura do Documento

| Página | Conteúdo |
|---|---|
| 1 | **Capa:** fundo navy (#0f1e35), logo branco, badge de nível de prontidão (cor dinâmica), score/100, metadados da empresa, referências legais |
| 2 | **Dados da Empresa:** tabela em 2 colunas com todos os campos cadastrais |
| 3+ | **Diagnóstico:** score hero com barra, texto de conclusão personalizado, gráfico de barras por eixo (5 eixos com peso e legenda) |
| 4+ | **Riscos:** items agrupados por eixo com badges coloridos por nível (CRÍTICO/ALTO/MODERADO) |
| 5+ | **Plano de Ação:** blocos por fase com checkboxes `[ ]` e campos motivo/prazo/responsável |
| Última | **Checklist + Disclaimer:** checklist de 21 campos preenchidos com check/cross; aviso legal |

### Tratamento de Texto

A função `sanitizeText()` remove emojis, pares substitutos e caracteres fora da faixa Latin-1 (WinAnsi), substituindo unicode typográfico por ASCII equivalente antes de enviar ao jsPDF.

### Cores e Tipografia

- Tipografia: `helvetica` (bold e normal) — fonte embutida no jsPDF
- Paleta: navy `[15,30,53]`, orange `[249,115,22]`, green `[16,185,129]`, red `[220,38,38]`, amber `[202,138,4]`
- A cor principal do documento é dinâmica: muda conforme o nível de prontidão (CRÍTICO=vermelho, BAIXO=laranja, MODERADO=âmbar, AVANÇADO=verde)

### Limitações Conhecidas

- A fonte `helvetica` não suporta alguns caracteres especiais do português nativo — mitigado pelo `sanitizeText()`
- Sem paginação automática para textos muito longos: a função `checkPageBreak()` detecta overflow e cria nova página, mas requer teste manual para casos extremos
- Logo pode falhar em carregamento offline (gracefully degraded com fallback de texto)

---

## 11. Painel Administrativo

### Acesso

Rota `/admin`, protegida por `requireSuperAdmin`. O botão "Admin" aparece no header apenas para usuários com `role === "super_admin"`.

### Abas

**1. Empresas (`/api/admin/companies`)**
- Lista todas as empresas de todos os usuários
- Colunas: empresa, CNPJ, setor, regime, score de risco, data, proprietário
- Filtro por texto em tempo real
- Link para detalhe da empresa (`AdminCompanyDetail.tsx`)

**2. Usuários (`/api/admin/users`)**
- Lista todos os usuários com email, nome, role, data de criação
- Filtro por texto
- Ações disponíveis:
  - **Alterar role:** requer confirmação com senha do admin logado
  - **Excluir usuário:** requer confirmação com senha do admin logado (cascade deleta empresas do usuário)
  - **Reenviar e-mail de boas-vindas:** `POST /api/admin/resend-welcome/:id`
- Modal de criação de usuário com campos: nome, e-mail, senha (opcional — se omitida, gera senha aleatória de 12 chars), role, opção de envio de e-mail de boas-vindas

**3. E-mails (`/api/admin/email-logs`)**
- Tabela com todos os e-mails enviados
- Filtros: texto + tipo (password_reset/welcome/generic)
- Status com badge colorido (sent=verde, failed=vermelho)

**4. Webhooks (`/api/admin/webhook-logs`)**
- Tabela com todos os webhooks recebidos
- Filtros: texto + status (processed/ignored/error/auth_failed/duplicate)
- Modal de detalhe com headers e payload JSON completo do webhook

### Segurança de Ações Destrutivas

As ações "Alterar role" e "Excluir usuário" exigem que o admin redigite sua própria senha atual — a senha é validada no backend via bcrypt antes de executar a ação. Isso previne execução acidental ou por session hijacking.

---

## 12. Infraestrutura de E-mail e Webhooks

### SMTP2GO (`server/email.ts`)

Integração com a API REST do SMTP2GO via `node-fetch`. A função `sendEmail({ to, subject, html, text, kind })` realiza:

1. `POST https://api.smtp2go.com/v3/email/send` com payload JSON
2. Autenticação via `SMTP2GO_API_KEY`
3. Remetente: `EMAIL_SENDER` env var (ex: `"Reforma em Ação <noreply@reformaemacao.com.br>"`)
4. Registra resultado (sucesso ou falha) em `email_logs` via `storage.createEmailLog()`

**Tipos de e-mail enviados:**
- `password_reset` — Gerado em `POST /api/auth/forgot-password`, contém link seguro com token de 32 bytes para redefinir senha
- `welcome` — Gerado ao criar usuário via webhook Pagar.me ou via Painel Admin, com credenciais de acesso inicial

**Tratamento de falha:** Se o SMTP2GO retornar erro, o log é criado com `status: "failed"` e a operação principal (ex: reset de senha) **continua** — o token já foi gravado mesmo que o e-mail não chegue.

### Webhook Pagar.me (`server/routes.ts`)

Endpoint `POST /api/webhook/pagarme`:

1. Autenticação HTTP Basic (`PAGARME_WEBHOOK_USER` + `PAGARME_WEBHOOK_PASSWORD`)
2. Log imediato do webhook (antes de qualquer processamento) em `webhook_logs`
3. Deduplicação por `externalId` — se o evento já foi processado, retorna 200 sem reprocessar
4. Processa eventos `order.paid` e `charge.paid`:
   - Extrai `customer.email` e `customer.name` do payload
   - Cria usuário via `storage.createUser()` com senha aleatória
   - Envia e-mail de boas-vindas com credenciais
5. Retorna 200 em todos os casos (incluindo falhas de negócio) — evita retentativas do Pagar.me

**Estado atual:** 39 logs de webhook — indica integração ativa, provavelmente em ambiente sandbox/homologação.

### Webhook Manual (`POST /api/webhook/new-user`)

Endpoint alternativo para criação manual de usuário via `ADMIN_KEY`. Usado para integrações fora do Pagar.me.

---

## 13. Integrações com APIs Externas

### BrasilAPI — Consulta de CNPJ

**Endpoint:** `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`  
**Quando:** Automaticamente no `useEffect` de `PlanoDeAcaoJornada.tsx` toda vez que `data.cnpj` atingir 14 dígitos

**Dados extraídos e auto-preenchidos:**
- `razao_social` → `companyName`
- `nome_fantasia` → `nomeFantasia`
- `cnae_fiscal` + `cnae_fiscal_descricao` → `cnaeCode`
- `uf` → `estado`
- `municipio` → `municipio`

**Comportamento em erro:** Mensagem de erro exibida abaixo do campo CNPJ; dados não são preenchidos mas o usuário pode preencher manualmente.

**Latência:** BrasilAPI é uma API pública sem chave, podendo ter rate limiting em uso intenso.

### IBGE — Lista de Municípios

**Endpoint:** `https://servicodados.ibge.gov.br/api/v1/localidades/estados/{uf}/municipios`  
**Quando:** Automaticamente no `useEffect` toda vez que `data.estado` muda

**Uso:** Popula o dropdown de municípios da Tela 1. Normaliza o nome do município preenchido via BrasilAPI para o nome canônico do IBGE (via `normalizeStr`).

**Sem autenticação** — API pública gratuita do IBGE.

### SMTP2GO — E-mail Transacional

Ver seção 12.

### Pagar.me — Pagamentos (via Webhook)

O Pagar.me não é integrado diretamente como API de cobrança na aplicação (não há checkout no produto). A integração existe apenas no sentido de **receber confirmações de pagamento** via webhook, que disparam a criação automática de usuários. O modelo sugere que a venda ocorre externamente (ex: landing page, Hotmart, ou link de pagamento Pagar.me) e a plataforma é notificada para liberar acesso.

---

## 14. Sistema de Design e UI/UX

### Tokens de Design (`client/src/index.css`)

O projeto usa **TailwindCSS 4** com configuração inline via `@theme`. Não há `tailwind.config.js` — toda a customização é feita via variáveis CSS.

**Paleta de cores (modo claro):**

| Token | Valor HSL | Hex aproximado | Uso |
|---|---|---|---|
| `--primary` | `30 100% 48%` | `#F57C00` | Cor de ação principal (laranja) |
| `--background` | `210 40% 98%` | `#f8fafc` | Fundo de conteúdo |
| `--card` | `0 0% 100%` | `#ffffff` | Cards |
| `--navbar` | `218 74% 16%` | `#1a3166` | Header/navbar |
| `--destructive` | `0 72% 51%` | `#dc2626` | Erros |
| `--radius` | `0.75rem` | — | Border radius base |

**Tipografia:**
- `--font-sans`: `Inter` (corpo de texto)
- `--font-heading`: `Plus Jakarta Sans` (títulos h1–h6)

Ambas as fontes são carregadas via CDN Google Fonts no `index.html`.

### Componentes

O projeto usa **shadcn/ui** com componentes Radix UI:
- `Button`, `Card`, `Badge`, `Input`, `Label`, `Alert`, `Dialog`, `Sheet`
- `Select`, `RadioGroup`, `Tabs`, `ScrollArea`, `Separator`, `Progress`
- `Tooltip` (em alguns contextos)

Componentes customizados notáveis:
- `MainLayout` — wrapper com header fixo (logo + nav + perfil) e footer
- `AppLogo` — renderização do logo com fallback de texto
- `CheckRow` / `RadioRow` — componentes de seleção internos ao `PlanoDeAcaoJornada`

### Experiência do Usuário

**Wizard de coleta de dados:**
- Barra de progresso animada no topo (steps 1–6)
- Scroll automático para a próxima pergunta após seleção de uma opção (`scrollToNext`)
- Validação no submit com scroll e foco automático para o campo com erro
- Mensagem de erro contextual inline

**Tela de Diagnóstico:**
- Cards por eixo com barra de score horizontal
- Items de risco agrupados por nível (CRÍTICO → ALTO → MODERADO)
- "Oportunidade principal" destacada com card especial

**Tela de Plano de Ação:**
- Menu lateral (Sheet) para navegação entre fases
- Cada card de ação tem indicador de fase (cor), prioridade, prazo, responsável, motivo e link para artigo relacionado
- Ciclo de status clicável: `pendente → em_andamento → concluida` (ícone colorido)

**Tema escuro:**
O arquivo CSS define `@custom-variant dark (&:is(.dark *))` — suporte a dark mode preparado mas não ativado por padrão. Não há toggle de tema exposto ao usuário.

### Dashboard Educacional ("O Que Muda?")

15 artigos organizados em 7 categorias:
- Todos, Fundamentos, Operações e Tecnologia, Setores da Economia, Regimes Tributários, Contratos e Preços, Planejamento e Adequação

Funcionalidades:
- Busca full-text por título e sumário
- Filtro por categoria
- Tempo de leitura estimado por artigo
- Modal de artigo com seções (O que muda, Impacto, O que fazer, Referências)
- Artigos relacionados clicáveis dentro do modal
- Barra de scroll customizada com cor da marca

---

## 15. Segurança, Performance e Recomendações

### 15.1 Problemas de Segurança

#### CRÍTICO — Senhas hardcoded no código-fonte

**Localização:** `server/index.ts`, função `seedDefaultUsers()`

```typescript
{ email: "admin@reforma.com",   password: "reforma2025", role: "super_admin" },
{ email: "teste@reforma.com",   password: "teste123" },
```

**Risco:** Qualquer pessoa com acesso ao repositório (GitHub, forks, colaboradores) tem credenciais de produção, incluindo uma conta `super_admin`.

**Recomendação:** Remover completamente o seed de credenciais reais. Se senhas iniciais forem necessárias, gerar via variável de ambiente (`SEED_ADMIN_PASSWORD`) ou usar um script de seed separado executado manualmente, nunca no boot de produção.

---

#### ALTO — Token de reset em texto plano no banco

**Localização:** `shared/schema.ts` (coluna `resetToken`) + `server/routes.ts` (comparação com `===`)

**Risco:** Um dump do banco de dados expõe tokens de reset válidos que podem ser usados para comprometer contas.

**Recomendação:** Armazenar apenas `SHA-256(token)` no banco:
```typescript
// Ao criar:
const raw = crypto.randomBytes(32).toString('hex');
const stored = crypto.createHash('sha256').update(raw).digest('hex');
// Link com: raw (nunca stored)

// Ao validar:
const stored = crypto.createHash('sha256').update(inputToken).digest('hex');
// Comparar stored com banco
```

---

#### ALTO — SESSION_SECRET com fallback hardcoded

**Localização:** `server/index.ts`

```typescript
secret: process.env.SESSION_SECRET || "reforma-em-acao-secret-2024"
```

**Risco:** Em ambiente de produção sem `SESSION_SECRET` configurado, o segredo é público e qualquer pessoa pode forjar cookies de sessão válidos.

**Recomendação:** Fazer o servidor **falhar no boot** se `SESSION_SECRET` não estiver definido em produção:
```typescript
if (NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in production');
}
```

---

#### MÉDIO — Dados sensíveis em localStorage sem criptografia

**Localização:** `client/src/lib/store.tsx`, chave `reforma_diagnosis_draft_v1`

**Risco:** CNPJ, razão social, dados de faturamento e estrutura operacional ficam expostos em qualquer computador compartilhado ou ao acesso por extensões maliciosas.

**Recomendação:** Limitar o que é persistido no localStorage (ex: apenas `companyId` e campos não-sensíveis) ou criptografar com uma chave derivada da sessão. Alternativa: salvar rascunhos no servidor via `PATCH /api/companies/:id` com debounce.

---

#### MÉDIO — Ausência de rate limiting

Endpoints sensíveis (`/api/auth/login`, `/api/auth/forgot-password`) não têm rate limiting implementado.

**Recomendação:** Adicionar `express-rate-limit`:
```typescript
import rateLimit from 'express-rate-limit';
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
```

---

#### BAIXO — Ausência de CSRF protection explícita

As rotas de mutação usam `credentials: "include"` no frontend com cookies SameSite: lax. O `sameSite: "lax"` oferece proteção básica contra CSRF para navegações cross-site, mas não para requisições via JavaScript de origens cruzadas.

**Recomendação:** Adicionar token CSRF via `csurf` ou usar `sameSite: "strict"` nos cookies (com o trade-off de quebrar links externos).

---

### 15.2 Problemas de Confiabilidade

#### ALTO — Tarefas do Plano de Ação não persistidas

**Problema:** O estado `taskStatuses` (pendente/em_andamento/concluida) vive apenas no `useState` do componente `PlanoDeAcaoJornada`. Ao recarregar a página, navegar para outra rota ou fechar o browser, todo o progresso é perdido.

**Impacto:** Usuários que voltam para verificar o plano perdem o acompanhamento realizado.

**Recomendação:** Usar a infraestrutura já existente (`PUT /api/companies/:id/tasks` + tabela `implementation_tasks`) para persistir os status. O backend e o schema já suportam isso — falta apenas integrar o frontend.

---

#### ALTO — Motor de diagnóstico sem testes

**Problema:** A função `computeReadiness` (200+ linhas de lógica de risco) e `generatePlan` (200+ linhas) não têm testes unitários. Mudanças de lógica podem introduzir regressões silenciosas.

**Recomendação:** Criar suite de testes com Vitest cobrindo cenários extremos (empresa perfeita, empresa com todos os riscos críticos, perfis setoriais específicos). As funções são puras e determinísticas — são ideais para testes unitários.

---

#### MÉDIO — Arquivo PlanoDeAcaoJornada.tsx com 2.683 linhas

**Problema:** Um único arquivo contém: 2 funções de engine (computeReadiness + generatePlan), 1 função auxiliar (computePrecision), todas as constantes de configuração (SPECIAL_REGIMES, SECTOR_OPTIONS, SCREEN_LABELS), e 10 telas de UI.

**Recomendação:** Refatorar em módulos separados:
- `lib/computeReadiness.ts` — motor de diagnóstico
- `lib/generatePlan.ts` — motor de plano
- `components/jornada/` — um componente por tela

---

### 15.3 Problemas de Performance

#### MÉDIO — Sem lazy loading de rotas

Todas as 15 páginas são importadas estaticamente em `App.tsx`, gerando um bundle inicial maior.

**Recomendação:**
```typescript
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const DashboardEducational = lazy(() => import('./pages/Dashboard-Educational'));
// Envolver em <Suspense fallback={<Loader />}>
```

---

#### BAIXO — BrasilAPI chamada a cada tecla no campo CNPJ

O `useEffect` dispara para cada mudança em `data.cnpj`. A lógica aguarda 14 dígitos, mas não há debounce — o fetch é disparado imediatamente ao atingir 14 chars.

**Recomendação:** Adicionar debounce de 300ms ou disparar apenas no `onBlur` do campo.

---

### 15.4 Recomendações de Produto

| Prioridade | Ação |
|---|---|
| CRÍTICA | Remover senhas hardcoded do seed (seção 15.1) |
| CRÍTICA | Configurar `SESSION_SECRET` obrigatório em produção |
| ALTA | Implementar persistência de status de tarefas (`implementation_tasks`) |
| ALTA | Hash do token de reset antes de armazenar no banco |
| ALTA | Adicionar rate limiting nos endpoints de auth |
| MÉDIA | Habilitar Simulador Financeiro e Simulador Simples Nacional (UIs já existem como stub) |
| MÉDIA | Adicionar testes unitários para `computeReadiness` e `generatePlan` |
| MÉDIA | Lazy loading de rotas no frontend |
| MÉDIA | Limitar dados sensíveis no localStorage |
| BAIXA | Refatorar PlanoDeAcaoJornada.tsx em módulos menores |
| BAIXA | Implementar toggle de tema dark/light (suporte já preparado no CSS) |
| BAIXA | Debounce na chamada BrasilAPI |

---

## Apêndice A — Variáveis de Ambiente Requeridas

| Variável | Obrigatória | Descrição |
|---|---|---|
| `RAILWAY_DATABASE_URL` | Sim (produção) | URL de conexão PostgreSQL Railway |
| `DATABASE_URL` | Fallback | URL de conexão PostgreSQL Replit |
| `SESSION_SECRET` | Sim (produção) | Segredo para assinatura de cookies de sessão |
| `ADMIN_KEY` | Sim | Chave para endpoints admin sem sessão |
| `SMTP2GO_API_KEY` | Sim (e-mail) | Chave da API SMTP2GO |
| `EMAIL_SENDER` | Sim (e-mail) | Endereço remetente dos e-mails |
| `PAGARME_WEBHOOK_USER` | Sim (webhook) | Usuário HTTP Basic para webhook Pagar.me |
| `PAGARME_WEBHOOK_PASSWORD` | Sim (webhook) | Senha HTTP Basic para webhook Pagar.me |
| `NODE_ENV` | Recomendada | `"production"` em produção |
| `PORT` | Opcional | Porta do servidor (default: 5000) |
| `APP_URL` | Sim (e-mail) | URL base para links nos e-mails (ex: `https://app.reformaemacao.com.br`) |

---

## Apêndice B — Referências Legais Implementadas

| Norma | Status de implementação |
|---|---|
| EC 132/2023 | Referenciada no diagnóstico, base de conhecimento e PDF |
| LC 214/2025 | Regras de IBS/CBS, crédito, Simples, Split Payment implementadas |
| LC 227/2026 | Split Payment, regras de transição implementadas |
| NT 2025.002 v1.34 | cClassTrib, cCredPres mencionados na base de conhecimento |
| NT 2026.001 v1.00/v1.01 | CT-e e BPe Split Payment na base de conhecimento |
| NT 004/005 SE-CGNFSe | NFS-e nacional na base de conhecimento |
| Guia GT-08 | Impactos administrativos na base de conhecimento |

---

*Fim do documento de auditoria técnica — REFORMA EM AÇÃO — 30/05/2026*
