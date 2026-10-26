import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let cover = await prisma.coverMessage.findFirst({
      where: { isActive: true },
    });

    if (!cover) {
      cover = await prisma.coverMessage.create({
        data: {
          title: "BEM VINDO !",
          subtitle: "Este site é diferente: *Você precisa interAgir com ele: PENSANDO ...",
          content: "Referências são de suma importância: ler, copiar e, em especial, vivê-las! Há devocionais diárias",
          verse: "A Deus toda a Honra e a Glória, a Soberania e o Poder, o Louvor e as Ações de Graças",
          isActive: true,
        },
      });
    }

    return NextResponse.json(cover);
  } catch (error) {
    console.error("Erro ao buscar mensagem da capa:", error);
    return NextResponse.json({ error: "Erro ao buscar mensagem da capa" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, subtitle, content, verse } = data;

    const current = await prisma.coverMessage.findFirst();

    let saved;
    if (current) {
      saved = await prisma.coverMessage.update({
        where: { id: current.id },
        data: {
          title: title || "",
          subtitle: subtitle || "",
          content: content || "",
          verse: verse || "",
        },
      });
    } else {
      saved = await prisma.coverMessage.create({
        data: {
          title: title || "",
          subtitle: subtitle || "",
          content: content || "",
          verse: verse || "",
          isActive: true,
        },
      });
    }

    return NextResponse.json({ success: true, item: saved });
  } catch (error) {
    console.error("Erro ao salvar mensagem da capa:", error);
    return NextResponse.json({ error: "Erro ao salvar mensagem da capa" }, { status: 500 });
  }
}
