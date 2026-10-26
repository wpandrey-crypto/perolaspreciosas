import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DailyDevotionalCard from "@/components/DailyDevotionalCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{
    month: string;
    day: string;
  }>;
}

const MONTH_NAMES = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default async function DevotionalDayPage({ params }: PageProps) {
  const resolvedParams = await params;
  const month = parseInt(resolvedParams.month);
  const day = parseInt(resolvedParams.day);

  if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    notFound();
  }

  const [devotional, coverMessage] = await Promise.all([
    prisma.dailyDevotional.findUnique({
      where: { month_day: { month, day } },
    }),
    prisma.coverMessage.findFirst({ where: { isActive: true } }),
  ]);

  // Navegação para dia anterior e próximo dia
  const prevDay = day > 1 ? day - 1 : 1;
  const nextDay = day < 31 ? day + 1 : 31;

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans text-slate-800">
      <Header verseText={coverMessage?.verse || undefined} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Barra de Navegação Entre Dias */}
        <div className="flex items-center justify-between bg-white border border-gray-300 p-3 shadow-sm text-xs md:text-sm">
          <Link
            href={`/cada-dia/${month}/${prevDay}`}
            className="flex items-center gap-1 text-[#12589e] hover:underline font-bold"
          >
            <ArrowLeft size={16} /> Dia Anterior ({prevDay}/{month})
          </Link>

          <Link
            href="/"
            className="text-gray-600 hover:text-black underline font-semibold"
          >
            Voltar para a Capa
          </Link>

          <Link
            href={`/cada-dia/${month}/${nextDay}`}
            className="flex items-center gap-1 text-[#12589e] hover:underline font-bold"
          >
            Próximo Dia ({nextDay}/{month}) <ArrowRight size={16} />
          </Link>
        </div>

        {/* Card Devocional do Dia */}
        <DailyDevotionalCard
          day={day}
          month={month}
          title={devotional?.title || `Devocional de ${day} de ${MONTH_NAMES[month]}`}
          verse={
            devotional?.verse ||
            "Salmos 119:105 - Lâmpada para os meus pés é tua palavra, e luz para o meu caminho."
          }
          content={
            devotional?.content ||
            "Esta mensagem devocional para este dia ainda não foi preenchida ou está sendo revisada pela administração."
          }
          author={devotional?.author || "Leda Latterza"}
        />
      </main>

      <Footer />
    </div>
  );
}
