import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || "0");
    const day = parseInt(searchParams.get("day") || "0");

    if (month > 0 && day > 0) {
      const item = await prisma.bibleInOneYear.findUnique({
        where: {
          month_day: { month, day },
        },
      });
      return NextResponse.json(
        item || { month, day, title: "", readingPlan: "", reflection: "" }
      );
    }

    const all = await prisma.bibleInOneYear.findMany({
      select: { month: true, day: true, title: true, readingPlan: true },
    });
    return NextResponse.json(all);
  } catch (error) {
    console.error("Erro ao buscar plano bíblico:", error);
    return NextResponse.json({ error: "Erro ao buscar plano bíblico" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { month, day, title, readingPlan, reflection } = data;

    if (!month || !day) {
      return NextResponse.json({ error: "Mês e dia são obrigatórios" }, { status: 400 });
    }

    const saved = await prisma.bibleInOneYear.upsert({
      where: {
        month_day: {
          month: parseInt(month),
          day: parseInt(day),
        },
      },
      update: {
        title: title || "",
        readingPlan: readingPlan || "",
        reflection: reflection || "",
      },
      create: {
        month: parseInt(month),
        day: parseInt(day),
        title: title || "",
        readingPlan: readingPlan || "",
        reflection: reflection || "",
      },
    });

    return NextResponse.json({ success: true, item: saved });
  } catch (error) {
    console.error("Erro ao salvar plano bíblico:", error);
    return NextResponse.json({ error: "Erro ao salvar plano bíblico" }, { status: 500 });
  }
}
