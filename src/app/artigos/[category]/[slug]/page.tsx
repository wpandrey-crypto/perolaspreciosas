import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Share2, Calendar, User } from "lucide-react";

interface ArticlePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function SingleArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article) {
    notFound();
  }

  const coverMessage = await prisma.coverMessage.findFirst({
    where: { isActive: true },
  });

  const shareText = encodeURIComponent(
    `✨ *Pérolas Preciosas*\n\n*${article.title}*\n\nLeia este estudo completo em: https://perolaspreciosas.com.br/artigos/${category}/${slug}`
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans text-slate-800">
      <Header verseText={coverMessage?.verse || undefined} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Navegação de Volta */}
        <div className="mb-6">
          <Link
            href={`/artigos?cat=${category}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12589e] hover:underline"
          >
            <ArrowLeft size={16} /> Voltar para {article.category?.name || "Artigos"}
          </Link>
        </div>

        {/* Artigo Completo */}
        <article className="bg-white border border-gray-300 p-6 md:p-10 shadow-sm">
          {/* Cabeçalho do Artigo */}
          <header className="border-b border-gray-200 pb-6 mb-6">
            <span className="text-xs font-bold text-[#12589e] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded">
              {article.category?.name || "Estudo"}
            </span>

            <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#102a43] mt-3 leading-tight">
              {article.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <User size={14} /> {article.author || "Leda Latterza"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(article.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>

              {/* Botão de Compartilhar no WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1 bg-[#25d366] hover:bg-[#20ba59] text-white font-bold px-3 py-1 rounded text-xs shadow-sm cursor-pointer"
              >
                <Share2 size={13} />
                <span>WhatsApp</span>
              </a>
            </div>
          </header>

          {/* Resumo em Destaque */}
          {article.summary && (
            <div className="bg-blue-50/60 border-l-4 border-[#12589e] p-4 text-sm font-medium text-gray-700 italic mb-6 leading-relaxed">
              {article.summary}
            </div>
          )}

          {/* Conteúdo Principal do Artigo */}
          <div className="prose prose-slate max-w-none text-base md:text-lg leading-relaxed text-gray-800 space-y-4">
            {article.content.split("\n").map((par, idx) => {
              if (!par.trim()) return null;
              return <p key={idx}>{par}</p>;
            })}
          </div>

          {/* Rodapé do Artigo */}
          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
            <span>Ministério Pérolas Preciosas &bull; Semeando a Palavra</span>
            <Link
              href="/"
              className="font-bold text-[#12589e] hover:underline"
            >
              Ir para a Página Inicial &rarr;
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
