import {
  applyKaggleFlags,
  looksLikeKaggleModel,
  parseKaggleFlags,
  stripKaggleFlags,
} from '../kaggleFlags';

describe('kaggleFlags', () => {
  test('stripKaggleFlags removes known suffixes', () => {
    expect(stripKaggleFlags('google/gemini-2.5-flash:web:shell')).toBe(
      'google/gemini-2.5-flash',
    );
    expect(stripKaggleFlags('anthropic/claude-sonnet-4:think')).toBe(
      'anthropic/claude-sonnet-4',
    );
    expect(stripKaggleFlags('plain-model')).toBe('plain-model');
  });

  test('parseKaggleFlags reads web/shell/think', () => {
    expect(parseKaggleFlags('m:web:high:shell')).toEqual({
      web: true,
      shell: true,
      think: 'high',
    });
    expect(parseKaggleFlags('m')).toEqual({
      web: false,
      shell: false,
      think: undefined,
    });
  });

  test('applyKaggleFlags merges and orders', () => {
    expect(
      applyKaggleFlags('google/gemini-2.5-flash', {
        web: true,
        shell: true,
        think: 'medium',
      }),
    ).toBe('google/gemini-2.5-flash:web:medium:shell');

    expect(
      applyKaggleFlags('google/gemini-2.5-flash:web', {shell: true}),
    ).toBe('google/gemini-2.5-flash:web:shell');

    expect(
      applyKaggleFlags('google/gemini-2.5-flash:web:shell', {web: false}),
    ).toBe('google/gemini-2.5-flash:shell');
  });

  test('looksLikeKaggleModel', () => {
    expect(looksLikeKaggleModel('x:shell')).toBe(true);
    expect(looksLikeKaggleModel('x')).toBe(false);
  });
});
