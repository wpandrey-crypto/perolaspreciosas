"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function AdmLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Se for a tela de login, não exibe a barra administrativa superior
  if (pathname === "/adm/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    if (confirm("Deseja realmente sair da administração?")) {
      await fetch("/api/adm/logout", { method: "POST" });
      router.push("/adm/login");
    }
  };

  const navRow1 = [
    { label: "Mensagem da Capa", href: "/adm/capa" },
    { label: "Cada Dia / Ocasiões Capa", href: "/adm/cada-dia" },
    { label: "Chamadas na Capa", href: "/adm/capa" },
    { label: "Artigos", href: "/adm/artigos" },
    { label: "HOJE", href: "/adm/hoje" },
    { label: "De A a Z", href: "/adm/artigos" },
  ];

  const navRow2 = [
    { label: "Cada Dia - Todo Dia", href: "/adm/cada-dia" },
    { label: "Toda a Bíblia em UM Ano", href: "/adm/biblia-ano" },
    { label: "Ocasiões", href: "/adm/cada-dia" },
    { label: "EBD", href: "/adm/artigos?cat=ebd-ebf" },
    { label: "Usuários", href: "/adm/usuarios" },
    { label: "Textos do Site", href: "/adm/textos" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Topo Azul Escuro Clássico */}
      <header className="bg-[#0f5b9e] text-white shadow select-none">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#0a4577]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🫧</span>
            <span className="font-bold text-lg md:text-xl tracking-tight">
              Administração: <span className="font-normal">Site Pérolas.Preciosas</span>
            </span>
          </div>
          <div className="text-xs md:text-sm text-blue-100 flex items-center gap-3">
            <span>Usuário: <strong className="text-white">Leda Latterza</strong></span>
            <Link
              href="/"
              target="_blank"
              className="text-yellow-300 hover:text-white underline text-xs"
            >
              [Ver Site Aberto]
            </Link>
          </div>
        </div>

        {/* Linha 1 de Navegação */}
        <nav className="bg-[#1268b3] border-b border-[#0f5899]">
          <div className="max-w-7xl mx-auto px-2 flex flex-wrap items-center justify-around text-xs md:text-sm font-semibold py-1">
            {navRow1.map((item, idx) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`px-3 py-1 rounded transition whitespace-nowrap ${
                    active
                      ? "bg-white text-[#0f5b9e] shadow-sm font-bold"
                      : "text-white hover:bg-[#0e528e] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Linha 2 de Navegação */}
        <nav className="bg-[#0e528e]">
          <div className="max-w-7xl mx-auto px-2 flex flex-wrap items-center justify-around text-xs md:text-sm font-semibold py-1">
            {navRow2.map((item, idx) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`px-3 py-1 rounded transition whitespace-nowrap ${
                    active
                      ? "bg-white text-[#0f5b9e] shadow-sm font-bold"
                      : "text-white hover:bg-[#0a4070] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-yellow-300 hover:text-white hover:bg-red-700 rounded transition cursor-pointer font-bold whitespace-nowrap"
            >
              SAIR
            </button>
          </div>
        </nav>
      </header>

      {/* Área de Conteúdo */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {children}
      </main>

      {/* Rodapé Interno */}
      <footer className="bg-gray-100 border-t border-gray-300 text-center py-3 text-xs text-gray-500">
        Pérolas Preciosas &bull; Intranet Administrativa Segura
      </footer>
    </div>
  );
}
