# REFORMA EM AÇÃO

## Overview
Professional React web application for Brazilian business owners, employees, and accountants to understand the operational impacts of Brazil's Tax Reform (EC 132/2023, LC 214/2025, LC 227/2026). Guides users through a unified 11-screen journey: 7 rich data-collection screens → auto-computed multi-axis diagnosis (5 axes) → dynamic personalized action plan (with motivo/prazo/responsável per task) → final report + PDF export (PDF only at end).

## Data Collection Screens (Telas 1–7)
- **Tela 1 — Cadastro da Empresa**: Razão Social, Nome Fantasia, CNPJ (validated), CNAE, Estado/Município, Responsável (name, role, email, phone)
- **Tela 2 — Perfil da Operação**: Sector (6 options), Regime Tributário, Faturamento Anual, Colaboradores, Estabelecimentos, Tipo de operação, Área geográfica, Regimes especiais/benefícios (18 options)
- **Tela 3 — Como a Empresa Vende**: B2B/B2C/misto, Canais de venda (5 checkboxes), Multi-município, Contratos longo prazo, Sensibilidade de preço, Exporta/Marketplace/Governo toggles
- **Tela 4 — Como a Empresa Compra**: Qtd fornecedores, % Simples, Regularidade de NF, Despesas principais (6 checkboxes), Erros de NF, Importações
- **Tela 5 — Sistemas e Emissão Fiscal**: ERP, Emissão NF-e, Tipos de documentos fiscais (4 checkboxes), Volume mensal, Integração financeira, Plano do fornecedor, Cadastro padronizado, Responsável interno
- **Tela 6 — Financeiro, Preço e Caixa**: Meios de recebimento (6 checkboxes), Prazo médio, Margem de lucro, Capital de giro, Reajuste de preços, Margem por produto, Split Payment awareness
- **Tela 7 — Governança e Maturidade**: Cláusula de revisão (conditional), Responsável fiscal, Responsável ERP, Diretoria ciente, Preparação, Treinamento, Maturidade, Maior preocupação

## Multi-Axis Diagnosis (Tela 8)
5 axes with weighted scores (Fiscal 25%, Compras 20%, Comercial 20%, Financeiro 20%, Governança 15%):
- Fiscal/Documental — ERP, catalog, vendor plan, fiscal responsible
- Compras/Créditos — Simples %, NF quality, cost structure
- Comercial/Contratos — long-term contracts, sector impact, multi-state
- Financeiro/Caixa — Split Payment, margin, working capital, price flexibility
- Governança/Sistemas — management awareness, preparation, training, maturity

## Dynamic Action Plan (Tela 9)
Each action has: title, motivo (why), prazo (deadline), responsável (suggested owner), priority (urgente/alta/média/baixa), clickable status cycle (pendente → em andamento → concluída)

## PDF Export (Tela 10)
6-section PDF: 1) Company profile, 2) Reform context, 3) Multi-axis diagnosis scores, 4) All risk items (crítico/alto/moderado), 5) Full dynamic plan with motivo/prazo/responsável, 6) Readiness checklist

## Database Fields
All new fields stored in `extendedData` JSONB column (backward-compatible); existing 20+ columns preserved for data continuity.

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
- `client/src/pages/Dashboard-Educational.tsx` — "O Que Muda?" knowledge base: 15 articles, search, category filters, article modal with related articles
- `client/src/lib/reformaContent.ts` — Article data, types (ReformaArticle), and config (CATEGORY_CONFIG, DIFFICULTY_CONFIG)
- `client/src/pages/PlanoDeAcaoJornada.tsx` — Unified 11-screen journey (Telas 0–10); all old plan pages (Assessment, Dashboard, RiskAssessment, SystemManagement, SupplyChain, PricingStrategy, Routines, ImplementationRoadmap, FinalChecklist) removed
- `client/src/pages/MyPlans.tsx` — User's list of saved company diagnoses
- `client/src/lib/generatePdf.ts` — PDF export via jsPDF (called only from Tela 10)

## API Endpoints
- `POST /api/auth/login` — Login with email+password, sets session cookie
- `GET /api/auth/me` — Check current session / get user info
- `POST /api/auth/logout` — Destroy session
- `POST /api/admin/create-user` — Create user (requires adminKey)
- `GET /api/my/companies` — List logged-in user's companies
- `POST /api/companies` — Create company (auto-associates with logged-in user)
- `GET /api/companies/:id` — Get company by ID (checks ownership)
- `PATCH /api/user` — Update user name/email (requires auth, duplicate email check)
- `POST /api/user/change-password` — Change password (bcrypt validate current + hash new; min 8 chars)
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

## Plan Journey (Unified 11-Screen Linear Flow)
Single file `client/src/pages/PlanoDeAcaoJornada.tsx` manages the full journey with internal screen state (0–10):

**Data Collection (Telas 1–7):**
1. Cadastro da Empresa — company name, CNPJ, sector
2. Enquadramento Tributário — regime, special regimes (18 options)
3. Como a Empresa Vende — B2B/B2C, geographic scope (simplified radio)
4. Como a Empresa Compra — cost structure, supplier count, Simples supplier %
5. Sistemas e Emissão Fiscal — ERP type, NF-e emission method, invoice volume
6. Financeiro e Caixa — monthly revenue, profit margin, Split Payment awareness, main concern
7. Contratos e Governança — contracts, price revision clause, tax responsible, employee count

**Output Screens (Telas 8–10, computed from data):**
8. Diagnóstico Consolidado — auto-computed risk score (0–100) + labeled risk items with recommended actions
9. Plano de Ação — personalized 3-phase (7, 30, 51 days) task plan with checkable items
10. Relatório Final — summary + PDF download (PDF ONLY here, not before)

Key behaviors:
- If `companyId` exists on mount → jump to Tela 8 (diagnosis) directly
- Company saved to DB after Tela 7 submission (with computed riskScore)
- `computeRisk()` and `generatePlan()` are pure functions derived from AppData
- PDF via `generateActionPlanPdf(data)` from `client/src/lib/generatePdf.ts`

## Special Regimes (LC 214/2025)
- `specialRegimes` text array column in companies table
- Assessment step 3 captures regime selection with 22 options across 12 categories
- Categories: Saude (60%), Educacao (60%), Alimentos (zero/60%), Agro (60%), Transporte (60%), Profissionais (30%), Imobiliario (especifico), Combustiveis (monofasico), Financeiro (cumulativo), Cooperativas, ZFM (credito presumido), Turismo (60%), Higiene (60%), Cultura (60%/zero), Imposto Seletivo (adicional)
- Conditional content in: Dashboard-Educational (regime cards), FinancialSimulation (rate adjustment), PricingStrategy (regime impact card)
- PDF export includes selected regimes with descriptions

## Route Structure
- `/inicio` — Hub page (4 path cards)
- `/plano-de-acao` — PlanoDeAcaoJornada (unified 11-screen journey)
- `/plano-de-acao/meus-planos` — MyPlans (list of saved company diagnoses)
- `/simulador-financeiro` — Financial Simulator (independent tool)
- `/simulador-simples` — Simples Nacional Simulator (independent tool)
- `/o-que-muda` — Educational Dashboard (independent tool)

All old sub-routes (`/plano-de-acao/avaliacao`, `/plano-de-acao/visao-executiva`, `/plano-de-acao/diagnostico`, etc.) redirect to `/plano-de-acao`.

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
