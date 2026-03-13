# REFORMA EM AÇÃO

## Overview
Professional React web application for Brazilian business owners, employees, and accountants to understand the operational impacts of Brazil's Tax Reform (EC 132/2023, LC 214/2025, LC 227/2026). Collects company data and generates a detailed, personalized action plan.

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
- `client/src/pages/Assessment.tsx` — 6-step onboarding (saves company to DB on completion)
- `client/src/pages/FinalChecklist.tsx` — 9 validators with DB-persisted status

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

## Pages
Home, Assessment (6 steps), Dashboard Educational, Dashboard Executive, Risk Assessment, Financial Simulation, System Management, Supply Chain, Pricing Strategy, Routines, Implementation Roadmap, Final Checklist
