# Native streaming, Kaggle models, and Render shell

## Streaming

PocketPal’s remote path already streams via SSE (`src/api/openai.ts` →
`streamChatCompletion` + `SSEParser`). **Kaggle Bridge needs no new transport**:

1. Server type `Kaggle Bridge` uses the same `OpenAICompletionEngine`.
2. Model id (with optional `:web` / `:think` / `:shell` flags) is sent as `model`.
3. Tokens stream into the existing chat bubble + `MarkdownView` pipeline.

Ensure the gateway URL has **no trailing `/v1`** in `ServerConfig.url` (PocketPal
appends `/v1/chat/completions` itself).

## Kaggle models (native list)

`GET /v1/models` on the bridge returns the full Kaggle catalogue plus flag
variants. Detection marks the server as `Kaggle Bridge` when:

- model ids contain `:web`, `:shell`, `:think`, etc., or
- `/health` / `/v1/backend-info` responds like the bridge, or
- hostname looks like ngrok free tier (`seedServerType`).

Users pick models from the same remote model list as any other server.

## Render `ai-terminal` shell backend

When the isolated shell service is live on Render:

1. Deploy `ai-terminal` with `SHELL_KEY` (and no other secrets in the container env).
2. On the **gateway**, set secrets:
   - `SHELL_URL` = `https://gh-cli-for-ai-bots.onrender.com` (live v1.8.0 `/shell/exec`; dedicated `ai-terminal` service is currently suspended)`
   - `SHELL_KEY` = same key the service expects as `X-Shell-Key`
3. Restart the gateway (`live` workflow / process).
4. In PocketPal, enable the **Shell** chip (`KaggleCapabilityBar`) so the model
   id includes `:shell`.

The old MCP-hosted `/shell/exec` can remain as fallback until cutover is verified.

### Safety (fork policy)

- Models never see `SHELL_KEY` / `RENDER_API_KEY` (strip from child env).
- Do not put GitHub, cloud, or bridge keys into the shell container.
- Free Render sleeps ~15 minutes idle; expect cold starts.

## UI pieces in this kit

| Component | Role |
|-----------|------|
| `KaggleCapabilityBar` | Web / Think / Shell chips (ChatInput design language) |
| `markdownTagsStyles.ts` | Premium HTML tag styles for MarkdownProvider |
| Server type + detect + profile | Recognition + OpenAI-compatible body |

Wire the bar above `ChatInput` or in the chat header when
`serverType === 'Kaggle Bridge'`.
