"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Folder, FolderPlus, Edit2, Trash2, ArrowLeft, Layers, Plus } from "lucide-react";

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  parentSlug?: string | null;
  orderIndex: number;
  _count?: { articles: number };
}

interface StructuredCategory extends CategoryItem {
  subcategories: CategoryItem[];
}

export default function AdmCategoriasPage() {
  const [structured, setStructured] = useState<StructuredCategory[]>([]);
  const [roots, setRoots] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal / Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formParentSlug, setFormParentSlug] = useState("");
  const [formOrder, setFormOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/adm/categorias");
      const data = await res.json();
      if (data.structured) {
        setStructured(data.structured);
        setRoots(data.roots || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenNew = (defaultParentSlug = "") => {
    setEditingId(null);
    setFormName("");
    setFormSlug("");
    setFormParentSlug(defaultParentSlug);
    setFormOrder(0);
    setErrorMsg("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormParentSlug(cat.parentSlug || "");
    setFormOrder(cat.orderIndex || 0);
    setErrorMsg("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg("O nome da categoria é obrigatório.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/adm/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name: formName,
          slug: formSlug,
          parentSlug: formParentSlug || null,
          orderIndex: formOrder,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(editingId ? "Categoria atualizada com sucesso!" : "Categoria criada com sucesso!");
        setIsModalOpen(false);
        await loadCategories();
      } else {
        setErrorMsg(data.error || "Erro ao salvar.");
      }
    } catch {
      setErrorMsg("Erro de comunicação com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    const isSub = Boolean(cat.parentSlug);
    const tipo = isSub ? "subcategoria" : "categoria principal";

    if (
      !confirm(
        `Tem certeza que deseja excluir a ${tipo} "${cat.name}"?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/adm/categorias?id=${cat.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`${cat.name} excluída com sucesso!`);
        await loadCategories();
      } else {
        alert(data.error || "Não foi possível excluir a categoria.");
      }
    } catch {
      alert("Erro de comunicação ao excluir.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Título Superior */}
      <div className="bg-[#12589e] text-white px-4 py-2.5 font-bold text-sm tracking-wide shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers size={18} />
          <span>&gt;&gt; GERENCIAMENTO DE CATEGORIAS E SUBCATEGORIAS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenNew("")}
            className="bg-white hover:bg-blue-50 text-[#12589e] text-xs font-bold px-3 py-1 rounded shadow-xs inline-flex items-center gap-1 cursor-pointer transition"
          >
            <FolderPlus size={14} />
            <span>Nova Categoria Principal</span>
          </button>
          <Link
            href="/adm/artigos"
            className="bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded inline-flex items-center gap-1 transition"
          >
            <ArrowLeft size={14} /> Voltar para Artigos
          </Link>
        </div>
      </div>

      {successMsg && (
        <div className="bg-green-50 border-l-4 border-green-600 p-3 text-xs font-bold text-green-800 shadow-xs">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-600 p-3 text-xs font-bold text-red-800 shadow-xs">
          {errorMsg}
        </div>
      )}

      {/* Conteúdo Principal */}
      {loading ? (
        <div className="bg-white border border-gray-300 p-12 text-center text-gray-500 text-xs">
          Carregando categorias e estudos...
        </div>
      ) : (
        <div className="space-y-6">
          {structured.map((root) => {
            const totalArticlesInGroup =
              (root._count?.articles || 0) +
              root.subcategories.reduce(
                (sum, sub) => sum + (sub._count?.articles || 0),
                0
              );

            return (
              <div
                key={root.id}
                className="bg-white border-2 border-gray-300 shadow-2xs rounded-none overflow-hidden"
              >
                {/* Cabeçalho da Categoria Principal */}
                <div className="bg-[#f0f4f8] border-b border-gray-300 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Folder size={18} className="text-[#12589e]" />
                    <h2 className="font-bold text-base text-[#102a43] uppercase tracking-wide">
                      {root.name}
                    </h2>
                    <span className="text-xs bg-blue-100 text-[#12589e] font-semibold px-2 py-0.5 rounded-full">
                      {totalArticlesInGroup} artigo(s)
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono">
                      (slug: {root.slug})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenNew(root.slug)}
                      className="bg-[#12589e] hover:bg-[#0e4882] text-white text-xs font-bold px-2.5 py-1 rounded inline-flex items-center gap-1 cursor-pointer transition"
                      title={`Adicionar subcategoria em ${root.name}`}
                    >
                      <Plus size={13} />
                      <span>Nova Subcategoria</span>
                    </button>
                    <button
                      onClick={() => handleOpenEdit(root)}
                      className="p-1 hover:bg-gray-200 text-gray-600 rounded cursor-pointer transition"
                      title="Editar Categoria Principal"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(root)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded cursor-pointer transition"
                      title="Excluir Categoria Principal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Lista de Subcategorias daquela Categoria Principal */}
                <div className="p-4">
                  {root.subcategories.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2">
                      Nenhuma subcategoria cadastrada nesta categoria.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {root.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-gray-50 border border-gray-300 hover:border-[#12589e] p-2.5 flex items-center justify-between transition group shadow-2xs"
                        >
                          <div className="overflow-hidden pr-2">
                            <span className="block font-semibold text-xs text-slate-800 group-hover:text-[#12589e] truncate">
                              {sub.name}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              {sub._count?.articles || 0} artigo(s)
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEdit(sub)}
                              className="p-1 hover:bg-blue-100 text-[#12589e] rounded cursor-pointer transition"
                              title="Editar Subcategoria"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(sub)}
                              className="p-1 hover:bg-red-100 text-red-600 rounded cursor-pointer transition"
                              title="Excluir Subcategoria"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Adicionar / Editar Categoria ou Subcategoria */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#12589e] shadow-2xl max-w-md w-full p-6">
            <h3 className="font-bold text-lg text-[#102a43] mb-4 pb-2 border-b border-gray-200">
              {editingId ? "Editar Categoria / Subcategoria" : "Nova Categoria / Subcategoria"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nome da Categoria:
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Homens, Casais, Homilética..."
                  className="w-full border border-gray-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Categoria Pai (Deixe em branco se for Categoria Principal):
                </label>
                <select
                  value={formParentSlug}
                  onChange={(e) => setFormParentSlug(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                >
                  <option value="">-- É uma Categoria Principal (Raiz) --</option>
                  {roots.map((r) => (
                    <option key={r.id} value={r.slug}>
                      {r.name} ({r.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Slug (Opcional - gerado automaticamente):
                </label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="ex: homens, casais (sem espaços)"
                  className="w-full border border-gray-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ordem de Exibição:
                </label>
                <input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(parseInt(e.target.value, 10) || 0)}
                  className="w-full border border-gray-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded cursor-pointer transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-[#12589e] hover:bg-[#0e4882] text-white text-xs font-bold rounded shadow-xs cursor-pointer transition disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Gravar Categoria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
