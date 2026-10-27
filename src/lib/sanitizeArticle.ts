/**
 * Módulo de Higienização e Padronização Semântica de Artigos
 * Padroniza conteúdo em: Título, Subtítulo, Texto, Citação, Negrito, Itálico e Listas (bullet e numéricas).
 * Remove cores arbitrárias, fontes do Word, espaços múltiplos e lixos de diagramação legada.
 */

export function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&bull;/gi, "•")
    .replace(/&#145;/gi, "‘")
    .replace(/&#146;/gi, "’")
    .replace(/&#147;/gi, "“")
    .replace(/&#148;/gi, "”")
    .replace(/&#8217;/gi, "’")
    .replace(/&#8220;/gi, "“")
    .replace(/&#8221;/gi, "”")
    .replace(/&hellip;/gi, "...");
}

/**
 * Junta letras maiúsculas que foram espaçadas manualmente (ex: "B E M   V I N D O" -> "BEM VINDO")
 */
export function collapseSpacedLetters(text: string): string {
  if (!text) return "";
  // Agrupa sequências como "B E M" ou "I D O S O"
  return text.replace(
    /\b((?:[A-ZÁÉÍÓÚÂÊÔÃÕÇ]\s+){2,}[A-ZÁÉÍÓÚÂÊÔÃÕÇ])\b/g,
    (match) => match.replace(/\s+/g, "")
  );
}

/**
 * Limpa títulos legados removendo códigos internos, números de arquivo e pontuações estranhas.
 */
export function cleanTitle(rawTitle: string): string {
  if (!rawTitle) return "Sem título";
  let t = decodeHtmlEntities(rawTitle);

  // Remove tags HTML
  t = t.replace(/<[^>]+>/g, "");

  // Remove sufixos de identificador de arquivo legado no final (ex: " he", " krta", " oc", " %%", " ldr", etc.)
  t = t.replace(/\s+(?:he|krta|oc|%%|ldr|art|hp)\s*$/i, "");

  // Remove prefixos numéricos e pontuações no início:
  // Ex: "01   ", "05... ", "1c... ", "# ", "*09.27 > ", "> > > ", "* "
  t = t.replace(/^[\s*#>–—._:]*(?:\d+[a-z]?|\*\d+(?:\.\d+)?)\s*(?:[.\-_>:>]+\s*)*/i, "");

  // Remove pontuação solta residual no início
  t = t.replace(/^[\s*#>–—._:]+/, "");

  // Remove pontuação de fechamento do legado (ex: " -X-", " #", " %%")
  t = t.replace(/[\s#%*\-_>]+$/, "");

  // Trata letras espaçadas (ex: "I D O S O" -> "IDOSO")
  t = collapseSpacedLetters(t);

  // Remove espaços múltiplos
  t = t.replace(/\s+/g, " ").trim();

  // Ajusta pontuação colada
  t = t.replace(/\s+([!?:;,.])/g, "$1");

  return t || "Sem título";
}

/**
 * Limpa subtítulo / resumo
 */
export function cleanSubtitle(rawSubtitle: string): string | null {
  if (!rawSubtitle) return null;
  let s = decodeHtmlEntities(rawSubtitle);
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/\s+/g, " ").trim();
  s = s.replace(/^[\s*#>–—._:]+/, "").trim();
  s = collapseSpacedLetters(s);
  s = s.replace(/\s+([!?:;,.])/g, "$1");
  return s.length > 0 ? s : null;
}

/**
 * Limpa e padroniza o conteúdo HTML de um artigo legado.
 * Gera HTML semântico limpo com:
 * - <h3> para subtítulos internos
 * - <p> para texto normal
 * - <blockquote> para citações / versículos
 * - <strong> para negrito
 * - <em> para itálico
 * - <ul> e <li> para listas não ordenadas
 * - <ol> e <li> para listas numéricas
 */
export function cleanArticleContent(rawHtml: string): string {
  if (!rawHtml) return "";

  let html = rawHtml;

  // 1. Remove lixo de tags XML, Office e scripts
  html = html.replace(/<\?xml:[^>]+>/gi, "");
  html = html.replace(/<!--[\s\S]*?-->/gi, "");
  html = html.replace(/<o:p[\s\S]*?<\/o:p>/gi, "");
  html = html.replace(/<\/?o:p>/gi, "");
  html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");

  // 2. Normaliza quebras de linha e blocos div
  html = html.replace(/<div[^>]*>/gi, "<p>");
  html = html.replace(/<\/div>/gi, "</p>");

  // 3. Remove completamente tags de fonte e spans (desembrulha texto interno)
  html = html.replace(/<font[^>]*>/gi, "");
  html = html.replace(/<\/font>/gi, "");
  html = html.replace(/<span[^>]*>/gi, "");
  html = html.replace(/<\/span>/gi, "");

  // 4. Padroniza tags de negrito e itálico
  html = html.replace(/<\/?(font|span)\b[^>]*>/gi, "");
  html = html.replace(/<b\b[^>]*>/gi, "<strong>");
  html = html.replace(/<\/b>/gi, "</strong>");
  html = html.replace(/<i\b[^>]*>/gi, "<em>");
  html = html.replace(/<\/i>/gi, "</em>");
  html = html.replace(/<\/?u\b[^>]*>/gi, ""); // Remove tags <u> e </u> órfãs ou legadas

  // Remove qualquer tag residual de estilo legado
  html = html.replace(/<\/?(font|span|u)\b[^>]*>/gi, "");

  // 5. Remove qualquer atributo residual em tags permitidas
  html = html.replace(/<(p|h[1-6]|blockquote|ul|ol|li)\b[^>]*>/gi, "<$1>");

  // 6. Decodifica entidades como &nbsp;
  html = decodeHtmlEntities(html);

  // 7. Normaliza múltiplos <br>
  html = html.replace(/(<br\s*\/?>\s*){2,}/gi, "</p><p>");
  html = html.replace(/<br\s*\/?>/gi, "\n");

  // 8. Trata letras espaçadas manualmente (ex: "C a r t a   A b e r t a")
  html = collapseSpacedLetters(html);

  // 9. Separa os blocos de texto
  const rawBlocks = html
    .split(/<\/?(?:p|h[1-6]|blockquote|ul|ol|li)>/gi)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const cleanElements: string[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  function flushList() {
    if (currentList && currentList.items.length > 0) {
      const tag = currentList.type;
      const itemsHtml = currentList.items.map((it) => `  <li>${it}</li>`).join("\n");
      cleanElements.push(`<${tag}>\n${itemsHtml}\n</${tag}>`);
      currentList = null;
    }
  }

  for (const block of rawBlocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    for (let line of lines) {
      // Remove tags residuais que possam ter sobrado
      line = line.replace(/<\/?(font|span|u)\b[^>]*>/gi, "");

      // Remove espaços duplos e múltiplos
      line = line.replace(/[ \t]{2,}/g, " ").trim();

      // Ignora lixos recorrentes como 'zz', 'zz00', '-X-', etc.
      if (/^zz\s*\d*$/i.test(line) || /^[-_#*~]{3,}$/.test(line)) {
        continue;
      }
      line = line.replace(/^zz\s*\d*\s*/i, "").trim();
      line = line.replace(/[\s\-_#*]+$/g, "").trim();

      if (!line) continue;

      // Limpeza de tags inline vazias residuais tipo <strong></strong> ou <em></em>
      line = line.replace(/<(strong|em)>\s*<\/\1>/gi, "");
      line = line.replace(/<(strong|em)>\s*<\/\1>/gi, ""); // Dupla passada
      if (!line.trim()) continue;

      // 1. Detecta Lista Numérica (ex: "1. ", "1- ", "1) ", "i) ", "ii) ")
      const numMatch = line.match(/^(?:(?:\d+|[a-e]|[ivx]+)[\.\-\)])\s+(.+)$/i);
      if (numMatch) {
        if (!currentList || currentList.type !== "ol") {
          flushList();
          currentList = { type: "ol", items: [] };
        }
        currentList.items.push(numMatch[1].trim());
        continue;
      }

      // 2. Detecta Lista com Marcadores (ex: "- ", "• ", "* ")
      const bulletMatch = line.match(/^[\-\*•]\s+(.+)$/);
      if (bulletMatch) {
        if (!currentList || currentList.type !== "ul") {
          flushList();
          currentList = { type: "ul", items: [] };
        }
        currentList.items.push(bulletMatch[1].trim());
        continue;
      }

      // Encerra qualquer lista antes de entrar em bloco comum
      flushList();

      // 3. Detecta Citação (Bíblica ou Citação Destacada)
      // Ex: linhas iniciadas com "> ", ou citações com aspas contendo referências conhecidas
      if (line.startsWith("&gt; ") || line.startsWith("> ")) {
        const quoteText = line.replace(/^(&gt;|>)\s*/, "").trim();
        cleanElements.push(`<blockquote>${quoteText}</blockquote>`);
        continue;
      }

      // 4. Detecta Subtítulo / Intertítulo no texto
      // Linhas curtas que não terminam com ponto/vírgula, em maiúsculas ou seções declarativas (ex: "3- MARIDOS", "Tese:")
      const isHeading =
        line.length <= 70 &&
        !line.endsWith(".") &&
        !line.endsWith(",") &&
        !line.endsWith(";") &&
        (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ\s\d\-_:!?]{3,}$/.test(line.replace(/<[^>]+>/g, "")) ||
          /^Tese\s*:/i.test(line) ||
          /^(?:Conclusão|Introdução|Aplicação|Resumo)\s*:/i.test(line));

      if (isHeading) {
        const cleanHeading = line.replace(/<[^>]+>/g, "").replace(/^[:\-_]+|[:\-_]+$/g, "").trim();
        if (cleanHeading) {
          cleanElements.push(`<h3>${cleanHeading}</h3>`);
          continue;
        }
      }

      // 5. Parágrafo comum
      cleanElements.push(`<p>${line}</p>`);
    }
  }

  flushList();

  return cleanElements.join("\n\n");
}
