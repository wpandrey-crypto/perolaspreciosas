"use client";

import { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Printer,
  Download,
  Copy,
  Check,
  Share2,
  Type,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface ArticleReaderProps {
  title: string;
  categoryName?: string;
  categorySlug?: string;
  author?: string;
  createdAt: string;
  summary?: string | null;
  contentHtml: string;
  slug: string;
}

export default function ArticleReader({
  title,
  categoryName,
  categorySlug,
  author,
  createdAt,
  summary,
  contentHtml,
  slug,
}: ArticleReaderProps) {
  // Tamanho de fonte: 0 (Normal: 16px), 1 (Médio: 18px), 2 (Grande: 20px), 3 (Extra: 24px)
  const fontSizes = [
    { label: "P", className: "text-base md:text-lg leading-relaxed" },
    { label: "M", className: "text-lg md:text-xl leading-relaxed" },
    { label: "G", className: "text-xl md:text-2xl leading-loose" },
    { label: "XG", className: "text-2xl md:text-3xl leading-loose" },
  ];
  const [fontSizeIndex, setFontSizeIndex] = useState(0);

  // Estados do Leitor de Voz (Text-to-Speech)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const [copied, setCopied] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setHasSpeechSupport(true);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Extrai texto puro do HTML para leitura do áudio e exportação TXT
  const getPlainText = () => {
    if (typeof document === "undefined") return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = contentHtml;
    const cleanContent = tempDiv.innerText || tempDiv.textContent || "";
    return `${title}\n\n${summary ? summary + "\n\n" : ""}${cleanContent}`;
  };

  // Controles de Áudio (TTS)
  const handleStartAudio = () => {
    if (!hasSpeechSupport) {
      alert("Seu navegador não suporta leitura de áudio em voz alta.");
      return;
    }

    if (isAudioPaused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
      setIsPlayingAudio(true);
      return;
    }

    window.speechSynthesis.cancel();

    const plainText = getPlainText();
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = "pt-BR";
    utterance.rate = 0.95; // Leitura natural e pausada

    // Tenta encontrar uma voz em português do Brasil
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(
      (v) => v.lang === "pt-BR" || v.lang.startsWith("pt")
    );
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    setIsAudioPaused(false);
  };

  const handlePauseAudio = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
      setIsPlayingAudio(false);
    }
  };

  const handleStopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
  };

  // Impressão nativa
  const handlePrint = () => {
    window.print();
  };

  // Exportação para TXT
  const handleDownloadTxt = () => {
    const textData = getPlainText();
    const fullText = `========================================================\nPÉROLAS PRECIOSAS - ESTUDO BÍBLICO\n========================================================\nTÍTULO: ${title}\nCATEGORIA: ${categoryName || "Geral"}\nAUTOR: ${author || "Leda Latterza"}\nDATA: ${createdAt}\n\n${summary ? "RESUMO:\n" + summary + "\n\n" : ""}CONTEÚDO:\n--------------------------------------------------------\n${textData}\n\n--------------------------------------------------------\nFonte: Ministério Pérolas Preciosas\nhttps://perolaspreciosas.com.br`;

    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug || "artigo-perolas"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copiar Texto
  const handleCopyText = async () => {
    const textData = getPlainText();
    try {
      await navigator.clipboard.writeText(
        `${title}\n\n${summary ? summary + "\n\n" : ""}${textData}\n\nFonte: Pérolas Preciosas`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Não foi possível copiar o texto automaticamente.");
    }
  };

  // Compartilhar WhatsApp
  const shareText = encodeURIComponent(
    `✨ *Pérolas Preciosas*\n\n*${title}*\n\nLeia este estudo completo em: https://perolaspreciosas.com.br/artigos/${categorySlug || "geral"}/${slug}`
  );

  return (
    <article className="bg-white border border-gray-300 shadow-sm print:border-none print:shadow-none">
      {/* Barra de Ferramentas Interativa (Oculta na Impressão) */}
      <div className="bg-[#f0f4f8] border-b border-gray-300 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
        {/* Controle de Fonte */}
        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded px-2 py-1 shadow-2xs">
          <Type size={14} className="text-gray-500 mr-1" />
          <span className="text-[11px] font-bold text-gray-600 mr-1">Fonte:</span>
          <button
            onClick={() => setFontSizeIndex((prev) => Math.max(0, prev - 1))}
            disabled={fontSizeIndex === 0}
            className="p-1 hover:bg-gray-100 disabled:opacity-30 rounded text-gray-700 cursor-pointer"
            title="Diminuir tamanho do texto"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs font-bold text-[#12589e] px-1 select-none">
            {fontSizes[fontSizeIndex].label}
          </span>
          <button
            onClick={() =>
              setFontSizeIndex((prev) => Math.min(fontSizes.length - 1, prev + 1))
            }
            disabled={fontSizeIndex === fontSizes.length - 1}
            className="p-1 hover:bg-gray-100 disabled:opacity-30 rounded text-gray-700 cursor-pointer"
            title="Aumentar tamanho do texto"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        {/* Leitor de Áudio TTS */}
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-2.5 py-1 shadow-2xs">
          <Volume2 size={15} className={isPlayingAudio ? "text-green-600 animate-pulse" : "text-gray-500"} />
          <span className="text-[11px] font-bold text-gray-700">Áudio:</span>

          {!isPlayingAudio && !isAudioPaused ? (
            <button
              onClick={handleStartAudio}
              className="inline-flex items-center gap-1 bg-[#12589e] hover:bg-[#0e447b] text-white text-xs font-bold px-2 py-0.5 rounded cursor-pointer transition"
              title="Escutar este artigo em voz alta"
            >
              <Play size={12} />
              <span>Ouvir</span>
            </button>
          ) : isPlayingAudio ? (
            <button
              onClick={handlePauseAudio}
              className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-2 py-0.5 rounded cursor-pointer transition"
              title="Pausar leitura"
            >
              <Pause size={12} />
              <span>Pausar</span>
            </button>
          ) : (
            <button
              onClick={handleStartAudio}
              className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded cursor-pointer transition"
              title="Continuar leitura"
            >
              <Play size={12} />
              <span>Continuar</span>
            </button>
          )}

          {(isPlayingAudio || isAudioPaused) && (
            <button
              onClick={handleStopAudio}
              className="p-1 hover:bg-red-50 text-red-600 rounded cursor-pointer transition"
              title="Parar áudio"
            >
              <VolumeX size={14} />
            </button>
          )}
        </div>

        {/* Ações de Impressão e Exportação */}
        <div className="flex items-center gap-2">
          {/* Imprimir */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold px-2.5 py-1 rounded text-xs shadow-2xs cursor-pointer transition"
            title="Imprimir artigo"
          >
            <Printer size={13} />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          {/* Exportar TXT */}
          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold px-2.5 py-1 rounded text-xs shadow-2xs cursor-pointer transition"
            title="Baixar em formato de texto (.txt)"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          {/* Copiar Texto */}
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold px-2.5 py-1 rounded text-xs shadow-2xs cursor-pointer transition"
            title="Copiar texto completo"
          >
            {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
            <span className="hidden sm:inline">{copied ? "Copiado!" : "Copiar"}</span>
          </button>

          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-[#25d366] hover:bg-[#20ba59] text-white font-bold px-3 py-1 rounded text-xs shadow-2xs cursor-pointer transition ml-1"
            title="Compartilhar no WhatsApp"
          >
            <Share2 size={13} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Conteúdo Principal do Artigo */}
      <div className="p-6 md:p-12">
        {/* Cabeçalho do Artigo */}
        <header className="border-b border-gray-200 pb-6 mb-6">
          <span className="text-xs font-bold text-[#12589e] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded">
            {categoryName || "Estudo Bíblico"}
          </span>

          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#102a43] mt-3 leading-tight">
            {title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span>Por: <strong className="text-gray-700">{author || "Leda Latterza"}</strong></span>
            <span>&bull;</span>
            <span>Publicado em: <strong>{createdAt}</strong></span>
          </div>
        </header>

        {/* Resumo / Subtítulo Padronizado */}
        {summary && (
          <div className="bg-blue-50/70 border-l-4 border-[#12589e] p-4 text-sm md:text-base font-serif italic text-gray-800 mb-8 leading-relaxed shadow-2xs rounded-r">
            {summary}
          </div>
        )}

        {/* Corpo do Artigo com Tipografia Semântica Editorial */}
        <div
          className={`article-body text-slate-800 ${fontSizes[fontSizeIndex].className}`}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>

      {/* Estilos CSS Específicos para a Tipografia Semântica do Artigo e Impressão */}
      <style jsx global>{`
        .article-body h2,
        .article-body h3 {
          font-family: Georgia, Cambria, "Times New Roman", Times, serif;
          font-weight: 700;
          color: #102a43;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.35rem;
        }
        .article-body h3 {
          font-size: 1.25em;
        }
        .article-body p {
          margin-bottom: 1.15rem;
          line-height: 1.75;
          color: #334e68;
        }
        .article-body blockquote {
          border-left: 4px solid #12589e;
          background-color: #f0f7ff;
          padding: 0.85rem 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #1e293b;
          border-radius: 0 0.375rem 0.375rem 0;
        }
        .article-body strong {
          font-weight: 700;
          color: #0f172a;
        }
        .article-body em {
          font-style: italic;
          color: #334e68;
        }
        .article-body ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 1.25rem 0;
          space-y: 0.5rem;
        }
        .article-body ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 1.25rem 0;
          space-y: 0.5rem;
        }
        .article-body li {
          margin-bottom: 0.4rem;
          line-height: 1.65;
          color: #334e68;
        }

        /* Estilos de Impressão */
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            font-size: 12pt !important;
          }
          header, footer, nav, .print\\:hidden {
            display: none !important;
          }
          .article-body {
            font-size: 11pt !important;
            line-height: 1.5 !important;
          }
          .article-body blockquote {
            border-left: 2pt solid #000 !important;
            background-color: #f9f9f9 !important;
          }
        }
      `}</style>
    </article>
  );
}
