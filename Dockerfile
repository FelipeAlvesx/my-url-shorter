FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Criar diretório para o banco de dados
RUN mkdir -p /app/data

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production \
    PORT=3000 \
    DATABASE_URL="file:/app/data/dev.db"

# Executar migrações e iniciar aplicação com ts-node no modo ESM
CMD npx prisma migrate deploy && node --loader ts-node/esm ./src/index.ts
