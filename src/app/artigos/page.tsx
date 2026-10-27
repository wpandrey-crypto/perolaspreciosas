import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarMenu from "@/components/SidebarMenu";
import Link from "next/link";
import { Search, BookOpen, ChevronLeft, ChevronRight, FileText } from "lucide-react";

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
  const pageSize = 30; // Paginação rápida para não demorar a abrir

  const where: any = {};
  if (cat) {
    where.OR = [
      { category: { slug: cat } },
      { category: { parentSlug: cat } },
    ];
  }
  if (busca) {
    where.AND = [
      {
        OR: [
          { title: { contains: busca } },
          { content: { contains: busca } },
          { summary: { contains: busca } },
        ],
      },
    ];
  }

  const [totalCount, articles, activeCategory, coverMessage] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parentSlug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    cat ? prisma.category.findUnique({ where: { slug: cat } }) : null,
    prisma.coverMessage.findFirst({ where: { isActive: true } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

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

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Menu Principal (Sidebar no PC / Botão Flutuante no Celular) */}
          <SidebarMenu activeCategorySlug={cat} />

          {/* Área Central de Conteúdo */}
          <div className="flex-1 w-full min-w-0">
            {/* Cabeçalho da Seção */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#12589e] pb-3 mb-5">
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-bold text-[#102a43] flex items-center gap-2">
                  <FileText size={22} className="text-[#12589e]" />
                  <span>
                    {activeCategory
                      ? activeCategory.name
                      : busca
                      ? `Busca por: "${busca}"`
                      : "Todos os Artigos e Estudos"}
                  </span>
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Mostrando <strong>{articles.length}</strong> de <strong>{totalCount}</strong> estudos
                  {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
                </p>
              </div>

              {/* Campo de Busca Rápida */}
              <form method="GET" action="/artigos" className="flex max-w-sm w-full">
                {cat && <input type="hidden" name="cat" value={cat} />}
                <input
                  type="text"
                  name="busca"
                  defaultValue={busca || ""}
                  placeholder="Pesquisar neste tema..."
                  className="flex-1 border border-gray-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                />
                <button
                  type="submit"
                  className="bg-[#12589e] hover:bg-[#0e447b] text-white px-3.5 py-1.5 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <Search size={14} />
                  <span>Buscar</span>
                </button>
              </form>
            </div>

            {/* Texto Principal da Categoria (Introdução em Destaque) */}
            {activeCategory?.description && (
              <div className="bg-blue-50/70 border-l-4 border-[#12589e] p-4 md:p-5 shadow-2xs mb-6 text-sm text-gray-800 leading-relaxed font-serif rounded-r">
                <div className="text-xs font-bold text-[#12589e] uppercase tracking-wider mb-1">
                  Introdução do Tema
                </div>
                <div className="whitespace-pre-line italic">
                  {activeCategory.description}
                </div>
              </div>
            )}

            {/* LISTA DE ARTIGOS NO ESTILO FIEL AO LEGADO (LINHAS ZEBRADAS) */}
            {articles.length === 0 ? (
              <div className="bg-white border border-gray-300 p-12 text-center text-gray-600">
                <BookOpen size={36} className="mx-auto text-gray-400 mb-3" />
                <p className="text-base font-semibold">Nenhum artigo encontrado nesta seção.</p>
                <p className="text-xs text-gray-500 mt-1">
                  Tente buscar por outro termo ou escolha outra categoria no Menu Principal ao lado.
                </p>
              </div>
            ) : (
              <div className="border border-gray-300 shadow-2xs bg-white divide-y divide-gray-200">
                {articles.map((art, idx) => {
                  const isEven = idx % 2 === 0;
                  const targetCategorySlug = art.category?.slug || cat || "geral";

                  return (
                    <div
                      key={art.id}
                      className={`p-3 md:px-5 md:py-3.5 transition hover:bg-yellow-50/80 ${
                        isEven ? "bg-[#eef5fc]" : "bg-white"
                      }`}
                    >
                      {/* Título com Marcador estilo Legado */}
                      <Link
                        href={`/artigos/${targetCategorySlug}/${art.slug}`}
                        className="text-[#12589e] hover:text-[#0b3c6d] font-bold text-sm md:text-[15px] hover:underline block leading-snug"
                      >
                        - {art.title}
                      </Link>

                      {/* Resumo / Subtítulo logo abaixo */}
                      {art.summary && (
                        <p className="text-xs md:text-[13px] text-gray-800 leading-relaxed mt-1 pl-2 font-normal">
                          {art.summary}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Paginação Estilizada */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-xs text-gray-600">
                  Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> (Total: {totalCount} artigos)
                </span>

                <div className="flex items-center gap-1.5">
                  {currentPage > 1 ? (
                    <Link
                      href={makePageUrl(currentPage - 1)}
                      className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-semibold rounded text-gray-700 transition shadow-2xs"
                    >
                      <ChevronLeft size={14} /> Anterior
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-gray-50 text-xs font-semibold rounded text-gray-400 cursor-not-allowed">
                      <ChevronLeft size={14} /> Anterior
                    </span>
                  )}

                  {currentPage < totalPages ? (
                    <Link
                      href={makePageUrl(currentPage + 1)}
                      className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 text-xs font-semibold rounded text-gray-700 transition shadow-2xs"
                    >
                      Próxima <ChevronRight size={14} />
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 bg-gray-50 text-xs font-semibold rounded text-gray-400 cursor-not-allowed">
                      Próxima <ChevronRight size={14} />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
