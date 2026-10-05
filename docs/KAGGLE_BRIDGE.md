# Kaggle Bridge — native support in PocketPal (fork)

This fork adds first-class support for an **OpenAI-compatible gateway** that fronts free Kaggle-hosted models (and optional sandboxed `:shell`).

No secrets are stored in this repository. You supply the gateway URL and API key only inside the app (Keychain-backed, same as other remote servers).

## What to enter in PocketPal

| Field | Value |
|--------|--------|
| **Server name** | e.g. `Kaggle Bridge` |
| **Server URL** | Your gateway base URL **without** `/v1` (example shape: `https://xxxx.ngrok-free.dev`) |
| **API key** | The bridge key your operator gave you (`BRIDGE_KEY`) |
| **Server type** | `Kaggle Bridge` (auto-detected when possible) |

Web search on the gateway is free and does **not** need a separate search-provider key in PocketPal.

## Model flags (append to model id)

| Flag | Effect |
|------|--------|
| `:web` | Search the web before answering |
| `:think` / `:low` / `:medium` / `:high` / `:nothink` | Reasoning intensity |
| `:shell` | Allow sandboxed shell commands (only if the gateway has a shell backend wired) |

Examples:

- `google/gemini-2.5-flash:shell`
- `google/gemini-2.5-pro:web:think`
- `anthropic/claude-sonnet-4:web:medium:shell`

Helpers live in `src/utils/kaggleFlags.ts` (`stripKaggleFlags`, `parseKaggleFlags`, `applyKaggleFlags`).

## Gateway endpoints (reference)

All except `/health` typically require the bridge API key:

| Endpoint | Use |
|----------|-----|
| `POST /v1/chat/completions` | Chat (what PocketPal uses) |
| `GET /v1/models` | Model list |
| `GET /health` | Liveness |
| `POST /register` | Kaggle tunnel registration (gateway internal) |
| `GET /search?q=` | Raw web search (debug) |
| `GET /v1/controls` | Gateway controls |
| `GET /v1/backend-info` | Backend capabilities |

## Code touchpoints in this fork

1. **`src/utils/serverTypes.ts`** — `Kaggle Bridge` in `SERVER_TYPE_OPTIONS`; ngrok host heuristic in `seedServerType`.
2. **`src/api/servers/detect.ts`** — detect via model-id flags and `/health` / `/v1/backend-info`.
3. **`src/api/servers/index.ts`** — `SERVER_PROFILES['Kaggle Bridge']` (OpenAI-compatible body + optional reasoning_effort).
4. **`src/utils/kaggleFlags.ts`** — pure helpers for model-id flags.
5. **`src/utils/__tests__/kaggleFlags.test.ts`** — unit tests for the helpers.

## Security

- Never commit `BRIDGE_KEY`, `SHELL_KEY`, Render keys, or GitHub PATs.
- Prefer a **dedicated** shell service that strips secrets from the child process environment (as described in your deployment notes).
- Free Render instances sleep after ~15 minutes idle; files in `/tmp` disappear on restart.

## Applying these patches onto upstream PocketPal

1. Clone [a-ghorbani/pocketpal-ai](https://github.com/a-ghorbani/pocketpal-ai).
2. Copy/merge the files listed above.
3. Ensure TypeScript still exhaustively covers `ServerType` in `SERVER_PROFILES` (the `satisfies Record<ServerType, ServerProfile>` check will fail until the new profile exists — that is intentional).
4. Run unit tests for `kaggleFlags`.
5. Build Android APK via the project’s existing GitHub Actions / local Gradle flow.

## Public repo checklist

- [ ] New public GitHub repo (no secrets in history)
- [ ] README links to this doc
- [ ] Upstream attribution (MIT)
- [ ] CI: lint + unit tests
- [ ] Optional: APK release workflow (unsigned first)
