import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#102a43] text-gray-300 font-sans text-xs pt-8 pb-6 border-t-4 border-[#12589e]">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🫧</span>
            <span className="font-serif italic font-bold text-lg text-white">
              Pérolas Preciosas
            </span>
          </div>
          <p className="text-gray-300 leading-relaxed text-xs">
            &ldquo;Momentos preciosos com Deus&rdquo; — semeando a verdade bíblica,
            edificando a fé cristã e disponibilizando devocionais e estudos para cada dia do ano.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3 border-b border-gray-700 pb-1">
            Seções Principais
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link href="/artigos?cat=iniciantes" className="hover:text-yellow-400">Estudos para Iniciantes</Link></li>
            <li><Link href="/artigos?cat=avancado" className="hover:text-yellow-400">Teologia e Estudos Avançados</Link></li>
            <li><Link href="/artigos?cat=vida-crista" className="hover:text-yellow-400">Vida Cristã Prática</Link></li>
            <li><Link href="/secao/diversos-folhetos" className="hover:text-yellow-400">Folhetos Evangelísticos</Link></li>
            <li><Link href="/secao/iceb" className="hover:text-yellow-400">Igreja Cristã Evangélica do Brasil (ICEB)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3 border-b border-gray-700 pb-1">
            Administração & Contato
          </h4>
          <p className="mb-3 text-xs text-gray-300">
            Dúvidas, orações e mensagens para o ministério:
          </p>
          <div className="space-y-2">
            <Link
              href="/secao/contato"
              className="inline-block bg-[#12589e] hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold"
            >
              Fale Conosco
            </Link>
            <div className="pt-2">
              <Link
                href="/adm/login"
                className="text-gray-400 hover:text-yellow-300 text-[11px] underline"
              >
                [Acesso Administrativo]
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 pt-4 border-t border-gray-800 text-center text-gray-400 text-[11px]">
        &copy; {new Date().getFullYear()} Pérolas Preciosas &bull; A Deus toda a Honra e a Glória.
      </div>
    </footer>
  );
}
