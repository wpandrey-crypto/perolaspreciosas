import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";

export default function AdmHojePage() {
  return (
    <div className="space-y-6">
      <div className="bg-[#12589e] text-white px-4 py-2.5 font-bold text-sm tracking-wide shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={18} />
          <span>&gt;&gt; HOJE - MENSAGEM DO DIA</span>
        </div>
        <Link
          href="/adm/cada-dia"
          className="bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded inline-flex items-center gap-1 transition"
        >
          <ArrowLeft size={14} /> Ir para Cada Dia
        </Link>
      </div>

      <div className="bg-white border-2 border-gray-300 p-8 text-center space-y-4">
        <Calendar size={48} className="mx-auto text-[#12589e]" />
        <h2 className="text-xl font-bold text-[#102a43]">Mensagens e Devocionais Diárias</h2>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          As mensagens diárias do site são configuradas diretamente na seção <strong>Cada Dia / Ocasiões Capa</strong> no calendário anual de 12 meses.
        </p>
        <div>
          <Link
            href="/adm/cada-dia"
            className="inline-block bg-[#12589e] hover:bg-[#0e4882] text-white font-bold px-5 py-2 rounded text-xs shadow-xs transition"
          >
            Acessar Grade Anual do Cada Dia &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
