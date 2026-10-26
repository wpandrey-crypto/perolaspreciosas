"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Calendar as CalendarIcon, Search } from "lucide-react";

interface HeaderProps {
  verseText?: string;
}

export default function Header({
  verseText = "A Deus toda a Honra e a Glória, a Soberania e o Poder, o Louvor e as Ações de Graças",
}: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [diversosOpen, setDiversosOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const now = new Date();
  const currentMonthNum = now.getMonth() + 1; // 1-12
  const currentDayNum = now.getDate(); // 1-31

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const currentMonthName = monthNames[now.getMonth()];

  // Dias no mês atual
  const daysInMonth = new Date(now.getFullYear(), currentMonthNum, 0).getDate();
  const firstDayWeekIndex = new Date(now.getFullYear(), now.getMonth(), 1).getDay(); // 0 = Domingo

  // Montagem da grade do calendário clássico do topo
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayWeekIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/artigos?busca=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-[#f4f7fb] border-b border-blue-200 font-sans shadow-sm">
      {/* Topo com Banner Clássico & Calendário Diário */}
      <div className="max-w-6xl mx-auto px-2 md:px-4 py-2">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Banner Pérolas */}
          <Link
            href="/"
            className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left group"
          >
            <div className="flex items-center gap-3">
              {/* Círculos de Pérolas artísticos */}
              <div className="flex items-center -space-x-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-100 via-white to-amber-200 border-2 border-white shadow-md inline-block"></span>
                <span className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-100 via-white to-sky-200 border-2 border-white shadow-md inline-block"></span>
                <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-200 via-white to-amber-100 border-2 border-white shadow-md inline-block"></span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif italic font-bold tracking-tight text-[#334e68] drop-shadow-sm group-hover:text-[#102a43] transition">
                Pérolas
              </h1>
            </div>
            <p className="text-sm md:text-base font-serif italic text-[#627d98] ml-2 mt-0.5">
              momentos preciosos com Deus
            </p>
          </Link>

          {/* Calendário Interativo do Topo: "Cada Dia, o Ano Todo!" */}
          <div className="w-full sm:w-auto flex justify-center">
            <div className="border border-[#12589e] bg-white rounded-none shadow-md overflow-hidden text-xs w-[280px]">
              {/* Título Superior */}
              <div className="bg-[#12589e] text-white text-center font-bold py-1 px-2 text-[11px] tracking-wider uppercase">
                Cada Dia, o Ano Todo!
              </div>
              {/* Mês Atual */}
              <div className="bg-[#1976d2] text-white text-center font-bold py-0.5 text-xs">
                {currentMonthName}
              </div>

              {/* Tabela do Mês */}
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-blue-50 text-[10px] text-gray-700 font-bold border-b border-gray-300">
                    <th className="py-0.5">D</th>
                    <th className="py-0.5">S</th>
                    <th className="py-0.5">T</th>
                    <th className="py-0.5">Q</th>
                    <th className="py-0.5">Q</th>
                    <th className="py-0.5">S</th>
                    <th className="py-0.5">S</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(calendarCells.length / 7) }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-100 last:border-b-0">
                      {Array.from({ length: 7 }).map((_, colIndex) => {
                        const cellIndex = rowIndex * 7 + colIndex;
                        const day = calendarCells[cellIndex];
                        const isToday = day === currentDayNum;

                        if (!day) {
                          return <td key={colIndex} className="p-0.5 bg-gray-50/50"></td>;
                        }

                        return (
                          <td key={colIndex} className="p-0.5">
                            <Link
                              href={`/cada-dia/${currentMonthNum}/${day}`}
                              className={`block py-0.5 rounded text-[11px] transition ${
                                isToday
                                  ? "bg-red-600 text-white font-extrabold shadow-sm hover:bg-red-700"
                                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-900 font-medium"
                              }`}
                              title={`Clique para ler a mensagem de ${day} de ${currentMonthName}`}
                            >
                              {day}
                            </Link>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-gray-100 text-[10px] text-center text-gray-600 py-0.5 border-t border-gray-200">
                Hoje é dia <strong className="text-red-600 font-bold">{currentDayNum}</strong> (clique para ler)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Friso Bíblico em Azul Vibrante com curva suave */}
      <div className="w-full bg-[#12589e] text-white text-center py-1.5 px-4 text-xs md:text-sm font-serif italic tracking-wide shadow-inner border-y border-[#0f4b85]">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <span>&ldquo;{verseText}&rdquo;</span>
        </div>
      </div>

      {/* Menu Horizontal Clássico */}
      <div className="bg-[#e4ebf3] border-b border-gray-300 relative">
        <div className="max-w-6xl mx-auto px-2 flex items-center justify-between">
          {/* Botão Mobile */}
          <div className="lg:hidden flex items-center justify-between w-full py-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#12589e] text-white text-xs font-bold rounded cursor-pointer"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
              <span>MENU DO SITE</span>
            </button>

            {/* Busca Rápida Mobile */}
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-l px-2 py-1 text-xs w-32 bg-white"
              />
              <button
                type="submit"
                className="bg-[#12589e] text-white px-2 py-1 rounded-r text-xs"
              >
                <Search size={14} />
              </button>
            </form>
          </div>

          {/* Links Desktop */}
          <nav className="hidden lg:flex items-center justify-between w-full text-xs font-semibold text-gray-700 select-none py-1">
            <Link
              href="/"
              className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition"
            >
              HOME
            </Link>

            <Link
              href="/artigos?cat=iniciantes"
              className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition"
            >
              INICIANTES
            </Link>

            {/* Dropdown AVANÇADO */}
            <div
              className="relative group"
              onMouseEnter={() => setAdvancedOpen(true)}
              onMouseLeave={() => setAdvancedOpen(false)}
            >
              <button
                type="button"
                className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition flex items-center gap-1 cursor-pointer"
              >
                AVANÇADO ▼
              </button>
              {advancedOpen && (
                <div className="absolute top-full left-0 w-48 bg-white border-2 border-[#12589e] shadow-xl py-1 z-50">
                  <Link
                    href="/artigos?cat=homiletica"
                    className="block px-4 py-1.5 text-xs text-gray-700 hover:bg-[#12589e] hover:text-white"
                  >
                    Homilética
                  </Link>
                  <Link
                    href="/artigos?cat=hermeneutica"
                    className="block px-4 py-1.5 text-xs text-gray-700 hover:bg-[#12589e] hover:text-white"
                  >
                    Hermenêutica
                  </Link>
                  <Link
                    href="/artigos?cat=religioes"
                    className="block px-4 py-1.5 text-xs text-gray-700 hover:bg-[#12589e] hover:text-white"
                  >
                    Religiões
                  </Link>
                  <Link
                    href="/artigos?cat=seitas"
                    className="block px-4 py-1.5 text-xs text-gray-700 hover:bg-[#12589e] hover:text-white"
                  >
                    Seitas
                  </Link>
                  <Link
                    href="/artigos?cat=doutrinas"
                    className="block px-4 py-1.5 text-xs text-gray-700 hover:bg-[#12589e] hover:text-white"
                  >
                    Doutrinas
                  </Link>
                  <Link
                    href="/artigos?cat=historia-da-igreja"
                    className="block px-4 py-1.5 text-xs text-gray-700 hover:bg-[#12589e] hover:text-white"
                  >
                    História da Igreja
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/artigos?cat=vida-crista"
              className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition"
            >
              VIDA CRISTÃ
            </Link>

            <Link
              href="/artigos?cat=biblia"
              className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition"
            >
              BÍBLIA
            </Link>

            <Link
              href="/artigos?cat=eles-elas"
              className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition"
            >
              ELES / ELAS
            </Link>

            <Link
              href="/artigos?cat=ebd-ebf"
              className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition"
            >
              EBD / EBF
            </Link>

            <Link
              href="/artigos?cat=missoes"
              className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition"
            >
              MISSÕES
            </Link>

            {/* Dropdown DIVERSOS */}
            <div
              className="relative group"
              onMouseEnter={() => setDiversosOpen(true)}
              onMouseLeave={() => setDiversosOpen(false)}
            >
              <button
                type="button"
                className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition flex items-center gap-1 cursor-pointer"
              >
                DIVERSOS ▼
              </button>
              {diversosOpen && (
                <div className="absolute top-full left-0 w-44 bg-white border-2 border-[#12589e] shadow-xl py-1 z-50">
                  <Link
                    href="/secao/diversos-folhetos"
                    className="block px-4 py-1.5 text-xs text-gray-700 hover:bg-[#12589e] hover:text-white"
                  >
                    Folhetos
                  </Link>
                  <Link
                    href="/artigos?cat=diversos"
                    className="block px-4 py-1.5 text-xs text-gray-700 hover:bg-[#12589e] hover:text-white"
                  >
                    Ocasiões & Temas
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/secao/quem-escreve"
              className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition"
            >
              QUEM ESCREVE
            </Link>

            <Link
              href="/secao/iceb"
              className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition"
            >
              ICEB
            </Link>

            <Link
              href="/secao/contato"
              className="px-2.5 py-1.5 hover:bg-[#12589e] hover:text-white rounded transition"
            >
              CONTATO
            </Link>
          </nav>
        </div>

        {/* Menu Mobile Expandido */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b-2 border-[#12589e] p-4 space-y-2 text-sm">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 border-b border-gray-100 font-semibold text-[#12589e]"
            >
              PÁGINA INICIAL (HOME)
            </Link>
            <Link
              href="/artigos?cat=iniciantes"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 border-b border-gray-100"
            >
              INICIANTES
            </Link>
            <div className="py-1">
              <span className="font-bold text-gray-800 text-xs uppercase text-gray-500">
                AVANÇADO
              </span>
              <div className="pl-3 space-y-1 mt-1 text-xs">
                <Link href="/artigos?cat=homiletica" onClick={() => setMobileMenuOpen(false)} className="block py-1">Homilética</Link>
                <Link href="/artigos?cat=hermeneutica" onClick={() => setMobileMenuOpen(false)} className="block py-1">Hermenêutica</Link>
                <Link href="/artigos?cat=religioes" onClick={() => setMobileMenuOpen(false)} className="block py-1">Religiões</Link>
                <Link href="/artigos?cat=seitas" onClick={() => setMobileMenuOpen(false)} className="block py-1">Seitas</Link>
                <Link href="/artigos?cat=doutrinas" onClick={() => setMobileMenuOpen(false)} className="block py-1">Doutrinas</Link>
                <Link href="/artigos?cat=historia-da-igreja" onClick={() => setMobileMenuOpen(false)} className="block py-1">História da Igreja</Link>
              </div>
            </div>
            <Link href="/artigos?cat=vida-crista" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-gray-100">VIDA CRISTÃ</Link>
            <Link href="/artigos?cat=biblia" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-gray-100">BÍBLIA</Link>
            <Link href="/artigos?cat=eles-elas" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-gray-100">ELES / ELAS</Link>
            <Link href="/artigos?cat=ebd-ebf" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-gray-100">EBD / EBF</Link>
            <Link href="/artigos?cat=missoes" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-gray-100">MISSÕES</Link>
            <Link href="/secao/diversos-folhetos" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-gray-100">DIVERSOS / FOLHETOS</Link>
            <Link href="/secao/quem-escreve" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-gray-100">QUEM ESCREVE</Link>
            <Link href="/secao/iceb" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 border-b border-gray-100">ICEB</Link>
            <Link href="/secao/contato" onClick={() => setMobileMenuOpen(false)} className="block py-1.5">CONTATO</Link>
          </div>
        )}
      </div>
    </header>
  );
}
