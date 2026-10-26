import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface SectionPageProps {
  params: Promise<{
    sectionKey: string;
  }>;
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { sectionKey } = await params;

  const [section, coverMessage] = await Promise.all([
    prisma.siteSection.findUnique({
      where: { sectionKey },
    }),
    prisma.coverMessage.findFirst({ where: { isActive: true } }),
  ]);

  if (!section) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans text-slate-800">
      <Header verseText={coverMessage?.verse || undefined} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12589e] hover:underline"
          >
            <ArrowLeft size={16} /> Voltar para a Página Inicial
          </Link>
        </div>

        <div className="bg-white border border-gray-300 p-6 md:p-10 shadow-sm">
          <header className="border-b border-gray-200 pb-4 mb-6">
            <span className="text-xs font-bold text-[#12589e] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded">
              {section.groupName || "SEÇÃO DO SITE"}
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#102a43] mt-2">
              {section.title}
            </h1>
          </header>

          <div
            className="text-base md:text-lg leading-relaxed text-gray-800 space-y-4"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />

          <div className="mt-10 pt-6 border-t border-gray-200 text-xs text-gray-500 text-right">
            Última atualização: {new Date(section.updatedAt).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
