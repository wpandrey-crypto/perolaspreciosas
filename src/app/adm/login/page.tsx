"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdmLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("leda");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/adm/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Usuário ou senha inválidos");
        setLoading(false);
        return;
      }

      router.push("/adm/biblia-ano");
    } catch {
      setError("Erro ao conectar com o servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[420px] border-4 border-[#12589e] bg-white shadow-xl rounded-sm overflow-hidden">
        {/* Banner clássico Pérolas */}
        <div className="bg-gradient-to-r from-[#d9cfbe] via-[#f7f2e7] to-[#d9cfbe] p-4 text-center border-b border-[#12589e] relative">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">🫧</span>
            <span className="text-3xl font-serif font-bold text-[#4a4a4a] italic tracking-wide">
              Pérolas
            </span>
          </div>
          <p className="text-xs text-[#555] italic mt-0.5">momentos preciosos com Deus</p>
        </div>

        {/* Título */}
        <div className="py-4 text-center">
          <h1 className="text-lg font-bold text-black tracking-wide">
            Administração
          </h1>
        </div>

        {/* Formulário mimetizado */}
        <form onSubmit={handleLogin} className="px-8 pb-8 pt-2">
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-xs rounded text-center">
              {error}
            </div>
          )}

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-2">
              <label className="text-black font-medium text-right w-20">
                usuário:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="flex-1 border border-[#7f9db9] px-2 py-1 text-sm bg-[#f2f7fc] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="text-black font-medium text-right w-20">
                senha:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="digite 123"
                required
                className="flex-1 border border-[#7f9db9] px-2 py-1 text-sm bg-[#f2f7fc] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#12589e]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#12589e] hover:bg-[#0e447b] text-white text-sm font-semibold px-6 py-1.5 rounded-sm border border-[#0d3f73] shadow cursor-pointer transition active:scale-95 disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <p className="mt-6 text-xs text-gray-500 text-center">
        Site Pérolas Preciosas &bull; Painel de Gestão de Conteúdos
      </p>
    </div>
  );
}
