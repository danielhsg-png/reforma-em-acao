# Deploy — Reforma em Ação

Fluxo de publicação: **Replit (edição) → commit/push no GitHub → Railway detecta o commit e faz o deploy automático.**

Este documento registra um problema de build recorrente (origem no Replit), a
correção aplicada no Railway e o que **não** deve ser alterado para evitar
quebras futuras.

---

## O problema (causa raiz)

O ambiente do Replit usa um *package firewall* interno. Quando o Replit roda
`npm install`, ele reescreve o `package-lock.json` apontando os tarballs para:

```
http://package-firewall.replit.local/npm/...
```

Esse host **só resolve dentro do Replit**. Ao chegar no Railway, o `npm ci`
tenta baixar desses endereços, recebe `ENOTFOUND` e quebra com:

```
npm error Exit handler never called!
```

Como o `npm ci` não completa, o `node_modules` fica incompleto e o passo de
build falha em seguida:

```
> tsx script/build.ts
sh: 1: tsx: not found
process "npm run build" did not complete successfully: exit code: 127
Build Failed
```

> Observação: `tsx`, `vite` e `esbuild` **já estão em `dependencies`** — o
> `tsx: not found` é consequência do `npm ci` ter abortado, **não** de
> `omit=dev`.

---

## A correção (no Railway, independente do Replit)

Foi adicionada uma variável de ambiente no serviço do Railway que **sobrescreve
o comando de install** do railpack, sanitizando o lockfile **antes** do
`npm ci`, em todo build:

- **Nome:** `RAILPACK_INSTALL_CMD`
- **Valor:**

```sh
sed -i 's#http://package-firewall.replit.local/npm/#https://registry.npmjs.org/#g' package-lock.json && npm ci
```

Características:

- **Independente do Replit:** vive nas configs do Railway, fora do repositório.
  Não importa o que o Replit comite — o Railway limpa antes de instalar.
- **Idempotente:** se o lockfile já estiver limpo, o `sed` não encontra nada e
  o build segue normalmente.
- **Cirúrgica:** altera só o comando de install; o resto do plano do railpack
  (build, deploy) permanece intacto.

Onde editar: Railway → projeto → serviço → aba **Variables**.

---

## Watch-list — o que NÃO mexer para não quebrar o deploy

1. **Manter os pacotes de build em `dependencies`** (não em `devDependencies`):
   `tsx`, `vite`, `esbuild`, `@vitejs/plugin-react`. O Railway instala em modo
   produção; se eles forem para `devDependencies`, o build volta a falhar com
   `tsx: not found`. **Este é o ponto mais sensível.**
2. **Não editar o `package-lock.json` na mão no Replit.** Deixe o Replit rodar
   o install dele para manter `package.json` e o lockfile em sincronia (o
   `npm ci` exige os dois batendo).
3. Se o Replit algum dia mudar o **host/caminho** do package firewall, atualize
   o padrão do `sed` em `RAILPACK_INSTALL_CMD` para o novo endereço.

---

## Scripts relevantes (`package.json`)

| Script | Comando | Uso |
|---|---|---|
| `dev` | `tsx --env-file-if-exists=.env server/index.ts` | desenvolvimento local (carrega `.env` se existir; em produção usa os secrets) |
| `build` | `tsx script/build.ts` | build do frontend (Vite) + backend (esbuild) → `dist/` |
| `start` | `node --enable-source-maps dist/index.cjs` | start em produção |

## Variáveis de ambiente (produção)

Configuradas no Railway (não versionadas):
`DATABASE_URL`, `APP_URL`, `SESSION_SECRET`, `SMTP2GO_API_KEY`, `EMAIL_SENDER`,
`ADMIN_KEY`, `PAGARME_SECRET_KEY`, `PAGARME_PLAN_ID_MONTHLY`,
`PAGARME_PLAN_ID_ANNUAL`, `PAGARME_WEBHOOK_USER`, `PAGARME_WEBHOOK_PASSWORD`,
e a variável de build `RAILPACK_INSTALL_CMD` descrita acima.
