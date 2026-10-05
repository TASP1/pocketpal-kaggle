/**
 * Kaggle Bridge model-id flags.
 *
 * The gateway treats suffixes on the model id as capability toggles:
 *   base:google/gemini-2.5-flash
 *   :web     — search the web first
 *   :think / :low / :medium / :high / :nothink — reasoning intensity
 *   :shell   — allow the model to run sandboxed shell commands
 *
 * Flags may be combined: `google/gemini-2.5-flash:web:think:shell`
 * Order is not significant to the gateway; we normalise to a stable order.
 */

export type KaggleThinkLevel = 'nothink' | 'low' | 'medium' | 'high' | 'think';

export type KaggleFlags = {
  web: boolean;
  shell: boolean;
  /** undefined = leave whatever the base model id already has */
  think?: KaggleThinkLevel;
};

const THINK_FLAGS: readonly KaggleThinkLevel[] = [
  'nothink',
  'low',
  'medium',
  'high',
  'think',
] as const;

const FLAG_ORDER = ['web', 'think', 'low', 'medium', 'high', 'nothink', 'shell'] as const;

/** Strip all known Kaggle flags from a model id, return base id. */
export function stripKaggleFlags(modelId: string): string {
  const parts = modelId.split(':');
  if (parts.length === 1) {
    return modelId;
  }
  const base = parts[0];
  // Keep unknown segments after the first colon as part of the base
  // (some providers use org:model). Only strip known flag tokens.
  const rest = parts.slice(1).filter(p => !isKnownFlag(p));
  return rest.length ? [base, ...rest].join(':') : base;
}

function isKnownFlag(token: string): boolean {
  return (
    token === 'web' ||
    token === 'shell' ||
    (THINK_FLAGS as readonly string[]).includes(token)
  );
}

/** Parse flags currently present on a model id. */
export function parseKaggleFlags(modelId: string): KaggleFlags {
  const tokens = new Set(modelId.split(':').slice(1));
  let think: KaggleThinkLevel | undefined;
  for (const level of THINK_FLAGS) {
    if (tokens.has(level)) {
      think = level;
      break;
    }
  }
  return {
    web: tokens.has('web'),
    shell: tokens.has('shell'),
    think,
  };
}

/**
 * Apply desired flags onto a model id (base or already flagged).
 * Pass partial flags; omitted keys keep the previous value.
 */
export function applyKaggleFlags(
  modelId: string,
  flags: Partial<KaggleFlags>,
): string {
  const base = stripKaggleFlags(modelId);
  const current = parseKaggleFlags(modelId);
  const next: KaggleFlags = {
    web: flags.web ?? current.web,
    shell: flags.shell ?? current.shell,
    think: flags.think !== undefined ? flags.think : current.think,
  };

  const suffixes: string[] = [];
  if (next.web) {
    suffixes.push('web');
  }
  if (next.think) {
    suffixes.push(next.think);
  }
  if (next.shell) {
    suffixes.push('shell');
  }

  // Stable order for readability
  suffixes.sort(
    (a, b) =>
      FLAG_ORDER.indexOf(a as (typeof FLAG_ORDER)[number]) -
      FLAG_ORDER.indexOf(b as (typeof FLAG_ORDER)[number]),
  );

  return suffixes.length ? `${base}:${suffixes.join(':')}` : base;
}

/** True when this remote model id looks like a Kaggle Bridge variant. */
export function looksLikeKaggleModel(modelId: string): boolean {
  return modelId.split(':').slice(1).some(isKnownFlag);
}
