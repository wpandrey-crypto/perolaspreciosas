import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "25", 10) || 25));
    const search = searchParams.get("search")?.trim() || "";
    const cat = searchParams.get("cat")?.trim() || "";

    // 1. Se pediu um artigo específico por ID, retorna com o conteúdo completo
    if (id) {
      const article = await prisma.article.findUnique({
        where: { id: parseInt(id, 10) },
        include: { category: true },
      });
      if (!article) {
        return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
      }
      return NextResponse.json(article);
    }

    // 2. Filtros de busca
    const where: any = {};
    if (cat) {
      const catNum = parseInt(cat, 10);
      if (!isNaN(catNum)) {
        where.categoryId = catNum;
      } else {
        where.OR = [
          { category: { slug: cat } },
          { category: { parentSlug: cat } },
        ];
      }
    }

    if (search) {
      where.AND = [
        {
          OR: [
            { title: { contains: search } },
            { summary: { contains: search } },
          ],
        },
      ];
    }

    // 3. Busca paginada leve (sem o campo content gigante na listagem)
    const [totalCount, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          categoryId: true,
          summary: true,
          author: true,
          isFeatured: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              parentSlug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return NextResponse.json({
      items: articles,
      total: totalCount,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Erro ao buscar artigos:", error);
    return NextResponse.json({ error: "Erro ao buscar artigos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, title, categoryId, summary, content, author, isFeatured } = data;

    if (!title || !categoryId || !content) {
      return NextResponse.json(
        { error: "Título, categoria e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    // Gerador de slug simples
    const slugBase = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let saved;
    if (id) {
      saved = await prisma.article.update({
        where: { id: parseInt(id, 10) },
        data: {
          title: title.trim(),
          categoryId: parseInt(categoryId, 10),
          summary: summary ? summary.trim() : "",
          content,
          author: author || "Leda Latterza",
          isFeatured: Boolean(isFeatured),
        },
      });
    } else {
      // Slug único na criação
      let uniqueSlug = slugBase;
      let counter = 1;
      while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
        counter++;
        uniqueSlug = `${slugBase}-${counter}`;
      }

      saved = await prisma.article.create({
        data: {
          title: title.trim(),
          slug: uniqueSlug,
          categoryId: parseInt(categoryId, 10),
          summary: summary ? summary.trim() : "",
          content,
          author: author || "Leda Latterza",
          isFeatured: Boolean(isFeatured),
        },
      });
    }

    return NextResponse.json({ success: true, item: saved });
  } catch (error) {
    console.error("Erro ao salvar artigo:", error);
    return NextResponse.json({ error: "Erro ao salvar artigo" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await prisma.article.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir artigo:", error);
    return NextResponse.json({ error: "Erro ao excluir artigo" }, { status: 500 });
  }
}
