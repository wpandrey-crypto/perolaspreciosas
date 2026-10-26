"use client";

import { useState } from "react";
import Link from "next/link";
import { Share2, BookOpen, ZoomIn, ZoomOut, Heart } from "lucide-react";

interface DevotionalProps {
  day: number;
  month: number;
  title: string;
  verse: string;
  content: string;
  author?: string;
}

const MONTH_NAMES = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function DailyDevotionalCard({
  day,
  month,
  title,
  verse,
  content,
  author = "Leda Latterza",
}: DevotionalProps) {
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");

  const fontClasses = {
    normal: "text-sm md:text-base leading-relaxed",
    large: "text-base md:text-lg leading-relaxed",
    xlarge: "text-lg md:text-xl leading-relaxed",
  };

  const shareText = encodeURIComponent(
    `✨ *Pérolas Preciosas - Devocional de Hoje (${day}/${month})*\n\n*${title}*\n\n"${verse}"\n\nLeia a mensagem completa em: https://perolaspreciosas.com.br/cada-dia/${month}/${day}`
  );

  return (
    <div className="bg-gradient-to-b from-[#fafdff] to-[#f0f6fc] border-2 border-[#12589e] p-5 md:p-7 shadow-md rounded-none relative">
      {/* Faixa Superior */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#12589e] pb-3 mb-4">
        <div>
          <span className="bg-[#12589e] text-white text-xs font-bold px-2.5 py-1 tracking-wider uppercase">
            Cada Dia com o Senhor
          </span>
          <span className="text-xs font-semibold text-red-600 ml-2">
            {day} de {MONTH_NAMES[month]}
          </span>
        </div>

        {/* Controles de Acessibilidade (Aumentar Letra) */}
        <div className="flex items-center gap-1 text-xs text-gray-700 bg-white px-2 py-1 border border-gray-300 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 mr-1">Tamanho da Letra:</span>
          <button
            onClick={() => setFontSize("normal")}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${fontSize === "normal" ? "bg-[#12589e] text-white font-bold" : "hover:bg-gray-100"}`}
            title="Tamanho Normal"
          >
            A
          </button>
          <button
            onClick={() => setFontSize("large")}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${fontSize === "large" ? "bg-[#12589e] text-white font-bold" : "hover:bg-gray-100"}`}
            title="Letra Grande"
          >
            A+
          </button>
          <button
            onClick={() => setFontSize("xlarge")}
            className={`px-1.5 py-0.5 rounded cursor-pointer ${fontSize === "xlarge" ? "bg-[#12589e] text-white font-bold" : "hover:bg-gray-100"}`}
            title="Letra Muito Grande"
          >
            A++
          </button>
        </div>
      </div>

      {/* Título do Devocional */}
      <h2 className="text-xl md:text-2xl font-serif font-bold text-[#102a43] mb-3">
        {title}
      </h2>

      {/* Versículo de Apoio */}
      {verse && (
        <div className="bg-white border-l-4 border-amber-500 p-3.5 mb-4 shadow-sm text-gray-800 italic font-serif text-sm md:text-base">
          &ldquo;{verse}&rdquo;
        </div>
      )}

      {/* Conteúdo da Mensagem */}
      <div className={`text-gray-800 space-y-3 font-sans ${fontClasses[fontSize]}`}>
        {content.split("\n").map((par, idx) => (
          <p key={idx}>{par}</p>
        ))}
      </div>

      {/* Autor & Rodapé do Card */}
      <div className="mt-6 pt-4 border-t border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
        <span className="italic">
          Por: <strong className="text-gray-900 not-italic">{author}</strong>
        </span>

        {/* Botão de Compartilhar no WhatsApp */}
        <div className="flex items-center gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#25d366] hover:bg-[#20ba59] text-white font-bold px-4 py-2 rounded shadow transition text-xs cursor-pointer"
          >
            <Share2 size={15} />
            <span>Compartilhar no WhatsApp</span>
          </a>

          <Link
            href={`/cada-dia/${month}/${day}`}
            className="text-[#12589e] hover:underline font-bold"
          >
            Página dedicada &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
