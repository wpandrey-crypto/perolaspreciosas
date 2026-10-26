"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SECTIONS_LIST = [
  { key: "diversos-folhetos", label: "DIVERSOS - Folhetos" },
  { key: "diversos-ocasioes", label: "DIVERSOS - Ocasiões" },
  { key: "quem-escreve", label: "QUEM ESCREVE" },
  { key: "iceb", label: "ICEB - Informações da Igreja" },
  { key: "contato", label: "CONTATO - Informações e Orientações" },
  { key: "iniciantes-estudos", label: "INICIANTES - Texto Introdutório" },
  { key: "avancado-estudos", label: "AVANÇADO - Texto Introdutório" },
];

export default function AdmTextosPage() {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState(SECTIONS_LIST[0].key);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadSection = async (key: string) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/adm/textos?key=${key}`);
      const data = await res.json();
      setTitle(data.title || SECTIONS_LIST.find((s) => s.key === key)?.label || "");
      setContent(data.content || "");
    } catch {
      setMessage("Erro ao carregar texto da seção.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSection(selectedKey);
  }, [selectedKey]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/adm/textos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: selectedKey,
          title,
          content,
          groupName: "DIVERSOS",
        }),
      });

      if (res.ok) {
        setMessage("Texto gravado com sucesso!");
      } else {
        setMessage("Erro ao gravar texto.");
      }
    } catch {
      setMessage("Erro ao conectar com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de título idêntica à Imagem 5 */}
      <div className="bg-[#12589e] text-white px-4 py-2 font-bold text-sm tracking-wide shadow-sm">
        &gt;&gt; TEXTOS DO SITE
      </div>

      <div className="max-w-4xl mx-auto bg-white border border-gray-300 p-6 shadow-sm">
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

        <form onSubmit={handleSave} className="space-y-6">
          {/* Seletor de Seção idêntico à imagem 5 */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="font-bold text-gray-800 text-base">
              Seção:
            </label>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="border-2 border-[#12589e] bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#12589e] cursor-pointer"
            >
              {SECTIONS_LIST.map((sec) => (
                <option key={sec.key} value={sec.key}>
                  {sec.label}
                </option>
              ))}
            </select>
            {loading && <span className="text-xs text-gray-500">Carregando...</span>}
          </div>

          <div>
            <label className="block font-bold text-gray-800 text-sm mb-1">
              Título da Página / Seção:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#7f9db9] p-2 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e] text-sm"
              required
            />
          </div>

          {/* Área de Texto Grande com Borda Clássica */}
          <div>
            <label className="block font-bold text-gray-800 text-sm mb-1">
              Texto:
            </label>
            <div className="border border-gray-400 p-1 bg-gray-50 rounded-none">
              <div className="flex items-center gap-1 bg-gray-200 border-b border-gray-300 p-1.5 text-xs text-gray-700">
                <span className="font-bold px-2 py-0.5 bg-white border border-gray-300 cursor-pointer hover:bg-gray-100" onClick={() => setContent(content + " <b>texto</b> ")}>
                  B (Negrito)
                </span>
                <span className="italic px-2 py-0.5 bg-white border border-gray-300 cursor-pointer hover:bg-gray-100" onClick={() => setContent(content + " <i>texto</i> ")}>
                  I (Itálico)
                </span>
                <span className="px-2 py-0.5 bg-white border border-gray-300 cursor-pointer hover:bg-gray-100" onClick={() => setContent(content + "\n<br/>\n")}>
                  Quebra de Linha
                </span>
                <span className="text-gray-500 text-[11px] ml-auto">Editor de Texto Seguro</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={14}
                className="w-full p-4 bg-white text-gray-900 font-sans text-sm focus:outline-none resize-y leading-relaxed"
                placeholder="Escreva ou cole o texto da seção aqui..."
                required
              />
            </div>
          </div>

          {/* Botões clássicos idênticos aos da imagem 5 */}
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
              onClick={() => router.push("/adm/biblia-ano")}
              className="bg-[#12589e] hover:bg-[#0e447b] text-white font-bold px-6 py-2 rounded-none border border-[#0d3f73] shadow cursor-pointer transition active:scale-95 text-sm"
            >
              Voltar Para Página Inicial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
