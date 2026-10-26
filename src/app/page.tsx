import Link from "next/link";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DailyDevotionalCard from "@/components/DailyDevotionalCard";
import { BookOpen, Calendar, HelpCircle, Flame, ArrowRight, Search, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  // Consulta paralela no banco
  const [coverMessage, todayDevotional, todayBible, recentArticles, categories] =
    await Promise.all([
      prisma.coverMessage.findFirst({ where: { isActive: true } }),
      prisma.dailyDevotional.findUnique({
        where: { month_day: { month: currentMonth, day: currentDay } },
      }),
      prisma.bibleInOneYear.findUnique({
        where: { month_day: { month: currentMonth, day: currentDay } },
      }),
      prisma.article.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
      prisma.category.findMany({
        orderBy: { orderIndex: "asc" },
      }),
    ]);

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans text-slate-800">
      {/* Topo Clássico com Calendário Integrado */}
      <Header verseText={coverMessage?.verse || undefined} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Principal (8 colunas) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Mensagem de Boas-Vindas da Capa */}
            <section className="bg-white border border-gray-300 p-6 shadow-sm rounded-none">
              <h2 className="text-2xl font-serif font-bold text-[#12589e] mb-2">
                {coverMessage?.title || "BEM VINDO !"}
              </h2>
              {coverMessage?.subtitle && (
                <p className="text-sm font-semibold text-gray-700 italic mb-3">
                  {coverMessage.subtitle}
                </p>
              )}
              <div className="text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3">
                {coverMessage?.content ||
                  "Referências são de suma importância: ler, copiar e, em especial, vivê-las! Há devocionais diárias para cada dia do ano todo."}
              </div>
            </section>

            {/* Card Principal: Devocional de Hoje */}
            <section>
              <DailyDevotionalCard
                day={currentDay}
                month={currentMonth}
                title={todayDevotional?.title || "Mensagem Devocional Diária"}
                verse={
                  todayDevotional?.verse ||
                  "Salmos 119:105 - Lâmpada para os meus pés é tua palavra, e luz para o meu caminho."
                }
                content={
                  todayDevotional?.content ||
                  "A palavra do Senhor nos orienta em todos os momentos de nossa vida. Dedique estes instantes para orar e meditar na graça de Cristo."
                }
                author={todayDevotional?.author || "Leda Latterza"}
              />
            </section>

            {/* Destaque: Toda a Bíblia em Um Ano */}
            <section className="bg-white border-2 border-amber-600 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-amber-800">
                <BookOpen size={20} />
                <h3 className="font-bold text-base uppercase tracking-wider">
                  Toda a Bíblia em UM Ano (Leitura de Hoje)
                </h3>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {todayBible?.readingPlan || "Gênesis 1-3; Mateus 1"}
              </p>
              {todayBible?.reflection && (
                <p className="text-xs text-gray-600 italic mt-2 border-t border-amber-100 pt-2">
                  {todayBible.reflection}
                </p>
              )}
              <div className="mt-3 text-right">
                <Link
                  href={`/adm/biblia-ano`}
                  className="text-xs text-[#12589e] hover:underline font-semibold"
                >
                  Ver plano completo dos 12 meses &rarr;
                </Link>
              </div>
            </section>

            {/* Artigos e Estudos Bíblicos Recentes */}
            <section className="space-y-4">
              <div className="border-b-2 border-[#12589e] pb-2 flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-[#102a43] flex items-center gap-2">
                  <span>📖</span> Artigos e Estudos Bíblicos
                </h3>
                <Link
                  href="/artigos"
                  className="text-xs text-[#12589e] hover:underline font-bold"
                >
                  Ver todos os artigos &rarr;
                </Link>
              </div>

              {recentArticles.length === 0 ? (
                <div className="bg-white border border-gray-300 p-6 text-center text-sm text-gray-600">
                  <p>Nenhum artigo publicado no momento.</p>
                  <p className="text-xs mt-1 text-gray-500">
                    Novos estudos podem ser cadastrados através do painel de administração.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentArticles.map((art) => (
                    <article
                      key={art.id}
                      className="bg-white border border-gray-300 hover:border-[#12589e] p-4 shadow-sm transition hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-[#12589e] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                          {art.category?.name || "Estudo"}
                        </span>
                        <h4 className="font-bold text-base text-[#102a43] mt-2 leading-snug">
                          <Link
                            href={`/artigos/${art.category?.slug || "geral"}/${art.slug}`}
                            className="hover:text-[#12589e]"
                          >
                            {art.title}
                          </Link>
                        </h4>
                        {art.summary && (
                          <p className="text-xs text-gray-600 line-clamp-3 mt-2 leading-relaxed">
                            {art.summary}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
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
              )}
            </section>
          </div>

          {/* Barra Lateral (4 colunas) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Box de Busca */}
            <div className="bg-white border border-gray-300 p-4 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Busca no Site
              </h4>
              <form action="/artigos" method="GET" className="flex">
                <input
                  type="text"
                  name="busca"
                  placeholder="Pesquisar estudos..."
                  className="w-full border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                />
                <button
                  type="submit"
                  className="bg-[#12589e] hover:bg-[#0e447b] text-white px-3 py-1.5 text-xs font-bold cursor-pointer"
                >
                  OK
                </button>
              </form>
            </div>

            {/* Box: Oremos pelo Brasil / Eventos */}
            <div className="bg-[#eef8f2] border-2 border-[#2b8a3e] p-4 text-center">
              <span className="text-xs font-bold text-[#2b8a3e] uppercase tracking-wide block mb-1">
                E V E N T O S !
              </span>
              <h4 className="text-lg font-bold text-[#1b4324] leading-tight mb-2">
                OREMOS PELO BRASIL!
              </h4>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                &ldquo;Antes de tudo... ORAR por todos os homens e PELAS AUTORIDADES
                para ter vida tranqüila... 1 Tim. 2.1-3&rdquo;
              </p>
            </div>

            {/* Box: Série Discipulado */}
            <div className="bg-[#f0f7ff] border-2 border-[#12589e] p-4">
              <span className="text-[11px] font-bold text-[#12589e] uppercase tracking-wide block">
                SÉRIE ESPECIAL
              </span>
              <h4 className="text-base font-bold text-[#102a43] mt-1 mb-2">
                DISCIPULADO: FAZEI DISCÍPULOS
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Jesus disse: <em>&ldquo;Ide e fazei discípulos de todas as nações...&rdquo;</em>.
                Uma série de artigos práticos para quem deseja crescer na fé cristã.
              </p>
              <div className="mt-3">
                <Link
                  href="/artigos?cat=iniciantes"
                  className="text-xs font-bold text-[#12589e] hover:underline"
                >
                  Acessar Série &rarr;
                </Link>
              </div>
            </div>

            {/* Categorias e Temas */}
            <div className="bg-white border border-gray-300 p-4 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 border-b border-gray-200 pb-1">
                Categorias de Estudos
              </h4>
              <ul className="space-y-1.5 text-xs">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/artigos?cat=${c.slug}`}
                      className="text-gray-700 hover:text-[#12589e] hover:font-bold transition flex items-center justify-between"
                    >
                      <span>{c.name}</span>
                      <span className="text-gray-400 text-[10px]">&rsaquo;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Box Institucional: Quem Escreve & ICEB */}
            <div className="bg-gray-50 border border-gray-300 p-4 text-xs text-gray-600 space-y-2">
              <div className="font-bold text-gray-800">Sobre o Ministério:</div>
              <p className="leading-relaxed">
                Mensagens elaboradas sob a direção do Espírito Santo para abençoar lares e igrejas em todo o Brasil.
              </p>
              <div className="pt-2">
                <Link
                  href="/secao/quem-escreve"
                  className="text-[#12589e] font-bold hover:underline"
                >
                  Conheça a história de quem escreve &rarr;
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
