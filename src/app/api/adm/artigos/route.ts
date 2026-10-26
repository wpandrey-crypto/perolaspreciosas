import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const id = searchParams.get("id");

    if (id) {
      const article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
        include: { category: true },
      });
      return NextResponse.json(article);
    }

    const where: { category?: { slug: string } } = {};
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const articles = await prisma.article.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles);
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

    const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    let saved;
    if (id) {
      saved = await prisma.article.update({
        where: { id: parseInt(id) },
        data: {
          title,
          categoryId: parseInt(categoryId),
          summary: summary || "",
          content,
          author: author || "Leda Latterza",
          isFeatured: Boolean(isFeatured),
        },
      });
    } else {
      saved = await prisma.article.create({
        data: {
          title,
          slug,
          categoryId: parseInt(categoryId),
          summary: summary || "",
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
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir artigo:", error);
    return NextResponse.json({ error: "Erro ao excluir artigo" }, { status: 500 });
  }
}
