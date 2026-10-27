import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleReader from "@/components/ArticleReader";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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

  const formattedDate = new Date(article.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans text-slate-800">
      <Header verseText={coverMessage?.verse || undefined} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Navegação de Volta (Oculta na Impressão) */}
        <div className="mb-6 print:hidden">
          <Link
            href={`/artigos?cat=${article.category?.slug || category}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12589e] hover:underline"
          >
            <ArrowLeft size={16} /> Voltar para {article.category?.name || "Artigos"}
          </Link>
        </div>

        {/* Leitor Completo do Artigo */}
        <ArticleReader
          title={article.title}
          categoryName={article.category?.name}
          categorySlug={article.category?.slug}
          author={article.author || "Leda Latterza"}
          createdAt={formattedDate}
          summary={article.summary}
          contentHtml={article.content}
          slug={article.slug}
        />

        {/* Rodapé do Artigo (Oculta na Impressão) */}
        <div className="mt-8 pt-4 border-t border-gray-300 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 print:hidden">
          <span>Ministério Pérolas Preciosas &bull; Semeando a Palavra</span>
          <Link
            href="/"
            className="font-bold text-[#12589e] hover:underline"
          >
            Ir para a Página Inicial &rarr;
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
