#!/bin/bash
set -e

echo "=========================================="
echo "  Deploy Pérolas Preciosas no Droplet"
echo "=========================================="

# 1. Configurar variáveis de ambiente se não existirem
if [ ! -f .env ]; then
  cp .env.example .env
  echo "[OK] Arquivo .env criado a partir de .env.example"
fi

# 2. Instalar dependências
echo "Instalando dependências..."
npm install

# 3. Gerar cliente do Prisma e sincronizar banco
echo "Sincronizando banco SQLite..."
npx prisma db push
npx tsx prisma/seed.ts

# 4. Build de produção do Next.js
echo "Gerando build de produção..."
npm run build

# 5. Iniciar com PM2 na porta 80 ou 3000
if command -v pm2 &> /dev/null; then
  echo "Reiniciando aplicação no PM2..."
  pm2 delete perolas || true
  PORT=80 pm2 start npm --name "perolas" -- start
  pm2 save
  echo "Aplicação rodando no PM2 na porta 80!"
else
  echo "Iniciando aplicação..."
  PORT=80 npm start
fi

echo "=========================================="
echo "  Deploy concluído com sucesso!"
echo "  Acesse: http://143.198.165.231"
echo "=========================================="
