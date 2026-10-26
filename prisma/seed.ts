import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed do banco Pérolas Preciosas...");

  // 1. Usuário Administrador
  await prisma.user.upsert({
    where: { username: "leda" },
    update: {},
    create: {
      username: "leda",
      password: "123", // Senha inicial de desenvolvimento / compatível com o legado
      name: "Leda Latterza",
      role: "admin",
    },
  });

  // 2. Categorias do site clássico
  const categories = [
    { name: "Iniciantes", slug: "iniciantes", orderIndex: 1 },
    { name: "Avançado", slug: "avancado", orderIndex: 2 },
    { name: "Homilética", slug: "homiletica", parentSlug: "avancado", orderIndex: 3 },
    { name: "Hermenêutica", slug: "hermeneutica", parentSlug: "avancado", orderIndex: 4 },
    { name: "Religiões", slug: "religioes", parentSlug: "avancado", orderIndex: 5 },
    { name: "Seitas", slug: "seitas", parentSlug: "avancado", orderIndex: 6 },
    { name: "Doutrinas", slug: "doutrinas", parentSlug: "avancado", orderIndex: 7 },
    { name: "História da Igreja", slug: "historia-da-igreja", parentSlug: "avancado", orderIndex: 8 },
    { name: "Vida Cristã", slug: "vida-crista", orderIndex: 9 },
    { name: "Bíblia", slug: "biblia", orderIndex: 10 },
    { name: "Eles / Elas", slug: "eles-elas", orderIndex: 11 },
    { name: "EBD / EBF", slug: "ebd-ebf", orderIndex: 12 },
    { name: "Missões", slug: "missoes", orderIndex: 13 },
    { name: "Diversos", slug: "diversos", orderIndex: 14 },
    { name: "Quem Escreve", slug: "quem-escreve", orderIndex: 15 },
    { name: "ICEB", slug: "iceb", orderIndex: 16 },
    { name: "Contato", slug: "contato", orderIndex: 17 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // 3. Mensagem da Capa
  const existingCover = await prisma.coverMessage.findFirst();
  if (!existingCover) {
    await prisma.coverMessage.create({
      data: {
        title: "BEM VINDO!",
        subtitle: "Este site é diferente: Você precisa interAgir com ele: PENSANDO...",
        content:
          "Referências são de suma importância: ler, copiar e, em especial, vivê-las! Há devocionais diárias para cada dia do ano todo.",
        verse:
          "A Deus toda a Honra e a Glória, a Soberania e o Poder, o Louvor e as Ações de Graças",
        isActive: true,
      },
    });
  }

  // 4. Devocional de Hoje (ex: Outubro 26)
  await prisma.dailyDevotional.upsert({
    where: {
      month_day: {
        month: 10,
        day: 26,
      },
    },
    update: {},
    create: {
      month: 10,
      day: 26,
      title: "Momentos Preciosos com Deus",
      verse: "Salmos 119:105 - Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.",
      content:
        "Cada dia traz novas oportunidades para caminhar em comunhão íntima com o Senhor. A Palavra de Deus não é apenas para ser lida, mas para ser meditada e guardada no mais profundo do coração.",
      author: "Leda Latterza",
    },
  });

  // 5. Toda a Bíblia em um Ano (Dia 26/10)
  await prisma.bibleInOneYear.upsert({
    where: {
      month_day: {
        month: 10,
        day: 26,
      },
    },
    update: {},
    create: {
      month: 10,
      day: 26,
      title: "Leitura Bíblica Anual - 26 de Outubro",
      readingPlan: "Jeremias 14-16; 1 Tessalonicenses 2",
      reflection:
        "Ao ler os profetas e as cartas apostólicas, percebemos a fidelidade de Deus em meio às tribulações.",
    },
  });

  // 6. Seções do Site
  const sections = [
    {
      sectionKey: "diversos-folhetos",
      groupName: "DIVERSOS",
      title: "Folhetos e Mensagens Especiais",
      content:
        "Aqui você encontra mensagens impressas e folhetos preparados com carinho para evangelização e edificação de vidas.",
    },
    {
      sectionKey: "quem-escreve",
      groupName: "INSTITUCIONAL",
      title: "Quem Escreve",
      content:
        "O ministério Pérolas Preciosas é dedicado a semear a Palavra viva e eficaz do Senhor.",
    },
  ];

  for (const sec of sections) {
    await prisma.siteSection.upsert({
      where: { sectionKey: sec.sectionKey },
      update: sec,
      create: sec,
    });
  }

  // 7. Artigos de Exemplo
  const catHomiletica = await prisma.category.findUnique({ where: { slug: "homiletica" } });
  const catVidaCrista = await prisma.category.findUnique({ where: { slug: "vida-crista" } });
  const catIniciantes = await prisma.category.findUnique({ where: { slug: "iniciantes" } });

  if (catHomiletica) {
    await prisma.article.upsert({
      where: { slug: "a-arte-da-pregacao-biblica" },
      update: {},
      create: {
        title: "A Arte da Pregação Bíblica e a Fidelidade ao Texto",
        slug: "a-arte-da-pregacao-biblica",
        categoryId: catHomiletica.id,
        summary: "Fundamentos indispensáveis para quem deseja expor a Palavra de Deus com clareza, unção e reverência.",
        content: `A homilética não é mero exercício de oratória ou retórica humana. É a humilde tarefa de ser canal para a voz viva de Deus.\n\nO pregador deve, antes de tudo, permitir que o texto fale à sua própria alma. A exegese cuidadosa precede a aplicação prática.\n\nQuando nos colocamos diante da congregação, a nossa meta não é impressionar intelectos, mas transformar corações pela verdade imutável do Evangelho de Cristo.`,
        author: "Leda Latterza",
        isFeatured: true,
      },
    });
  }

  if (catVidaCrista) {
    await prisma.article.upsert({
      where: { slug: "o-poder-da-oracao-diaria" },
      update: {},
      create: {
        title: "O Poder da Oração Diária na Vida do Cristão",
        slug: "o-poder-da-oracao-diaria",
        categoryId: catVidaCrista.id,
        summary: "Como cultivar uma rotina de comunhão diária que sustenta a fé em tempos de tribulação.",
        content: `Orar não é informar a Deus sobre as nossas necessidades, pois Ele já as conhece antes mesmo que peçamos. Orar é alinhar o nosso coração à vontade soberana do Pai.\n\nEm um mundo acelerado e cheio de distrações, reservar os primeiros momentos da manhã para buscar a presença do Senhor é o maior investimento que podemos fazer para a nossa saúde espiritual e mental.\n\nQue a sua vida seja um altar contínuo de louvor e súplica.`,
        author: "Leda Latterza",
        isFeatured: true,
      },
    });
  }

  if (catIniciantes) {
    await prisma.article.upsert({
      where: { slug: "como-comecar-a-ler-a-biblia" },
      update: {},
      create: {
        title: "Como Começar a Ler a Bíblia: Um Guia Prático",
        slug: "como-comecar-a-ler-a-biblia",
        categoryId: catIniciantes.id,
        summary: "Passos simples para quem está dando os primeiros passos nas Sagradas Escrituras.",
        content: `Muitas pessoas sentem dificuldade ao abrir a Bíblia pela primeira vez. Por onde começar? Que versão escolher?\n\nRecomendamos iniciar pelos Evangelhos, especialmente o Evangelho de João, onde a graça e o amor de Jesus Cristo são revelados com profunda doçura.\n\nLeia com oração, peça discernimento ao Espírito Santo e anote o que Deus falar ao seu coração a cada dia.`,
        author: "Leda Latterza",
        isFeatured: true,
      },
    });
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
