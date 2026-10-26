import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || "0");
    const day = parseInt(searchParams.get("day") || "0");

    if (month > 0 && day > 0) {
      const item = await prisma.dailyDevotional.findUnique({
        where: {
          month_day: { month, day },
        },
      });
      return NextResponse.json(item || { month, day, title: "", verse: "", content: "" });
    }

    // Retorna todos os devocionais cadastrados para o mapa
    const all = await prisma.dailyDevotional.findMany({
      select: { month: true, day: true, title: true },
    });
    return NextResponse.json(all);
  } catch (error) {
    console.error("Erro ao buscar devocional:", error);
    return NextResponse.json({ error: "Erro ao buscar devocional" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { month, day, title, verse, content, author } = data;

    if (!month || !day) {
      return NextResponse.json({ error: "Mês e dia são obrigatórios" }, { status: 400 });
    }

    const saved = await prisma.dailyDevotional.upsert({
      where: {
        month_day: {
          month: parseInt(month),
          day: parseInt(day),
        },
      },
      update: {
        title: title || "",
        verse: verse || "",
        content: content || "",
        author: author || "Leda Latterza",
      },
      create: {
        month: parseInt(month),
        day: parseInt(day),
        title: title || "",
        verse: verse || "",
        content: content || "",
        author: author || "Leda Latterza",
      },
    });

    return NextResponse.json({ success: true, item: saved });
  } catch (error) {
    console.error("Erro ao salvar devocional:", error);
    return NextResponse.json({ error: "Erro ao salvar devocional" }, { status: 500 });
  }
}
