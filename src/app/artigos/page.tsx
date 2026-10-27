import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Search, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface ArtigosPageProps {
  searchParams: Promise<{
    cat?: string;
    busca?: string;
    pagina?: string;
  }>;
}

export default async function ArtigosPage({ searchParams }: ArtigosPageProps) {
  const { cat, busca, pagina } = await searchParams;

  const currentPage = Math.max(1, parseInt(pagina || "1", 10) || 1);
  const pageSize = 24;

  const where: any = {};
  if (cat) {
    where.category = { slug: cat };
  }
  if (busca) {
    where.OR = [
      { title: { contains: busca } },
      { content: { contains: busca } },
      { summary: { contains: busca } },
    ];
  }

  const [totalCount, articles, categories, activeCategory, coverMessage] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.category.findMany({
      where: {
        articles: {
          some: {}, // Mostra categorias que possuem ao menos 1 artigo
        },
      },
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { orderIndex: "asc" },
    }),
    cat ? prisma.category.findUnique({ where: { slug: cat } }) : null,
    prisma.coverMessage.findFirst({ where: { isActive: true } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Construtor de URLs para links de paginação preservando cat e busca
  const makePageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (cat) params.set("cat", cat);
    if (busca) params.set("busca", busca);
    if (p > 1) params.set("pagina", p.toString());
    const q = params.toString();
    return `/artigos${q ? `?${q}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans text-slate-800">
      <Header verseText={coverMessage?.verse || undefined} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#12589e] pb-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#102a43]">
              {activeCategory
                ? activeCategory.name
                : busca
                ? `Busca por: "${busca}"`
                : "Todos os Artigos e Estudos"}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Exibindo <strong>{articles.length}</strong> de <strong>{totalCount}</strong> artigos encontrados
              {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
            </p>
          </div>

          {/* Campo de Busca Rápida */}
          <form method="GET" action="/artigos" className="flex max-w-md w-full">
            {cat && <input type="hidden" name="cat" value={cat} />}
            <input
              type="text"
              name="busca"
              defaultValue={busca || ""}
              placeholder="Pesquisar por tema ou palavra..."
              className="flex-1 border border-gray-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
            />
            <button
              type="submit"
              className="bg-[#12589e] hover:bg-[#0e447b] text-white px-4 py-1.5 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
            >
              <Search size={14} />
              <span>Buscar</span>
            </button>
          </form>
        </div>

        {/* Categorias em Pílulas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-thin">
          <Link
            href="/artigos"
            className={`text-xs px-3 py-1 rounded whitespace-nowrap border transition ${
              !cat
                ? "bg-[#12589e] text-white font-bold border-[#12589e]"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
            }`}
          >
            Todos ({totalCount})
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/artigos?cat=${c.slug}`}
              className={`text-xs px-3 py-1 rounded whitespace-nowrap border transition ${
                cat === c.slug
                  ? "bg-[#12589e] text-white font-bold border-[#12589e]"
                  : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
              }`}
            >
              {c.name} ({c._count.articles})
            </Link>
          ))}
        </div>

        {/* Grade de Artigos */}
        {articles.length === 0 ? (
          <div className="bg-white border border-gray-300 p-12 text-center text-gray-600">
            <BookOpen size={36} className="mx-auto text-gray-400 mb-3" />
            <p className="text-base font-semibold">Nenhum artigo encontrado nesta seção.</p>
            <p className="text-xs text-gray-500 mt-1">
              Tente buscar por outro termo ou clique em &ldquo;Todos&rdquo; para ver todas as publicações.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((art) => (
                <article
                  key={art.id}
                  className="bg-white border border-gray-300 hover:border-[#12589e] p-5 shadow-2xs transition hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-[#12589e] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                      {art.category?.name || "Estudo"}
                    </span>
                    <h2 className="font-bold text-base text-[#102a43] mt-2 leading-snug">
                      <Link
                        href={`/artigos/${art.category?.slug || "geral"}/${art.slug}`}
                        className="hover:text-[#12589e] transition"
                      >
                        {art.title}
                      </Link>
                    </h2>
                    {art.summary && (
                      <p className="text-xs text-gray-600 line-clamp-3 mt-2 leading-relaxed">
                        {art.summary}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span>{art.author || "Leda Latterza"}</span>
                    <Link
                      href={`/artigos/${art.category?.slug || "geral"}/${art.slug}`}
                      className="font-bold text-[#12589e] hover:underline"
                    >
                      Ler estudo &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={makePageUrl(currentPage - 1)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-semibold rounded text-gray-700 transition"
                  >
                    <ChevronLeft size={14} /> Anterior
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-gray-50 text-xs font-semibold rounded text-gray-400 cursor-not-allowed">
                    <ChevronLeft size={14} /> Anterior
                  </span>
                )}

                <span className="text-xs font-medium text-gray-600 px-3">
                  Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                </span>

                {currentPage < totalPages ? (
                  <Link
                    href={makePageUrl(currentPage + 1)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-semibold rounded text-gray-700 transition"
                  >
                    Próxima <ChevronRight size={14} />
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-gray-50 text-xs font-semibold rounded text-gray-400 cursor-not-allowed">
                    Próxima <ChevronRight size={14} />
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
