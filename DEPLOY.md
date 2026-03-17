# 🚀 Deploy do CRM (Next.js + Prisma) na VPS — Padrão M5 Labs

## 📌 Visão Geral

Este documento descreve o processo completo de deploy do CRM hospedado em:

```
crm.m5-labs.com
```

### Stack utilizada

* VPS própria
* Docker + Docker Swarm
* Portainer (gerenciamento)
* Traefik (proxy reverso + SSL)
* Next.js (App Router)
* Prisma (ORM)
* Banco de dados externo

---

## 🧱 Arquitetura

```
crm.m5-labs.com
   ↓
Traefik
   ↓
Docker Swarm (Portainer)
   ↓
Container Next.js (porta 3000)
   ↓
Banco externo (PostgreSQL)
```

---

## 📂 Estrutura do Projeto

Repositório:

```
github.com/diogo-m5labs/CRM
```

Aplicação:

```
/opt/apps/crm/personal-crm
```

---

## ⚙️ Passo a Passo — Deploy Inicial

### 1. Clonar o repositório

```bash
cd /opt/apps
git clone git@github.com:diogo-m5labs/CRM.git crm
cd /opt/apps/crm/personal-crm
```

---

### 2. Criar variáveis de ambiente

```bash
cp .env.example .env
nano .env
```

Exemplo:

```env
NODE_ENV=production
PORT=3000

DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/BANCO?schema=public

NEXTAUTH_SECRET=CHAVE_FORTE
NEXTAUTH_URL=https://crm.m5-labs.com
```

---

### 3. Dockerfile (produção)

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .

RUN npx prisma generate || true
RUN npm run build

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]
```

---

### ⚠️ Observação importante (Prisma)

O uso de:

```bash
npm install --ignore-scripts
```

evita erro durante build causado por execução automática do Prisma antes do código completo estar disponível.

---

### 4. Build da imagem

```bash
docker build --no-cache -t crm-m5labs:latest .
```

---

### 5. Stack (Portainer)

Criar stack com o seguinte YAML:

```yaml
version: "3.7"

services:
  crm:
    image: crm-m5labs:latest
    networks:
      - m5-labs
    environment:
      NODE_ENV: "production"
      PORT: "3000"
      DATABASE_URL: "SUA_DATABASE_URL"
      NEXTAUTH_SECRET: "SUA_CHAVE_FORTE"
      NEXTAUTH_URL: "https://crm.m5-labs.com"
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - traefik.enable=true
        - traefik.http.routers.crm.rule=Host(`crm.m5-labs.com`)
        - traefik.http.routers.crm.entrypoints=websecure
        - traefik.http.routers.crm.tls.certresolver=letsencryptresolver
        - traefik.http.services.crm.loadbalancer.server.port=3000
        - traefik.http.services.crm.loadbalancer.passHostHeader=true

networks:
  m5-labs:
    external: true
    name: m5-labs
```

---

### 6. Deploy

No Portainer:

* Stacks → Add stack
* Nome: `crm`
* Colar YAML
* Deploy

---

### 7. Verificação

```bash
docker service ls
docker service ps crm_crm
docker service logs -f crm_crm
```

Acessar:

```
https://crm.m5-labs.com
```

---

## 🔄 Atualizações (Fluxo Padrão)

Sempre que houver alteração no Antigravity/GitHub:

### 1. Atualizar código

```bash
cd /opt/apps/crm
git pull
```

---

### 2. Rebuild da imagem

```bash
cd personal-crm
docker build --no-cache -t crm-m5labs:latest .
```

---

### 3. Redeploy no Portainer

* Abrir stack `crm`
* Clicar em **Update stack**
* Clicar em **Deploy**

---

### 4. Verificar logs

```bash
docker service logs -f crm_crm
```

---

## ⚠️ Regras Importantes

### ✔ Sempre rebuildar quando:

* alterar código (frontend/backend)
* mudar Prisma
* alterar lógica da aplicação

---

### ❌ Não precisa rebuildar quando:

* mudar apenas variáveis de ambiente no YAML
* alterar labels do Traefik
* mudar número de réplicas

---

## 🧪 Prisma (produção)

Se necessário:

```bash
npx prisma migrate deploy
```

ou:

```bash
npx prisma db push
```

---

## 🛑 Erros Comuns

### Prisma não encontrado

Causa:

* execução durante `npm install`

Solução:

* usar `--ignore-scripts`

---

### Mudança não aparece

Causa:

* esqueceu `docker build`

---

### App sobe mas quebra

Causa comum:

* `DATABASE_URL` incorreta
* `NEXTAUTH_SECRET` ausente

---

## 🧠 Padrão M5 Labs

Fluxo oficial:

```
Antigravity → GitHub → VPS → Docker build → Portainer → Produção
```

---

## 🚀 Próximos passos (evolução)

* CI/CD com GitHub Actions
* build automático de imagem
* deploy automático na VPS
* multi-tenant
* autenticação centralizada
* observabilidade (logs + métricas)

---

## ✅ Status

Deploy funcional em produção:

```
crm.m5-labs.com
```

---
