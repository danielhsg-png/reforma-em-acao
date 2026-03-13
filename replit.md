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
- **State Management**: React Context API (AppProvider/useAppStore) synced with server

## Key Files
- `shared/schema.ts` — Drizzle schema: companies, checklist_items, implementation_tasks
- `server/db.ts` — Database connection pool
- `server/storage.ts` — IStorage interface with DatabaseStorage implementation
- `server/routes.ts` — REST API routes (/api/companies, /api/checklist, /api/tasks)
- `client/src/lib/store.tsx` — Global state with API persistence (saveCompany, loadCompany)
- `client/src/App.tsx` — Routes and CompanyLoader for auto-restoring saved company
- `client/src/components/layout/MainLayout.tsx` — Layout with Sheet navigation drawer
- `client/src/pages/Assessment.tsx` — 11-step onboarding with special regimes step (saves company to DB on completion)
- `client/src/pages/FinalChecklist.tsx` — 9 validators with DB-persisted status
- `client/src/lib/generatePdf.ts` — PDF export via jsPDF

## API Endpoints
- `POST /api/companies` — Create company profile
- `GET /api/companies/:id` — Get company by ID
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

## Module Pages (Enriched)
1. **Dashboard Educational** — Split Payment tabs, NF-e new fields, Cashback, Principio do Destino, transition timeline 2026-2033, penalty warning
2. **Risk Assessment** — 8 risk items with legal references, dynamic scoring
3. **Financial Simulation** — Year-by-year transition rates (2026-2033), Split Payment tab, credit breakdown
4. **System Management** — ERP tasks, NT 2025.002 field grid (cClassTrib/cCredPres/CST/aliquotas), impacted fiscal documents, catalog standards
5. **Supply Chain** — 12-row credit map by expense category, Simples Nacional opt-out strategy, supplier A/B/C matrix
6. **Pricing Strategy** — B2B vs B2C strategy, Split Payment cash flow impact, contract renegotiation, pricing formula
7. **Routines** — Weekly audit (30 min), channel reconciliation (1 hour), monthly accountant meeting, NF-e field verification
8. **Implementation Roadmap** — 51-day 3-phase plan with progress bar, enriched tasks with legal references
9. **Final Checklist** — 9 validators with DB persistence
10. **Dashboard Executive** — Tabs for executive view, timeline, operations, strategic recommendations, PDF export

## Special Regimes (LC 214/2025)
- `specialRegimes` text array column in companies table
- Assessment step 3 captures regime selection with 22 options across 12 categories
- Categories: Saude (60%), Educacao (60%), Alimentos (zero/60%), Agro (60%), Transporte (60%), Profissionais (30%), Imobiliario (especifico), Combustiveis (monofasico), Financeiro (cumulativo), Cooperativas, ZFM (credito presumido), Turismo (60%), Higiene (60%), Cultura (60%/zero), Imposto Seletivo (adicional)
- Conditional content in: Dashboard-Educational (regime cards), FinancialSimulation (rate adjustment), PricingStrategy (regime impact card)
- PDF export includes selected regimes with descriptions

## Key Technical Details
- Test aliquotas 2026: CBS 0.9% + IBS 0.1% = 1.0%
- Full aliquota reference: CBS ~8.8%, IBS ~17.7%, combined ~26.5%
- cClassTrib = tax classification per item; cCredPres = presumed credit indicator
- Split Payment: automatic retention at card acquirer, PIX (central bank), registered boleto
- Payroll does NOT generate credit; energy/rent PJ/freight/software generate full credit
- Simples Nacional can opt to collect IBS/CBS outside DAS (LC 214/2025)
- Penalty: 1% of operation value for NF-e without IBS/CBS fields (LC 214/2025, art. 63)
