"use client";

import { useEffect, useState } from "react";
import MonthMatrix from "@/components/adm/MonthMatrix";

const MONTH_NAMES = [
  "",
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function AdmCadaDiaPage() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [filledDays, setFilledDays] = useState<{ month: number; day: number }[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [verse, setVerse] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/adm/devocionais")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFilledDays(data.map((d) => ({ month: d.month, day: d.day })));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSelectDay = async (month: number, day: number) => {
    setSelectedMonth(month);
    setSelectedDay(day);
    setMessage("");

    try {
      const res = await fetch(`/api/adm/devocionais?month=${month}&day=${day}`);
      const data = await res.json();
      setTitle(data.title || "");
      setVerse(data.verse || "");
      setContent(data.content || "");
    } catch {
      setTitle("");
      setVerse("");
      setContent("");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMonth || !selectedDay) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/adm/devocionais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: selectedMonth,
          day: selectedDay,
          title,
          verse,
          content,
        }),
      });

      if (res.ok) {
        setMessage("Devocional gravado com sucesso!");
        if (!filledDays.some((f) => f.month === selectedMonth && f.day === selectedDay)) {
          setFilledDays([...filledDays, { month: selectedMonth, day: selectedDay }]);
        }
      } else {
        setMessage("Erro ao gravar devocional.");
      }
    } catch {
      setMessage("Erro ao conectar com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    setSelectedMonth(null);
    setSelectedDay(null);
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#12589e] text-white px-4 py-2 font-bold text-sm tracking-wide shadow-sm flex items-center justify-between">
        <span>&gt;&gt; CADA DIA - TODO DIA (Devocionais Diárias)</span>
        {selectedMonth && selectedDay && (
          <span className="text-yellow-300 text-xs">
            Editando: {selectedDay} de {MONTH_NAMES[selectedMonth]}
          </span>
        )}
      </div>

      {!selectedMonth ? (
        <div>
          <p className="text-center text-sm font-semibold text-gray-700 my-4">
            Clique no dia que deseja alterar a mensagem devocional:
          </p>
          <MonthMatrix
            onSelectDay={handleSelectDay}
            filledDays={filledDays}
          />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto border-2 border-[#12589e] bg-white p-6 shadow-md rounded-none">
          <div className="border-b border-gray-300 pb-3 mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#12589e]">
              Mensagem do Dia: {selectedDay} de {MONTH_NAMES[selectedMonth]}
            </h2>
            <button
              type="button"
              onClick={handleBack}
              className="text-xs text-gray-600 hover:text-black underline cursor-pointer"
            >
              Escolher outro dia
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
                Título do Devocional:
              </label>
              <input
                type="text"
                value={title}
                placeholder="Ex: Momentos Preciosos com Deus"
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-[#7f9db9] p-2 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Versículo Bíblico de Apoio:
              </label>
              <input
                type="text"
                value={verse}
                placeholder="Ex: Salmos 119:105 - Lâmpada para os meus pés é tua palavra..."
                onChange={(e) => setVerse(e.target.value)}
                className="w-full border border-[#7f9db9] p-2 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Texto Completo do Devocional:
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full border border-[#7f9db9] p-3 bg-[#f9fbfd] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e] font-sans leading-relaxed text-sm"
                placeholder="Digite a mensagem devocional para o dia..."
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
