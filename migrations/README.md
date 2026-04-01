# Migrations — REFORMA EM AÇÃO

Este diretório contém os arquivos SQL de migração do banco de dados PostgreSQL.
As migrações são incrementais e compatíveis com PostgreSQL 14+ e Supabase.

---

## Estrutura

| Arquivo | Descrição |
|---|---|
| `001_create_users.sql` | Tabela de usuários autenticados |
| `002_create_companies.sql` | Perfis de empresas com dados do diagnóstico |
| `003_create_checklist_items.sql` | Itens de checklist de conformidade por empresa |
| `004_create_implementation_tasks.sql` | Tarefas do plano de ação por empresa |

---

## Como executar manualmente

### Opção 1 — psql (CLI)

```bash
psql $DATABASE_URL -f migrations/001_create_users.sql
psql $DATABASE_URL -f migrations/002_create_companies.sql
psql $DATABASE_URL -f migrations/003_create_checklist_items.sql
psql $DATABASE_URL -f migrations/004_create_implementation_tasks.sql
```

Execute **na ordem numérica** — as tabelas têm dependências via chaves estrangeiras.

---

### Opção 2 — Supabase (SQL Editor)

1. Acesse o painel do Supabase → **SQL Editor**
2. Copie e execute cada arquivo na ordem:
   - `001_create_users.sql`
   - `002_create_companies.sql`
   - `003_create_checklist_items.sql`
   - `004_create_implementation_tasks.sql`

---

### Opção 3 — Drizzle ORM (recomendado para desenvolvimento)

O projeto usa Drizzle ORM. Para sincronizar o schema diretamente:

```bash
npm run db:push
```

Este comando lê o schema em `shared/schema.ts` e aplica as alterações no banco configurado em `DATABASE_URL`.

---

## Ordem de execução

```
001 → 002 → 003 → 004
```

`002`, `003` e `004` referenciam `001` (FK para `users.id` e `companies.id`).

---

## Compatibilidade

- PostgreSQL 14+
- Supabase (Postgres gerenciado)
- Neon, Railway, Render (qualquer Postgres compatível)
- Extensão `pgcrypto` necessária para `gen_random_uuid()` (incluída na migration 001)
