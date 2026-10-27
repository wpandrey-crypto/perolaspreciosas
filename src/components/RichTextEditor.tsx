"use client";

import { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading3,
  Pilcrow,
  Undo,
  Redo,
  RemoveFormatting,
  Code,
  Eye,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo do artigo aqui...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [internalHtml, setInternalHtml] = useState(value || "");

  // Sincroniza o valor inicial ou externo
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
      setInternalHtml(value || "");
    }
  }, [value]);

  const exec = (command: string, arg: string | undefined = undefined) => {
    if (typeof document === "undefined") return;
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setInternalHtml(html);
      onChange(html);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setInternalHtml(html);
      onChange(html);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const html = e.target.value;
    setInternalHtml(html);
    onChange(html);
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
  };

  const handleFormatBlock = (tag: string) => {
    if (tag === "blockquote") {
      exec("formatBlock", "<blockquote>");
    } else if (tag === "h3") {
      exec("formatBlock", "<h3>");
    } else {
      exec("formatBlock", "<p>");
    }
  };

  return (
    <div className="border-2 border-gray-300 rounded-none bg-white shadow-2xs overflow-hidden focus-within:border-[#12589e] transition">
      {/* Barra de Ferramentas Estilo Word */}
      <div className="bg-[#f0f4f8] border-b border-gray-300 px-3 py-2 flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex flex-wrap items-center gap-1">
          {/* Estilo de Bloco (Parágrafo / Subtítulo / Citação) */}
          <div className="flex items-center bg-white border border-gray-300 rounded mr-1 shadow-2xs">
            <button
              type="button"
              onClick={() => handleFormatBlock("p")}
              className="p-1.5 hover:bg-gray-100 text-gray-700 rounded-l cursor-pointer text-xs font-semibold flex items-center gap-1 border-r border-gray-200"
              title="Texto Normal (Parágrafo)"
            >
              <Pilcrow size={14} />
              <span>Normal</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormatBlock("h3")}
              className="p-1.5 hover:bg-gray-100 text-[#102a43] cursor-pointer text-xs font-bold flex items-center gap-1 border-r border-gray-200"
              title="Subtítulo / Intertítulo"
            >
              <Heading3 size={15} />
              <span>Subtítulo</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormatBlock("blockquote")}
              className="p-1.5 hover:bg-gray-100 text-[#12589e] rounded-r cursor-pointer text-xs font-semibold flex items-center gap-1"
              title="Citação Bíblica / Destaque"
            >
              <Quote size={14} />
              <span>Citação</span>
            </button>
          </div>

          {/* Formatação Básica: Negrito, Itálico, Sublinhado */}
          <div className="flex items-center bg-white border border-gray-300 rounded mr-1 shadow-2xs">
            <button
              type="button"
              onClick={() => exec("bold")}
              className="p-1.5 hover:bg-gray-100 text-gray-800 cursor-pointer font-bold border-r border-gray-200"
              title="Negrito (Ctrl+B)"
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              onClick={() => exec("italic")}
              className="p-1.5 hover:bg-gray-100 text-gray-800 cursor-pointer italic border-r border-gray-200"
              title="Itálico (Ctrl+I)"
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              onClick={() => exec("underline")}
              className="p-1.5 hover:bg-gray-100 text-gray-800 cursor-pointer underline"
              title="Sublinhado"
            >
              <Underline size={15} />
            </button>
          </div>

          {/* Listas: Itens e Numéricas */}
          <div className="flex items-center bg-white border border-gray-300 rounded mr-1 shadow-2xs">
            <button
              type="button"
              onClick={() => exec("insertUnorderedList")}
              className="p-1.5 hover:bg-gray-100 text-gray-800 cursor-pointer border-r border-gray-200"
              title="Lista com Marcadores (Bullets)"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              onClick={() => exec("insertOrderedList")}
              className="p-1.5 hover:bg-gray-100 text-gray-800 cursor-pointer"
              title="Lista Numérica (1. 2. 3.)"
            >
              <ListOrdered size={15} />
            </button>
          </div>

          {/* Desfazer / Refazer / Limpar */}
          <div className="flex items-center bg-white border border-gray-300 rounded shadow-2xs">
            <button
              type="button"
              onClick={() => exec("undo")}
              className="p-1.5 hover:bg-gray-100 text-gray-600 cursor-pointer border-r border-gray-200"
              title="Desfazer (Ctrl+Z)"
            >
              <Undo size={14} />
            </button>
            <button
              type="button"
              onClick={() => exec("redo")}
              className="p-1.5 hover:bg-gray-100 text-gray-600 cursor-pointer border-r border-gray-200"
              title="Refazer (Ctrl+Y)"
            >
              <Redo size={14} />
            </button>
            <button
              type="button"
              onClick={() => exec("removeFormat")}
              className="p-1.5 hover:bg-gray-100 text-red-600 cursor-pointer"
              title="Limpar formatação do texto selecionado"
            >
              <RemoveFormatting size={14} />
            </button>
          </div>
        </div>

        {/* Alternador Código HTML / Modo Word */}
        <div>
          <button
            type="button"
            onClick={() => setIsCodeMode(!isCodeMode)}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 font-semibold cursor-pointer shadow-2xs transition"
            title="Alternar entre editor visual e código HTML"
          >
            {isCodeMode ? (
              <>
                <Eye size={13} className="text-[#12589e]" />
                <span>Modo Visual (Word)</span>
              </>
            ) : (
              <>
                <Code size={13} className="text-gray-600" />
                <span>Código HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Área Editável Formatada com as Classes do Site */}
      {isCodeMode ? (
        <textarea
          value={internalHtml}
          onChange={handleCodeChange}
          rows={16}
          className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 focus:outline-none resize-y"
          placeholder="Edite o código HTML do artigo diretamente..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="editor-content min-h-[320px] max-h-[600px] overflow-y-auto p-5 md:p-6 focus:outline-none bg-white text-slate-800"
          data-placeholder={placeholder}
        />
      )}

      {/* Estilos Visuais Parametrizados Idênticos aos Artigos do Site */}
      <style jsx global>{`
        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          font-style: italic;
          cursor: text;
        }
        .editor-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #334e68;
          font-size: 15px;
        }
        .editor-content h2,
        .editor-content h3 {
          font-family: Georgia, Cambria, "Times New Roman", Times, serif;
          font-weight: 700;
          color: #102a43;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          font-size: 1.25rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.35rem;
        }
        .editor-content blockquote {
          border-left: 4px solid #12589e;
          background-color: #f0f7ff;
          padding: 0.75rem 1.25rem;
          margin: 1.25rem 0;
          font-style: italic;
          color: #1e293b;
          border-radius: 0 0.375rem 0.375rem 0;
          font-size: 15px;
        }
        .editor-content strong,
        .editor-content b {
          font-weight: 700;
          color: #0f172a;
        }
        .editor-content em,
        .editor-content i {
          font-style: italic;
          color: #334e68;
        }
        .editor-content u {
          text-decoration: underline;
        }
        .editor-content ul {
          list-style-type: disc;
          padding-left: 1.75rem;
          margin: 1rem 0;
        }
        .editor-content ol {
          list-style-type: decimal;
          padding-left: 1.75rem;
          margin: 1rem 0;
        }
        .editor-content li {
          margin-bottom: 0.35rem;
          line-height: 1.6;
          color: #334e68;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}
