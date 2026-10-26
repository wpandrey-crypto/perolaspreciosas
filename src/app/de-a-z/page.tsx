import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default async function DeAaZPage() {
  const [articles, coverMessage] = await Promise.all([
    prisma.article.findMany({
      orderBy: { title: "asc" },
      include: { category: true },
    }),
    prisma.coverMessage.findFirst({ where: { isActive: true } }),
  ]);

  // Agrupa por primeira letra
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const grouped: Record<string, typeof articles> = {};

  alphabet.forEach((letter) => {
    grouped[letter] = [];
  });

  articles.forEach((art) => {
    const firstChar = art.title.trim().charAt(0).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (grouped[firstChar]) {
      grouped[firstChar].push(art);
    }
  });

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans text-slate-800">
      <Header verseText={coverMessage?.verse || undefined} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <div className="border-b-2 border-[#12589e] pb-3 mb-6">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#102a43]">
            Índice de Artigos: De A a Z
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Encontre estudos e devocionais ordenados alfabeticamente. Total: <strong>{articles.length}</strong> estudos.
          </p>
        </div>

        {/* Letras do Alfabeto */}
        <div className="flex flex-wrap gap-1.5 mb-8 bg-white p-3 border border-gray-300 shadow-sm">
          {alphabet.map((letter) => {
            const hasItems = grouped[letter].length > 0;
            return hasItems ? (
              <a
                key={letter}
                href={`#letra-${letter}`}
                className="w-8 h-8 flex items-center justify-center font-bold text-xs bg-[#12589e] text-white hover:bg-blue-800 rounded transition"
              >
                {letter}
              </a>
            ) : (
              <span
                key={letter}
                className="w-8 h-8 flex items-center justify-center text-xs text-gray-300 bg-gray-100 rounded"
              >
                {letter}
              </span>
            );
          })}
        </div>

        {/* Listagem Agrupada */}
        <div className="space-y-8">
          {alphabet.map((letter) => {
            const items = grouped[letter];
            if (items.length === 0) return null;

            return (
              <section
                key={letter}
                id={`letra-${letter}`}
                className="bg-white border border-gray-300 p-6 shadow-sm scroll-mt-6"
              >
                <div className="flex items-center gap-3 border-b-2 border-[#12589e] pb-2 mb-4">
                  <span className="w-9 h-9 bg-[#12589e] text-white font-serif font-bold text-lg flex items-center justify-center rounded">
                    {letter}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">
                    {items.length} {items.length === 1 ? "artigo" : "artigos"}
                  </span>
                </div>

                <ul className="divide-y divide-gray-100 space-y-2">
                  {items.map((art) => (
                    <li key={art.id} className="pt-2 flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={`/artigos/${art.category?.slug || "geral"}/${art.slug}`}
                        className="font-semibold text-sm text-[#102a43] hover:text-[#12589e] hover:underline"
                      >
                        {art.title}
                      </Link>
                      <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {art.category?.name || "Geral"}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
