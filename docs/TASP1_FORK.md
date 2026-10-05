# PocketPal AI — Kaggle Bridge (TASP1)

Fork of [a-ghorbani/pocketpal-ai](https://github.com/a-ghorbani/pocketpal-ai) (MIT) with:

- Native **Kaggle Bridge** server type + auto-detect (ngrok / model flags)
- **Web · Think · Shell** chips (`KaggleCapabilityBar`)
- Premium markdown styles
- Shell via Render: `POST https://gh-cli-for-ai-bots.onrender.com/shell/exec` (gateway `SHELL_URL`)
- Cheap public CI: Ubuntu 24.04 + Gradle/Yarn cache (unlimited minutes on public repo)

## Connect

1. Remote server URL = bridge ngrok URL **without** `/v1`
2. API key = `BRIDGE_KEY`
3. Server type: **Kaggle Bridge** (or auto-detect)
4. Use capability chips for `:web` / `:think` / `:shell` model suffixes

See `docs/KAGGLE_BRIDGE.md` and `docs/STREAMING_AND_SHELL.md`.

## Build APK

Actions → **Android APK (cheap cache)** → Run workflow.
