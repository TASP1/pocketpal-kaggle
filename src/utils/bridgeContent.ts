/**
 * Clean Kaggle-Bridge / tool-protocol noise from assistant text and
 * split a trailing "Sources [n] …" block into structured citations so
 * the UI can render them as cards instead of a raw markdown dump.
 */

export type BridgeSource = {
  index: number;
  title: string;
  url: string;
};

export type BridgeContentParts = {
  /** Body markdown (tool JSON stripped, Sources removed) */
  body: string;
  sources: BridgeSource[];
};

/** Tool / agent protocol lines the model sometimes echoes into content */
const TOOL_JSON_RE =
  /^\s*\[?\s*"web\.run"\s*,[\s\S]*?\]\s*$/m;
const TOOL_JSON_INLINE_RE =
  /\[\s*"web\.run"\s*,\s*\{[\s\S]*?\}\s*\]/g;

/** Full Sources footer (may be duplicated by the gateway) */
const SOURCES_BLOCK_RE =
  /(?:^|\n)\s*Sources\s*((?:\[\d+\][^\n]*)+)/gi;

/** Single citation: [1] Title - https://... */
const CITE_RE =
  /\[(\d+)\]\s*([^\[\n]*?)\s*[-–—]\s*(https?:\/\/\S+)/g;

export function stripToolProtocol(text: string): string {
  if (!text) return '';
  let out = text.replace(TOOL_JSON_INLINE_RE, '');
  out = out.replace(TOOL_JSON_RE, '');
  // bare JSON object tool payloads
  out = out.replace(
    /^\s*\{\s*"search_query"\s*:[\s\S]*?\}\s*$/gm,
    '',
  );
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

export function parseSources(text: string): {
  body: string;
  sources: BridgeSource[];
} {
  const sources: BridgeSource[] = [];
  const seen = new Set<string>();

  let body = text;
  const blocks: string[] = [];
  body = body.replace(SOURCES_BLOCK_RE, (_m, block: string) => {
    blocks.push(block);
    return '\n';
  });

  for (const block of blocks) {
    CITE_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = CITE_RE.exec(block)) !== null) {
      const url = m[3].replace(/[.,);]+$/, '');
      if (seen.has(url)) continue;
      seen.add(url);
      sources.push({
        index: parseInt(m[1], 10) || sources.length + 1,
        title: (m[2] || url).trim().replace(/\s+/g, ' '),
        url,
      });
    }
  }

  // Dedupe body if Sources were inlined twice
  body = body.replace(/\n{3,}/g, '\n\n').trim();
  return {body, sources};
}

export function prepareBridgeContent(raw: string): BridgeContentParts {
  const stripped = stripToolProtocol(raw || '');
  const {body, sources} = parseSources(stripped);
  return {body, sources};
}
