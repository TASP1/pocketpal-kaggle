import {prepareBridgeContent, stripToolProtocol} from '../bridgeContent';

describe('bridgeContent', () => {
  it('strips web.run tool JSON', () => {
    const raw =
      '["web.run", {"search_query": [{"q": "Minecraft"}], "response_length": "long"}]\n\nHello world';
    expect(stripToolProtocol(raw)).toBe('Hello world');
  });

  it('parses and dedupes Sources', () => {
    const raw = `Answer text here.

Sources [1] Foo Title - https://example.com/a [2] Bar - https://example.com/b
Sources [1] Foo Title - https://example.com/a [2] Bar - https://example.com/b`;
    const {body, sources} = prepareBridgeContent(raw);
    expect(body).toContain('Answer text');
    expect(body.toLowerCase()).not.toContain('sources [1]');
    expect(sources).toHaveLength(2);
    expect(sources[0].url).toContain('example.com/a');
  });
});
