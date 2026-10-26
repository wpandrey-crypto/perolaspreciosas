"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  categoryId: number;
  category?: { name: string; slug: string };
  summary?: string;
  content: string;
  author?: string;
  isFeatured: boolean;
  createdAt: string;
}

const CATEGORIES = [
  { id: 1, name: "Iniciantes" },
  { id: 2, name: "Avançado" },
  { id: 3, name: "Homilética" },
  { id: 4, name: "Hermenêutica" },
  { id: 5, name: "Religiões" },
  { id: 6, name: "Seitas" },
  { id: 7, name: "Doutrinas" },
  { id: 8, name: "História da Igreja" },
  { id: 9, name: "Vida Cristã" },
  { id: 10, name: "Bíblia" },
  { id: 11, name: "Eles / Elas" },
  { id: 12, name: "EBD / EBF" },
  { id: 13, name: "Missões" },
  { id: 14, name: "Diversos" },
];

export default function AdmArtigosPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadArticles = async () => {
    try {
      const res = await fetch("/api/adm/artigos");
      const data = await res.json();
      if (Array.isArray(data)) {
        setArticles(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleEdit = (art: ArticleItem) => {
    setEditingId(art.id);
    setIsCreating(false);
    setTitle(art.title);
    setCategoryId(art.categoryId);
    setSummary(art.summary || "");
    setContent(art.content);
    setIsFeatured(art.isFeatured);
    setMessage("");
  };

  const handleNew = () => {
    setEditingId(null);
    setIsCreating(true);
    setTitle("");
    setCategoryId(1);
    setSummary("");
    setContent("");
    setIsFeatured(false);
    setMessage("");
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
      setMessage("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
      try {
        await fetch(`/api/adm/artigos?id=${id}`, { method: "DELETE" });
        loadArticles();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-[#12589e] text-white px-4 py-2 font-bold text-sm tracking-wide shadow-sm flex items-center justify-between">
        <span>&gt;&gt; ARTIGOS E ESTUDOS BÍBLICOS</span>
        {!isCreating && !editingId && (
          <button
            onClick={handleNew}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 text-xs font-bold rounded shadow cursor-pointer"
          >
            + Novo Artigo
          </button>
        )}
      </div>

      {!isCreating && !editingId ? (
        <div className="bg-white border border-gray-300 p-4 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <input
              type="text"
              placeholder="Buscar artigo pelo título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-[#7f9db9] px-3 py-1.5 text-sm w-full max-w-sm bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
            />
            <span className="text-xs text-gray-600">
              Total: <strong>{filtered.length}</strong> artigos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#f0f4f8] text-[#12589e] border-b border-gray-300 text-xs uppercase">
                  <th className="p-2 border">Título</th>
                  <th className="p-2 border">Categoria</th>
                  <th className="p-2 border">Data</th>
                  <th className="p-2 border text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((art) => (
                  <tr key={art.id} className="border-b hover:bg-yellow-50 text-xs">
                    <td className="p-2 border font-medium text-gray-900">
                      {art.title}
                    </td>
                    <td className="p-2 border text-gray-600">
                      {art.category?.name || "Geral"}
                    </td>
                    <td className="p-2 border text-gray-500 whitespace-nowrap">
                      {new Date(art.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-2 border text-center whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(art)}
                        className="text-[#12589e] hover:underline font-bold cursor-pointer"
                      >
                        [Editar]
                      </button>
                      <button
                        onClick={() => handleDelete(art.id)}
                        className="text-red-600 hover:underline font-bold cursor-pointer"
                      >
                        [Excluir]
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500 text-sm">
                      Nenhum artigo encontrado. Clique no botão <strong>+ Novo Artigo</strong> acima para cadastrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto border-2 border-[#12589e] bg-white p-6 shadow-md rounded-none">
          <div className="border-b border-gray-300 pb-3 mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#12589e]">
              {editingId ? "Editar Artigo" : "Novo Artigo"}
            </h2>
            <button
              type="button"
              onClick={handleBack}
              className="text-xs text-gray-600 hover:text-black underline cursor-pointer"
            >
              Voltar para lista
            </button>
          </div>

          {message && (
            <div
              className={`p-3 mb-4 text-sm font-semibold rounded text-center ${
                message.includes("sucesso")
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-sm">
            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Título do Artigo:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-[#7f9db9] p-2 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Categoria:
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  className="w-full border border-[#7f9db9] p-2 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#12589e]"
                  />
                  Destacar na página inicial
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Breve Resumo (opcional):
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className="w-full border border-[#7f9db9] p-2 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Conteúdo do Artigo:
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full border border-[#7f9db9] p-3 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e] leading-relaxed"
                placeholder="Escreva ou cole o artigo completo aqui..."
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#12589e] hover:bg-[#0e447b] text-white font-bold px-8 py-2 rounded-none border border-[#0d3f73] shadow cursor-pointer transition active:scale-95 disabled:opacity-50 text-sm"
              >
                {saving ? "Gravando..." : "Gravar"}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="bg-[#12589e] hover:bg-[#0e447b] text-white font-bold px-6 py-2 rounded-none border border-[#0d3f73] shadow cursor-pointer transition active:scale-95 text-sm"
              >
                Voltar Para Página Inicial
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
