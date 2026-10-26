"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdmCapaPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [verse, setVerse] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/adm/cover")
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || "BEM VINDO !");
        setSubtitle(data.subtitle || "");
        setContent(data.content || "");
        setVerse(data.verse || "");
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/adm/cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, content, verse }),
      });

      if (res.ok) {
        setMessage("Mensagem da Capa gravada com sucesso!");
      } else {
        setMessage("Erro ao gravar mensagem da capa.");
      }
    } catch {
      setMessage("Erro ao conectar com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#12589e] text-white px-4 py-2 font-bold text-sm tracking-wide shadow-sm">
        &gt;&gt; MENSAGEM DA CAPA
      </div>

      <div className="max-w-3xl mx-auto bg-white border border-gray-300 p-6 shadow-sm">
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
              Título Principal da Capa:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#7f9db9] p-2 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              Subtítulo / Chamada Inicial:
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full border border-[#7f9db9] p-2 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              Versículo Sagrado do Friso Azul:
            </label>
            <input
              type="text"
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              className="w-full border border-[#7f9db9] p-2 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              Texto de Boas-Vindas da Capa:
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full border border-[#7f9db9] p-3 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e] leading-relaxed"
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
