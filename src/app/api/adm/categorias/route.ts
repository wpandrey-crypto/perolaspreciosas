import { NextResponse } from "next/navigation";
import prisma from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET: Lista todas as categorias e subcategorias com contagem de artigos
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: [{ parentSlug: "asc" }, { orderIndex: "asc" }, { name: "asc" }],
    });

    // Separa as principais e as filhas
    const rootCategories = categories.filter((c) => !c.parentSlug);
    const subcategories = categories.filter((c) => c.parentSlug);

    const structured = rootCategories.map((root) => ({
      ...root,
      subcategories: subcategories.filter((s) => s.parentSlug === root.slug),
    }));

    return NextResponse.json({
      all: categories,
      roots: rootCategories,
      structured,
    });
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST: Cria ou edita categoria ou subcategoria
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, parentSlug, orderIndex } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "O nome é obrigatório" }, { status: 400 });
    }

    const cleanName = name.trim();
    let slug = body.slug ? slugify(body.slug) : slugify(cleanName);

    if (id) {
      // Edição
      const updated = await prisma.category.update({
        where: { id: Number(id) },
        data: {
          name: cleanName,
          slug: slug,
          parentSlug: parentSlug ? parentSlug.trim() : null,
          orderIndex: orderIndex ? Number(orderIndex) : 0,
        },
      });
      return NextResponse.json(updated);
    } else {
      // Criação - verifica unicidade de slug
      let uniqueSlug = slug;
      let counter = 1;
      while (await prisma.category.findUnique({ where: { slug: uniqueSlug } })) {
        counter++;
        uniqueSlug = `${slug}-${counter}`;
      }

      const created = await prisma.category.create({
        data: {
          name: cleanName,
          slug: uniqueSlug,
          parentSlug: parentSlug ? parentSlug.trim() : null,
          orderIndex: orderIndex ? Number(orderIndex) : 0,
        },
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("Erro ao salvar categoria:", error);
    return NextResponse.json({ error: "Erro ao salvar categoria" }, { status: 500 });
  }
}

// DELETE: Exclui categoria
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const cat = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!cat) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }

    // Se tiver artigos vinculados, impede exclusão direta sem aviso
    if (cat._count.articles > 0) {
      return NextResponse.json(
        {
          error: `Esta categoria possui ${cat._count.articles} artigo(s) vinculado(s). Mova os artigos antes de excluí-la.`,
        },
        { status: 400 }
      );
    }

    // Se for categoria pai e tiver subcategorias vinculadas
    if (!cat.parentSlug) {
      const childCount = await prisma.category.count({
        where: { parentSlug: cat.slug },
      });
      if (childCount > 0) {
        return NextResponse.json(
          {
            error: `Esta categoria possui ${childCount} subcategoria(s) vinculada(s). Exclua ou desvincule as subcategorias primeiro.`,
          },
          { status: 400 }
        );
      }
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return NextResponse.json({ error: "Erro interno ao excluir" }, { status: 500 });
  }
}
