import type {MixedStyleRecord} from 'react-native-render-html';
import type {Theme} from '../../utils/types';

/**
 * Premium tag styles for react-native-render-html, tuned to PocketPal's
 * MD3 theme tokens. Merge into MarkdownProvider's `tagsStyles` (or pass as
 * override) for denser code blocks, softer blockquotes, and clearer tables.
 *
 * Upstream already uses marked + RenderHTMLSource; this only upgrades visuals.
 */
export function buildPremiumMarkdownTagsStyles(
  theme: Theme,
): MixedStyleRecord {
  const mono =
    (theme as any).fonts?.code?.fontFamily ||
    (theme as any).fonts?.bodyMedium?.fontFamily ||
    'monospace';

  return {
    body: {
      color: theme.colors.onSurface,
      fontSize: 16,
      lineHeight: 24,
    },
    p: {
      marginTop: 0,
      marginBottom: 8,
    },
    h1: {
      fontSize: 22,
      fontWeight: '700',
      marginTop: 12,
      marginBottom: 8,
      color: theme.colors.onSurface,
    },
    h2: {
      fontSize: 19,
      fontWeight: '700',
      marginTop: 10,
      marginBottom: 6,
      color: theme.colors.onSurface,
    },
    h3: {
      fontSize: 17,
      fontWeight: '600',
      marginTop: 8,
      marginBottom: 4,
      color: theme.colors.onSurface,
    },
    a: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    code: {
      fontFamily: mono,
      fontSize: 13,
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 1,
    },
    pre: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
      padding: 12,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
      paddingLeft: 12,
      marginVertical: 8,
      opacity: 0.92,
    },
    ul: {
      marginBottom: 8,
      paddingLeft: 8,
    },
    ol: {
      marginBottom: 8,
      paddingLeft: 8,
    },
    li: {
      marginBottom: 4,
    },
    table: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 8,
      marginVertical: 8,
    },
    th: {
      backgroundColor: theme.colors.surfaceVariant,
      fontWeight: '600',
      padding: 8,
    },
    td: {
      padding: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outlineVariant,
    },
    hr: {
      backgroundColor: theme.colors.outlineVariant,
      height: 1,
      marginVertical: 12,
    },
  };
}
