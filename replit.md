# REFORMA EM AÇÃO

## Overview
Professional React web application for Brazilian business owners, employees, and accountants to understand the operational impacts of Brazil's Tax Reform (EC 132/2023, LC 214/2025, LC 227/2026). Collects company data through an 11-step onboarding (including special/differentiated tax regimes) and generates a detailed, personalized action plan with 9 modules plus PDF export.

## Legal References Incorporated
- EC 132/2023 (Constitutional Amendment)
- LC 214/2025 (Main regulatory law for CBS/IBS)
- LC 227/2026 (Complementary regulations, Split Payment)
- NT 2025.002 v1.34 (NF-e IBS/CBS fields: cClassTrib, cCredPres, grupo IBS/CBS)
- NT 2026.001 v1.00/v1.01 (CT-e and BPe Split Payment linkage)
- NT 004/005 SE-CGNFSe (NFS-e national layout for IBS/CBS)
- GT-08 Guide (Administrative impacts)

## Architecture
- **Frontend**: React + TypeScript + Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: express-session + bcryptjs (server-side sessions, cookie-based)
- **State Management**: React Context API (AppProvider/useAppStore) synced with server, includes auth state

## Authentication Flow
- Login page at `/` (no self-registration — admin creates users via API)
- After login, redirects to `/inicio` (hub page with 4 main paths: Plano de Ação, Simulador Financeiro, Simulador Simples Nacional, O Que Muda?)
- All API routes (except auth) require active session
- Companies are associated with users via `userId` column
- Admin creates users via `POST /api/admin/create-user` with `adminKey`
- Session cookie persists 7 days

## Key Files
- `shared/schema.ts` — Drizzle schema: users, companies, checklist_items, implementation_tasks
- `server/db.ts` — Database connection pool
- `server/storage.ts` — IStorage interface with DatabaseStorage implementation
- `server/routes.ts` — REST API routes with session auth middleware
- `client/src/lib/store.tsx` — Global state with auth (login/logout/checkAuth) + API persistence
- `client/src/App.tsx` — Auth-gated routing (Login if unauthenticated, AuthenticatedRoutes if logged in)
- `client/src/pages/Login.tsx` — Login page with platform info
- `client/src/pages/HomePage.tsx` — Post-login hub with 4 main paths (Plano de Ação, Simulador Financeiro, Simples, O Que Muda?)
- `client/src/pages/MyPlans.tsx` — User's plan list (company name + CNPJ), "Gerar Novo Plano" button
- `client/src/components/layout/MainLayout.tsx` — Layout with Sheet navigation drawer + logout
- `client/src/pages/Assessment.tsx` — 11-step onboarding with special regimes step
- `client/src/pages/FinalChecklist.tsx` — 9 validators with DB-persisted status
- `client/src/lib/generatePdf.ts` — PDF export via jsPDF

## API Endpoints
- `POST /api/auth/login` — Login with email+password, sets session cookie
- `GET /api/auth/me` — Check current session / get user info
- `POST /api/auth/logout` — Destroy session
- `POST /api/admin/create-user` — Create user (requires adminKey)
- `GET /api/my/companies` — List logged-in user's companies
- `POST /api/companies` — Create company (auto-associates with logged-in user)
- `GET /api/companies/:id` — Get company by ID (checks ownership)
- `PATCH /api/companies/:id` — Update company
- `GET /api/companies/:id/checklist` — Get checklist items
- `PUT /api/companies/:id/checklist` — Upsert all checklist items
- `PATCH /api/checklist/:id` — Update single checklist item status
- `GET /api/companies/:id/tasks` — Get implementation tasks
- `PUT /api/companies/:id/tasks` — Upsert all tasks
- `PATCH /api/tasks/:id` — Toggle task completion

## Design
- Fonts: Inter (UI) + Plus Jakarta Sans (headings)
- Primary: blue (#221 83% 53%), Accent: amber (#43 74% 49%)
- App name always uppercase: REFORMA EM AÇÃO
- Footer disclaimer on all report pages

## Plan Journey (8 Steps with PlanStepper)
All 8 plan pages share a `PlanStepper` component (`client/src/components/PlanStepper.tsx`) showing:
- Progress bar (current step / 8)
- Desktop: clickable numbered circles for all steps
- Mobile: step title + description + dot bar navigation
- Each step shows its contribution to the final report

Steps (all content vertically sequential, no internal tabs):
1. **Visão Executiva** (Dashboard) — Executive overview, special regimes, PDF export → Report: contexto
2. **Diagnóstico de Risco** (RiskAssessment) — 8 risk items, competitiveness comparison, 1% penalty alert → Report: score de risco
3. **Sistemas e Cadastros** (SystemManagement) — Split Payment, ERP tasks, NF-e fields, catalog standards (all sequential sections, no tabs) → Report: prontidão tecnológica
4. **Fornecedores** (SupplyChain) — Credit map, supplier matrix, Simples opt-out → Report: mapa de créditos
5. **Precificação** (PricingStrategy) — Destination principle, cashback, pricing formula, contract renegotiation → Report: estratégia de preços
6. **Rotinas** (Routines) — Weekly audit, reconciliation, NF-e verification → Report: checklist operacional
7. **Cronograma** (ImplementationRoadmap) — 51-day 3-phase plan with progress → Report: roadmap executivo
8. **Revisão Final** (FinalChecklist) — 9 validators with DB persistence → Report: relatório PDF

## Special Regimes (LC 214/2025)
- `specialRegimes` text array column in companies table
- Assessment step 3 captures regime selection with 22 options across 12 categories
- Categories: Saude (60%), Educacao (60%), Alimentos (zero/60%), Agro (60%), Transporte (60%), Profissionais (30%), Imobiliario (especifico), Combustiveis (monofasico), Financeiro (cumulativo), Cooperativas, ZFM (credito presumido), Turismo (60%), Higiene (60%), Cultura (60%/zero), Imposto Seletivo (adicional)
- Conditional content in: Dashboard-Educational (regime cards), FinancialSimulation (rate adjustment), PricingStrategy (regime impact card)
- PDF export includes selected regimes with descriptions

## Route Structure (Portuguese)
Main entry points:
- `/inicio` — Hub page (4 independent paths)
- `/plano-de-acao` — Plan list (MyPlans)
- `/simulador-financeiro` — Financial Simulator (independent tool)
- `/simulador-simples` — Simples Nacional Simulator (independent tool)
- `/o-que-muda` — Educational Dashboard (independent tool)

Plan sub-routes (nested under `/plano-de-acao/`):
- `/plano-de-acao/avaliacao` — 11-step Assessment
- `/plano-de-acao/visao-executiva` — Executive Dashboard
- `/plano-de-acao/diagnostico` — Risk Assessment
- `/plano-de-acao/sistemas` — System Management
- `/plano-de-acao/fornecedores` — Supply Chain
- `/plano-de-acao/precificacao` — Pricing Strategy
- `/plano-de-acao/rotinas` — Routines
- `/plano-de-acao/cronograma` — Implementation Roadmap
- `/plano-de-acao/checklist` — Final Checklist
- `/plano-de-acao/analise-produtos` — Product Analysis
- `/plano-de-acao/preocupacoes` — My Concerns

Old English routes redirect to new Portuguese routes for compatibility.

## Bonus Tools (3 Extra Pages)
1. **Product Analysis** (`/plano-de-acao/analise-produtos`) — Input up to 10 products/services, select from 30 tax categories, get per-item impact analysis (alíquota efetiva, reduction %, credit availability, IS indicator, legal references, alerts/opportunities) plus portfolio summary
2. **Simples Nacional Simulator** (`/simulador-simples`) — 6 collapsible input blocks: (1) Dados Básicos (anexo, RBT12, faturamento, ano), (2) Folha e Pró-labore (folha, pró-labore, encargos, sazonalidade, Fator R calc), (3) Perfil Comercial (B2B/B2C split, PJ contribuinte %, sensibilidade preço, valorização de crédito), (4) Compras e Créditos (insumos, fornecedores Simples/Regular %, despesas creditáveis %, concentração), (5) Margem e Contratos (margem bruta/líquida, contratos longo prazo, cláusula reajuste, facilidade repasse), (6) Complexidade Operacional (ERP, emissão fiscal, notas/mês, interestadual, filiais, apoio contábil). Output: 3 tabs — Comparativo (DAS vs Regular com créditos detalhados), Impacto nos Clientes (análise B2B com perfil comercial), Análise de Cenário (scoring migrar vs permanecer + alertas contextuais de complexidade/contratos/repasse)
3. **My Concerns** (`/plano-de-acao/preocupacoes`) — Up to 5 free-text questions, keyword-based knowledge base (15 topics: preço, crédito, split payment, simples, NF-e, multa, cronograma, fornecedor, contrato, destino, cashback, contador, IS, imobiliário, ZFM), clickable topic chips, structured answers with legal refs + practical tips + risk alerts

## Key Technical Details
- Test aliquotas 2026: CBS 0.9% + IBS 0.1% = 1.0%
- Full aliquota reference: CBS ~8.8%, IBS ~17.7%, combined ~26.5%
- cClassTrib = tax classification per item; cCredPres = presumed credit indicator
- Split Payment: automatic retention at card acquirer, PIX (central bank), registered boleto
- Payroll does NOT generate credit; energy/rent PJ/freight/software generate full credit
- Simples Nacional can opt to collect IBS/CBS outside DAS (LC 214/2025)
- Penalty: 1% of operation value for NF-e without IBS/CBS fields (LC 214/2025, art. 63)
