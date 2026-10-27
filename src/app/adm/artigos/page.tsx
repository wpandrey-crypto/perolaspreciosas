"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";
import { Search, Plus, Edit2, Trash2, ArrowLeft, Layers, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  categoryId: number;
  category?: { id: number; name: string; slug: string; parentSlug?: string | null };
  summary?: string;
  author?: string;
  isFeatured: boolean;
  createdAt: string;
}

interface StructuredCategory {
  id: number;
  name: string;
  slug: string;
  subcategories: { id: number; name: string; slug: string }[];
}

export default function AdmArtigosPage() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [structuredCats, setStructuredCats] = useState<StructuredCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Filtros
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  // Estado de Criação / Edição
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Carrega categorias uma única vez
  const loadCategories = async () => {
    try {
      const res = await fetch("/api/adm/categorias");
      const data = await res.json();
      if (data.structured) {
        setStructuredCats(data.structured);
      }
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };

  // Carrega lista paginada do servidor
  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("pageSize", pageSize.toString());
      if (search) params.set("search", search);
      if (catFilter) params.set("cat", catFilter);

      const res = await fetch(`/api/adm/artigos?${params.toString()}`);
      const data = await res.json();

      if (data.items) {
        setArticles(data.items);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Erro ao carregar artigos:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, catFilter]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleEdit = async (art: ArticleListItem) => {
    try {
      setLoadingEdit(true);
      setEditingId(art.id);
      setIsCreating(false);
      setTitle(art.title);
      setCategoryId(art.categoryId);
      setSummary(art.summary || "");
      setIsFeatured(art.isFeatured);
      setMessage("");

      // Busca o conteúdo completo do artigo por ID
      const res = await fetch(`/api/adm/artigos?id=${art.id}`);
      const fullArt = await res.json();
      setContent(fullArt.content || "<p></p>");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setMessage("Erro ao carregar conteúdo do artigo.");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleNew = () => {
    setEditingId(null);
    setIsCreating(true);
    setTitle("");
    setCategoryId(structuredCats[0]?.id || 1);
    setSummary("");
    setContent("<p></p>");
    setIsFeatured(false);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setEditingId(null);
    setIsCreating(false);
    setMessage("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/adm/artigos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title,
          categoryId,
          summary,
          content,
          isFeatured,
        }),
      });

      if (res.ok) {
        setMessage("Artigo gravado com sucesso!");
        await loadArticles();
        setTimeout(() => {
          handleBack();
        }, 1200);
      } else {
        setMessage("Erro ao salvar artigo.");
      }
    } catch {
      setMessage("Erro de conexão ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, artTitle: string) => {
    if (confirm(`Tem certeza que deseja excluir o artigo "${artTitle}"?`)) {
      try {
        await fetch(`/api/adm/artigos?id=${id}`, { method: "DELETE" });
        await loadArticles();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Topo Azul com Botões */}
      <div className="bg-[#12589e] text-white px-4 py-2.5 font-bold text-sm tracking-wide shadow-xs flex flex-wrap items-center justify-between gap-3">
        <span>&gt;&gt; ARTIGOS E ESTUDOS BÍBLICOS</span>
        <div className="flex items-center gap-2">
          {!isCreating && !editingId && (
            <>
              <Link
                href="/adm/categorias"
                className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 text-xs font-semibold rounded shadow-xs inline-flex items-center gap-1 transition"
              >
                <Layers size={14} />
                <span>Gerenciar Categorias</span>
              </Link>
              <button
                onClick={handleNew}
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-3.5 py-1 text-xs font-bold rounded shadow-xs inline-flex items-center gap-1 cursor-pointer transition"
              >
                <Plus size={14} />
                <span>Novo Artigo</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!isCreating && !editingId ? (
        /* LISTAGEM DOS ARTIGOS PAGINADA E VELOZ */
        <div className="bg-white border-2 border-gray-300 p-4 md:p-6 shadow-2xs space-y-4">
          {/* Barra de Filtro e Busca */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-gray-200 pb-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Input de Busca */}
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  placeholder="Buscar pelo título ou palavra..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="border border-[#7f9db9] pl-8 pr-3 py-1.5 text-xs w-full bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>

              {/* Filtro por Categoria */}
              <select
                value={catFilter}
                onChange={(e) => {
                  setCatFilter(e.target.value);
                  setPage(1);
                }}
                className="border border-[#7f9db9] px-2.5 py-1.5 text-xs bg-[#f9fbfd] focus:bg-white focus:outline-none"
              >
                <option value="">Todas as Categorias</option>
                {structuredCats.map((root) => (
                  <optgroup key={root.id} label={`-- ${root.name} --`}>
                    <option value={root.id}>{root.name} (Geral)</option>
                    {root.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        &nbsp;&nbsp;{sub.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="text-xs text-gray-600 flex items-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin text-[#12589e]" />}
              <span>
                Mostrando <strong>{articles.length}</strong> de <strong>{total}</strong> artigos
                {totalPages > 1 && ` (Pág. ${page} de ${totalPages})`}
              </span>
            </div>
          </div>

          {/* Tabela de Artigos */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f0f4f8] text-[#12589e] border-b-2 border-gray-300 uppercase tracking-wider font-bold">
                  <th className="p-2.5 border">Título do Estudo</th>
                  <th className="p-2.5 border">Categoria / Subcategoria</th>
                  <th className="p-2.5 border text-center w-24">Data</th>
                  <th className="p-2.5 border text-center w-28">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-500">
                      <Loader2 size={24} className="animate-spin mx-auto text-[#12589e] mb-2" />
                      <span>Carregando artigos...</span>
                    </td>
                  </tr>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      Nenhum artigo encontrado com os filtros atuais.
                    </td>
                  </tr>
                ) : (
                  articles.map((art) => (
                    <tr key={art.id} className="border-b hover:bg-blue-50/50 transition">
                      <td className="p-2.5 border font-semibold text-gray-900">
                        <span className="block">{art.title}</span>
                        {art.summary && (
                          <span className="block text-[11px] text-gray-500 line-clamp-1 font-normal mt-0.5">
                            {art.summary}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 border text-gray-700 whitespace-nowrap">
                        <span className="bg-blue-50 border border-blue-200 text-[#12589e] px-2 py-0.5 rounded text-[11px] font-bold">
                          {art.category?.name || "Estudo"}
                        </span>
                      </td>
                      <td className="p-2.5 border text-center text-gray-500 whitespace-nowrap">
                        {new Date(art.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-2.5 border text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(art)}
                            className="text-[#12589e] hover:text-blue-900 p-1 rounded hover:bg-blue-100 cursor-pointer font-bold inline-flex items-center gap-0.5"
                            title="Editar este artigo"
                          >
                            <Edit2 size={13} />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDelete(art.id, art.title)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 cursor-pointer font-bold inline-flex items-center gap-0.5"
                            title="Excluir este artigo"
                          >
                            <Trash2 size={13} />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Página <strong>{page}</strong> de <strong>{totalPages}</strong> (Total: {total} artigos)
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 text-xs font-semibold rounded text-gray-700 cursor-pointer inline-flex items-center gap-1 transition"
                >
                  <ChevronLeft size={14} /> Anterior
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className="px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 text-xs font-semibold rounded text-gray-700 cursor-pointer inline-flex items-center gap-1 transition"
                >
                  Próxima <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* FORMULÁRIO DE EDIÇÃO / NOVO ARTIGO COM EDITOR ESTILO WORD */
        <div className="max-w-4xl mx-auto border-2 border-[#12589e] bg-white p-6 md:p-8 shadow-md rounded-none">
          <div className="border-b border-gray-300 pb-3 mb-6 flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold text-[#12589e]">
              {editingId ? "Editar Artigo" : "Novo Artigo"}
            </h2>
            <button
              type="button"
              onClick={handleBack}
              className="text-xs text-gray-600 hover:text-black underline cursor-pointer inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Voltar para lista
            </button>
          </div>

          {message && (
            <div
              className={`p-3 mb-6 text-xs font-bold rounded text-center ${
                message.includes("sucesso")
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {loadingEdit ? (
            <div className="py-12 text-center text-gray-500">
              <Loader2 size={28} className="animate-spin mx-auto text-[#12589e] mb-2" />
              <span>Carregando dados do artigo...</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* Título do Artigo */}
              <div>
                <label className="block font-bold text-gray-800 mb-1 text-sm">
                  Título do Artigo:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: O Poder da Oração Diária"
                  className="w-full border border-[#7f9db9] p-2.5 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e] text-sm"
                  required
                />
              </div>

              {/* Categoria e Destaque */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-800 mb-1">
                    Categoria / Subcategoria:
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
                    className="w-full border border-[#7f9db9] p-2 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e] text-xs font-medium"
                  >
                    {structuredCats.map((root) => (
                      <optgroup key={root.id} label={`-- ${root.name} --`}>
                        <option value={root.id}>{root.name} (Principal)</option>
                        {root.subcategories.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            &nbsp;&nbsp;{sub.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-4 md:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 select-none">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-[#12589e]"
                    />
                    <span>Destacar na página inicial</span>
                  </label>
                </div>
              </div>

              {/* Resumo */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Breve Resumo (opcional):
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  placeholder="Uma síntese destacada ou introdução..."
                  className="w-full border border-[#7f9db9] p-2.5 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                />
              </div>

              {/* Conteúdo com RichTextEditor */}
              <div>
                <label className="block font-bold text-gray-800 mb-1 text-sm">
                  Conteúdo do Artigo:
                </label>
                <RichTextEditor
                  value={content}
                  onChange={(newHtml) => setContent(newHtml)}
                  placeholder="Escreva ou formate seu estudo aqui com negrito, itálico, subtítulos, citações e listas..."
                />
              </div>

              {/* Botões */}
              <div className="pt-4 border-t border-gray-300 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded cursor-pointer transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#12589e] hover:bg-[#0e4882] text-white font-bold rounded shadow-sm cursor-pointer transition disabled:opacity-50 text-sm"
                >
                  {saving ? "Gravando Artigo..." : "Gravar Artigo"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
