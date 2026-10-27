"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BookOpen } from "lucide-react";

export interface MenuItem {
  name: string;
  slug: string;
  subcategories?: { name: string; slug: string }[];
}

interface SidebarMenuProps {
  categories?: MenuItem[];
  activeCategorySlug?: string;
}

// Hierarquia canônica padrão idêntica à Imagem 2 do legado
export const DEFAULT_MENU_STRUCTURE: MenuItem[] = [
  {
    name: "INICIANTES",
    slug: "iniciantes",
    subcategories: [
      { name: "Evangelismo", slug: "evangelismo" },
      { name: "Principiantes", slug: "principiantes" },
      { name: "Discipulado", slug: "discipulado" },
      { name: "Discipulador", slug: "discipulador" },
      { name: "Introdução à Bíblia", slug: "introducao-a-biblia" },
      { name: "Apostilas", slug: "apostilas" },
    ],
  },
  {
    name: "AVANÇADO",
    slug: "avancado",
    subcategories: [
      { name: "Homilética", slug: "homiletica" },
      { name: "Hermenêutica", slug: "hermeneutica" },
      { name: "Religiões", slug: "religioes" },
      { name: "Seitas", slug: "seitas" },
      { name: "Doutrinas", slug: "doutrinas" },
      { name: "História da Igreja", slug: "historia-da-igreja" },
    ],
  },
  {
    name: "VIDA CRISTÃ",
    slug: "vida-crista",
    subcategories: [
      { name: "Aos Cristãos em Geral", slug: "aos-cristaos" },
      { name: "Aconselhamento", slug: "aconselhamento" },
      { name: "Minhas Pérolas", slug: "minhas-perolas" },
      { name: "Finanças", slug: "financas" },
    ],
  },
  {
    name: "BÍBLIA",
    slug: "biblia",
    subcategories: [
      { name: "As Escrituras", slug: "as-escrituras" },
      { name: "VT - Diversos", slug: "vt-diversos" },
      { name: "VT - História", slug: "vt-historia" },
      { name: "VT - Livros", slug: "vt-livros" },
      { name: "VT - Sinopse", slug: "sinopse-vt" },
      { name: "NT - Diversos", slug: "nt-diversos" },
      { name: "NT - História", slug: "nt-historia" },
      { name: "NT - Livros", slug: "nt-livros" },
      { name: "NT - Sinopse", slug: "sinopse-nt" },
      { name: "Mapas", slug: "mapas" },
      { name: "Cronologias", slug: "cronologias" },
      { name: "Provérbios", slug: "proverbios" },
      { name: "Salmos", slug: "salmos" },
      { name: "Panorâmica", slug: "panoramica" },
      { name: "Bíblia Toda em Um Ano", slug: "a-biblia-em-um-ano" },
      { name: "Esquemas Mensais", slug: "esquemas-mensais" },
    ],
  },
  {
    name: "ELES / ELAS",
    slug: "eles-elas",
    subcategories: [
      { name: "Casais", slug: "casais" },
      { name: "Homens", slug: "homens" },
      { name: "Líderes", slug: "lideres" },
      { name: "Liderança", slug: "lideranca" },
      { name: "Maná da Segunda", slug: "mana-da-segunda" },
      { name: "Mulheres", slug: "mulheres" },
      { name: "Dicas", slug: "dicas" },
      { name: "Receitas", slug: "receitas" },
    ],
  },
  {
    name: "EBD / EBF",
    slug: "ebd-ebf",
    subcategories: [],
  },
  {
    name: "MISSÕES",
    slug: "missoes",
    subcategories: [
      { name: "Missões", slug: "missoes" },
      { name: "Missionários", slug: "missionarios" },
      { name: "Diversos", slug: "missoes-diversos" },
    ],
  },
  {
    name: "DIVERSOS",
    slug: "diversos",
    subcategories: [
      { name: "Hoje", slug: "hoje" },
      { name: "De a A a Z", slug: "de-a-a-z" },
      { name: "Folhetos", slug: "folhetos" },
      { name: "Reflexões", slug: "reflexoes" },
      { name: "Eventos", slug: "eventos" },
      { name: "Dias Especiais", slug: "dias-especiais" },
      { name: "Ocasiões", slug: "ocasioes" },
      { name: "Publicações", slug: "publicacoes" },
    ],
  },
];

export default function SidebarMenu({
  categories = DEFAULT_MENU_STRUCTURE,
  activeCategorySlug,
}: SidebarMenuProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const renderMenuList = () => (
    <div className="bg-[#eeeeee] border border-gray-300 shadow-2xs font-sans text-xs select-none">
      {/* Barra de Cabeçalho do Menu */}
      <div className="bg-[#a8a8a8] text-white font-bold text-center py-1.5 px-3 uppercase tracking-wider text-[11px] shadow-2xs border-b border-gray-400">
        Menu Principal
      </div>

      {/* Lista de Categorias e Subcategorias */}
      <div className="p-3 space-y-3.5 max-h-[82vh] overflow-y-auto scrollbar-thin">
        {categories.map((cat) => {
          const isCatActive = activeCategorySlug === cat.slug;

          return (
            <div key={cat.slug} className="space-y-1">
              {/* Categoria Principal em Negrito e Caixa Alta */}
              <Link
                href={`/artigos?cat=${cat.slug}`}
                onClick={() => setMobileDrawerOpen(false)}
                className={`block font-bold text-xs uppercase tracking-tight transition hover:text-[#12589e] ${
                  isCatActive
                    ? "text-[#12589e] bg-blue-100/60 px-1.5 py-0.5 rounded font-extrabold"
                    : "text-black"
                }`}
              >
                {cat.name}
              </Link>

              {/* Subcategorias Indentadas */}
              {cat.subcategories && cat.subcategories.length > 0 && (
                <ul className="pl-3 space-y-1 border-l-2 border-gray-300 ml-1">
                  {cat.subcategories.map((sub) => {
                    const isSubActive = activeCategorySlug === sub.slug;
                    return (
                      <li key={sub.slug}>
                        <Link
                          href={`/artigos?cat=${sub.slug}`}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={`block py-0.5 text-[11.5px] transition ${
                            isSubActive
                              ? "text-[#12589e] font-extrabold underline bg-blue-50/70 px-1 rounded"
                              : "text-gray-800 hover:text-[#12589e] hover:font-bold hover:translate-x-0.5"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* 2.1 VISUALIZAÇÃO NO PC: MENU PRINCIPAL ATIVO NA LATERAL ESQUERDA */}
      <aside className="hidden lg:block w-56 shrink-0 print:hidden sticky top-4 self-start">
        {renderMenuList()}
      </aside>

      {/* 2.2 VISUALIZAÇÃO NO SMARTPHONE: BOTÃO FLUTUANTE (FAB) E DRAWER LATERAL */}
      <div className="lg:hidden print:hidden">
        {/* Botão Flutuante Fixo no Canto Inferior Esquerdo */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="fixed bottom-5 left-4 z-40 bg-[#12589e] hover:bg-[#0e4882] text-white px-3.5 py-2.5 rounded-full shadow-xl flex items-center gap-2 border-2 border-white cursor-pointer transition transform active:scale-95"
          title="Abrir Menu de Estudos e Artigos"
        >
          <Menu size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Menu Principal</span>
        </button>

        {/* Drawer / Gaveta Lateral Mobile */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop escurecido */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Painel do Menu Deslizante */}
            <div className="relative w-72 max-w-[85vw] bg-[#eeeeee] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
              <div className="bg-[#12589e] text-white p-3 flex items-center justify-between border-b border-[#0f4b85]">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  <BookOpen size={16} />
                  <span>Estudos Bíblicos</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 hover:bg-blue-800 rounded text-white cursor-pointer"
                  title="Fechar Menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {renderMenuList()}
              </div>

              <div className="p-3 bg-gray-200 border-t border-gray-300 text-center text-[11px] text-gray-600">
                Pérolas Preciosas &bull; Semeando a Palavra
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
