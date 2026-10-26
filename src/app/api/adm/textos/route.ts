import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const section = await prisma.siteSection.findUnique({
        where: { sectionKey: key },
      });
      return NextResponse.json(section || { sectionKey: key, title: "", content: "", groupName: "DIVERSOS" });
    }

    const sections = await prisma.siteSection.findMany({
      orderBy: { sectionKey: "asc" },
    });
    return NextResponse.json(sections);
  } catch (error) {
    console.error("Erro ao buscar textos do site:", error);
    return NextResponse.json({ error: "Erro ao buscar textos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { sectionKey, title, content, groupName } = data;

    if (!sectionKey) {
      return NextResponse.json({ error: "Chave da seção é obrigatória" }, { status: 400 });
    }

    const saved = await prisma.siteSection.upsert({
      where: { sectionKey },
      update: {
        title: title || "",
        content: content || "",
        groupName: groupName || "DIVERSOS",
      },
      create: {
        sectionKey,
        title: title || "",
        content: content || "",
        groupName: groupName || "DIVERSOS",
      },
    });

    return NextResponse.json({ success: true, item: saved });
  } catch (error) {
    console.error("Erro ao salvar texto da seção:", error);
    return NextResponse.json({ error: "Erro ao salvar texto" }, { status: 500 });
  }
}
