import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";

export default function AdmUsuariosPage() {
  return (
    <div className="space-y-6">
      <div className="bg-[#12589e] text-white px-4 py-2.5 font-bold text-sm tracking-wide shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} />
          <span>&gt;&gt; GERENCIAMENTO DE USUÁRIOS DO SISTEMA</span>
        </div>
        <Link
          href="/adm/artigos"
          className="bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded inline-flex items-center gap-1 transition"
        >
          <ArrowLeft size={14} /> Voltar para Artigos
        </Link>
      </div>

      <div className="bg-white border-2 border-gray-300 p-6 shadow-2xs">
        <h2 className="text-base font-bold text-[#102a43] mb-4 pb-2 border-b border-gray-200">
          Usuários com Acesso Administrativo
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f0f4f8] text-[#12589e] border-b border-gray-300 uppercase font-bold">
                <th className="p-2.5 border">Nome</th>
                <th className="p-2.5 border">Usuário / Login</th>
                <th className="p-2.5 border">Função</th>
                <th className="p-2.5 border text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-blue-50/50">
                <td className="p-2.5 border font-bold text-gray-900">Leda Latterza</td>
                <td className="p-2.5 border font-mono text-gray-700">leda</td>
                <td className="p-2.5 border text-gray-600">Administrador Geral</td>
                <td className="p-2.5 border text-center">
                  <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-[11px]">
                    Ativo
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
