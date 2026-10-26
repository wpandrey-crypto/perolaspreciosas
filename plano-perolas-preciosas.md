# Plano de Modernização - Sistema Pérolas Preciosas

**Data:** 26/10/2026  
**Status:** Planejamento Aprovado / Em Execução  
**Arquitetura:** Next.js (TypeScript) + Tailwind CSS + Prisma ORM + SQLite/PostgreSQL  
**Orquestrado por:** Agentes em `F:\Sistemas\.antigravity\.agents`

---

## 1. Visão Geral e Princípios Não-Negociáveis

1. **Fidelidade Cognitiva no Backend (Dona Leda):**
   - O painel administrativo deve mimetizar o fluxo, nomenclatura e disposição visual que a proprietária usa há mais de 15 anos.
   - Navegação por barra de botões com as exatas seções: *Mensagem da Capa*, *Cada Dia / Ocasiões Capa*, *Chamadas na Capa*, *Artigos*, *HOJE*, *De A a Z*, *Cada Dia - Todo Dia*, *Toda a Bíblia em UM Ano*, *Ocasiões*, *EBD*, *Usuários*, *Textos do Site*, *SAIR*.
   - Grade matricial dos 12 meses (Janeiro a Dezembro) com botões clicáveis para cada dia de 1 a 31.
   - Editor de texto amigável (sem exigir conhecimentos de HTML ou quebrar tags).
   - Confirmações simples: "Gravar" e "Voltar Para Página Inicial".

2. **Modernização do Frontend (Experiência do Leitor):**
   - **Cabeçalho Clássico Preservado:** Banner institucional "Pérolas - momentos preciosos com Deus", versículo de honra e adoração, menu horizontal categorizado e o calendário "Cada Dia, o Ano Todo!" com dias clicáveis e o dia de hoje destacado.
   - **Corpo 100% Responsivo:** Substituição de tabelas fixas e Flash quebrado por cards limpos, tipografia editorial de alta legibilidade (com seletor de tamanho de fonte), busca rápida e botão de compartilhamento para WhatsApp.
   - **SEO e Acessibilidade:** Geração estática/híbrida (SSG/ISR) para indexação massiva de estudos bíblicos no Google.

---

## 2. Modelagem de Dados (Database Architect)

```prisma
datasource db {
  provider = "sqlite" // Fácil transição para postgresql em produção
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  passwordHash String
  name         String
  role         String   @default("admin")
  createdAt    DateTime @default(now())
}

model CoverMessage {
  id        Int      @id @default(autoincrement())
  title     String
  subtitle  String?
  content   String
  verse     String?
  isActive  Boolean  @default(true)
  updatedAt DateTime @updatedAt
}

model DailyDevotional {
  id          Int      @id @default(autoincrement())
  day         Int      // 1 a 31
  month       Int      // 1 a 12
  title       String
  verse       String
  content     String
  author      String?  @default("Pérolas Preciosas")
  updatedAt   DateTime @updatedAt

  @@unique([month, day])
}

model BibleInOneYear {
  id          Int      @id @default(autoincrement())
  day         Int      // 1 a 31
  month       Int      // 1 a 12
  title       String
  readingPlan String   // Ex: Gênesis 1-3; Mateus 1
  reflection  String?
  updatedAt   DateTime @updatedAt

  @@unique([month, day])
}

model Category {
  id          Int       @id @default(autoincrement())
  slug        String    @unique
  name        String
  parentSlug  String?
  orderIndex  Int       @default(0)
  articles    Article[]
}

model Article {
  id          Int       @id @default(autoincrement())
  title       String
  slug        String    @unique
  categoryId  Int
  category    Category  @relation(fields: [categoryId], references: [id])
  summary     String?
  content     String
  author      String?
  views       Int       @default(0)
  isFeatured  Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model SiteSection {
  id          Int      @id @default(autoincrement())
  sectionKey  String   @unique // ex: 'diversos-folhetos', 'quem-escreve', 'contato'
  groupName   String   // ex: 'DIVERSOS'
  title       String
  content     String
  updatedAt   DateTime @updatedAt
}

model Occasion {
  id          Int      @id @default(autoincrement())
  month       Int?     // Referência ao mês (ex: 9 - Setembro)
  title       String
  description String?
  content     String?
  active      Boolean  @default(true)
  updatedAt   DateTime @updatedAt
}
```

---

## 3. Mapeamento das Rotas e Telas

### Front-end Público (`/`)
- `/` - Página Inicial (com Banner clássico, Calendário diário, Destaques, Discipulado e Busca).
- `/cada-dia/:mes/:dia` - Leitura da mensagem devocional daquele dia específico.
- `/biblia-ano/:mes/:dia` - Plano e leitura bíblica anual daquele dia.
- `/artigos/:categoria` - Listagem de artigos por tema (Homilética, Hermenêutica, etc.).
- `/artigos/:categoria/:slug` - Leitor do artigo completo.
- `/de-a-z` - Índice alfabético completo de todos os estudos.
- `/secao/:sectionKey` - Páginas institucionais (Quem Escreve, ICEB, Folhetos, etc.).
- `/contato` - Formulário seguro de contato.

### Painel Administrativo (`/adm`)
- `/adm/login` - Tela de login clássica, simples e segura.
- `/adm/dashboard` - Menu superior de navegação azul idêntico ao legado:
  - `/adm/capa` -> "Mensagem da Capa"
  - `/adm/cada-dia` -> "Cada Dia / Ocasiões Capa" & "Cada Dia - Todo Dia" (Grid de 12 meses clicável)
  - `/adm/biblia-ano` -> "Toda a Bíblia em UM Ano" (Grid de 12 meses clicável)
  - `/adm/artigos` -> "Artigos" (Novo, Editar, Listar)
  - `/adm/textos` -> "Textos do Site" (Dropdown de seções + Editor de texto + "Gravar")
  - `/adm/usuarios` -> "Usuários"
  - `/adm/logout` -> "SAIR"

---

## 4. Cronograma de Execução

1. **Etapa 1:** Inicialização do projeto Next.js com Tailwind CSS e Prisma.
2. **Etapa 2:** Configuração do Banco de Dados e Seeds com as categorias do legado.
3. **Etapa 3:** Desenvolvimento do Painel Administrativo (Interface da Dona Leda).
4. **Etapa 4:** Desenvolvimento do Front-End (Capa clássica + Leitura moderna responsiva).
5. **Etapa 5:** Ferramenta de Importação de Dados do legado (ASP/MDB/SQL).
6. **Etapa 6:** Homologação com a cliente e testes de usabilidade.
