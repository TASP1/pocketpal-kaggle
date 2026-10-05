import type {MixedStyleRecord} from 'react-native-render-html';
import type {Theme} from '../../utils/types';

/**
 * Premium tag styles for react-native-render-html — denser code, soft
 * blockquotes, clear lists/tables, PocketPal MD3 tokens.
 */
export function buildPremiumMarkdownTagsStyles(
  theme: Theme,
): MixedStyleRecord {
  const mono =
    (theme as any).fonts?.code?.fontFamily ||
    (theme as any).fonts?.bodyMedium?.fontFamily ||
    'monospace';
  const on = theme.colors.onSurface;
  const muted = theme.colors.onSurfaceVariant;
  const surface = theme.colors.surfaceVariant;
  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;

  return {
    body: {
      color: on,
      fontSize: 16,
      lineHeight: 24,
      margin: 0,
      padding: 0,
    },
    p: {
      marginTop: 0,
      marginBottom: 10,
      color: on,
      fontSize: 16,
      lineHeight: 24,
    },
    h1: {fontSize: 22, fontWeight: '700', marginTop: 14, marginBottom: 8, color: on},
    h2: {fontSize: 19, fontWeight: '700', marginTop: 12, marginBottom: 6, color: on},
    h3: {fontSize: 17, fontWeight: '600', marginTop: 10, marginBottom: 4, color: on},
    h4: {fontSize: 15, fontWeight: '600', marginTop: 8, marginBottom: 4, color: on},
    a: {
      color: secondary,
      textDecorationLine: 'underline',
    },
    code: {
      fontFamily: mono,
      fontSize: 13,
      backgroundColor: surface,
      color: muted,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 1,
    },
    pre: {
      backgroundColor: surface,
      borderRadius: 12,
      padding: 12,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: primary,
      paddingLeft: 12,
      marginVertical: 10,
      opacity: 0.92,
    },
    ul: {marginBottom: 10, paddingLeft: 4},
    ol: {marginBottom: 10, paddingLeft: 4},
    li: {
      marginBottom: 6,
      color: on,
      fontSize: 16,
      lineHeight: 24,
    },
    strong: {fontWeight: '700', color: on},
    em: {fontStyle: 'italic'},
    hr: {
      backgroundColor: theme.colors.outlineVariant,
      height: 1,
      marginVertical: 14,
    },
    table: {
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 10,
      marginVertical: 10,
    },
    th: {
      backgroundColor: surface,
      padding: 8,
      fontWeight: '600',
      color: on,
    },
    td: {
      padding: 8,
      borderTopWidth: 1,
      borderColor: theme.colors.outlineVariant,
      color: on,
      fontSize: 14,
    },
  };
}
