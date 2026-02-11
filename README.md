# 🔗 Encurtador de URL

API REST para encurtar URLs, com rastreamento de cliques e redirecionamento automático.

## 📋 Funcionalidades

- ✅ Encurtar URLs longas gerando códigos únicos
- ✅ Redirecionamento automático para URL original
- ✅ Rastreamento de cliques em tempo real
- ✅ Listagem de links criados
- ✅ Persistência de dados com SQLite

## 🚀 Tecnologias

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express](https://expressjs.com/)** - Framework web minimalista
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado de JavaScript
- **[Prisma](https://www.prisma.io/)** - ORM moderno para Node.js
- **[SQLite](https://www.sqlite.org/)** - Banco de dados relacional leve
- **[Better SQLite3](https://github.com/WiseLibs/better-sqlite3)** - Driver SQLite de alta performance

## 📦 Pré-requisitos

- Node.js 18+ ou Bun
- npm ou bun

## 🔧 Instalação

1. **Clone o repositório:**

```bash
git clone <url-do-repositorio>
cd api
```

2. **Instale as dependências:**

```bash
npm install
# ou
bun install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
DATABASE_URL="file:./dev.db"
```

4. **Execute as migrações do banco de dados:**

```bash
npx prisma migrate dev
```

5. **Gere o Prisma Client:**

```bash
npx prisma generate
```

## ▶️ Executando o projeto

### Modo desenvolvimento

```bash
npm run dev
# ou
bun run dev
```

O servidor estará rodando em `http://localhost:3000`

## 📡 Endpoints da API

### 1. Health Check

```http
GET /ping
```

**Resposta:**

```json
{
    "message": "pong"
}
```

### 2. Criar link encurtado

```http
POST /links
Content-Type: application/json

{
  "original": "https://exemplo.com/url-muito-longa"
}
```

**Resposta:**

```json
{
    "message": "Link criado com sucesso!",
    "url": "http://localhost:3000/abc123"
}
```

### 3. Redirecionar para URL original

```http
GET /:code
```

Exemplo: `GET /abc123`

Redireciona (HTTP 302) para a URL original e incrementa o contador de cliques.

## 🗄️ Estrutura do Banco de Dados

### Model: Link

| Campo     | Tipo     | Descrição                         |
| --------- | -------- | --------------------------------- |
| id        | String   | ID único (CUID)                   |
| original  | String   | URL original                      |
| shortCode | String   | Código curto único (6 caracteres) |
| clicks    | Int      | Contador de cliques               |
| createdAt | DateTime | Data de criação                   |

## 📁 Estrutura do Projeto

```
api/
├── prisma/
│   ├── schema.prisma       # Schema do banco de dados
│   └── migrations/         # Migrações do Prisma
├── src/
│   ├── db/
│   │   └── db-config.ts    # Configuração do adapter SQLite
│   ├── links/
│   │   └── route.ts        # Rotas de links
│   └── index.ts            # Servidor principal
├── package.json
├── tsconfig.json
├── prisma.config.ts
└── .env                    # Variáveis de ambiente (criar)
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento com hot reload
- `npx prisma studio` - Abre interface visual do banco de dados
- `npx prisma migrate dev` - Cria e aplica novas migrações
- `npx prisma generate` - Gera o Prisma Client

## 📝 Exemplo de uso

```bash
# Criar um link encurtado
curl -X POST http://localhost:3000/links \
  -H "Content-Type: application/json" \
  -d '{"original": "https://github.com/prisma/prisma"}'

# Acessar o link encurtado (via navegador ou curl)
curl -L http://localhost:3000/abc123
```

## 🔒 Graceful Shutdown

O servidor está configurado para desconectar o Prisma Client de forma segura ao receber o sinal SIGINT (Ctrl+C).
