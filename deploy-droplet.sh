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

# 5. Iniciar com PM2 na porta isolada 3005
if command -v pm2 &> /dev/null; then
  echo "Iniciando aplicação no PM2 na porta 3005..."
  pm2 delete perolas || true
  PORT=3005 pm2 start npm --name "perolas" -- start
  pm2 save
  echo "Aplicação rodando isolada no PM2 na porta 3005!"
else
  echo "Iniciando aplicação na porta 3005..."
  PORT=3005 npm start
fi

echo "=========================================="
echo "  Deploy concluído com segurança!"
echo "  Acesse: http://143.198.165.231:3005"
echo "=========================================="
