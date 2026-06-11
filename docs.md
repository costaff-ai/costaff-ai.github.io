# CoStaff — Install &amp; Setup

> One installer for macOS and Ubuntu. A short setup wizard. Then add the specialist agents and chat channels you want — all locally on your machine via Docker.

First time? The hand-held walkthrough (every prompt, expected output, durations) is at https://costaffs.app/docs/tutorial/ （繁中：https://costaffs.app/zhtw/docs/tutorial/）.

## System requirements

| Component | Minimum | Recommended |
|---|---|---|
| OS | macOS 12+ / Ubuntu 20.04+ | macOS 14+ / Ubuntu 22.04+ |
| CPU | 2 vCPU (x86_64 or ARM64) | 4 vCPU |
| RAM | 8 GB | 16 GB |
| Disk | 20 GB free | 50 GB free |
| Python | 3.12 (installer handles it) | — |
| Docker | Engine 24+ / Desktop 4.30+ | — |
| LLM | Google API key, OpenAI-compatible endpoint, or local Ollama | — |

CoStaff runs entirely on your machine. The only outbound call is to the LLM provider you configure — and even that becomes local if you point at Ollama or another self-hosted model.

## Install

```bash
# macOS or Ubuntu
curl -fsSL https://raw.githubusercontent.com/costaff-ai/costaff/main/install.sh | bash
```

The installer:

- Detects your OS (macOS or Ubuntu/Debian only; Ubuntu 24.04+ handled).
- Installs Xcode CLT + Homebrew on macOS, or `apt` packages on Ubuntu.
- Installs Python 3.12 (Homebrew or `deadsnakes` PPA) and Docker — on macOS it launches Docker Desktop and waits for the daemon; on Ubuntu it starts the daemon via systemd if stopped.
- Clones `costaff-ai/costaff` into `~/.costaff/costaff/`.
- Creates a venv at `~/.costaff/.venv/` and installs the CLI.
- Appends the venv to your `.zshrc` / `.bashrc`.
- Chains into `costaff onboard` automatically when no manual steps remain.

> **Ubuntu:** the installer adds you to the `docker` group. Log out and back in (or run `newgrp docker`) before the next step.

## First-run setup

```bash
source ~/.zshrc        # or ~/.bashrc on Ubuntu
costaff onboard
```

The wizard asks for:

- **PostgreSQL URI** — keep the default to use the bundled Postgres container.
- **Model provider** — Google Gemini (needs a Google AI Studio key; the key is verified live against the Gemini API) or LiteLLM (OpenAI, Anthropic, Ollama, etc.).
- **Language** — Traditional Chinese, English, Japanese, or Simplified Chinese.
- **Timezone** — e.g. `Asia/Taipei`, `America/Los_Angeles`.
- **Channels** — WebChat is pre-selected (browser chat, no bot token); optionally Telegram, Discord, LINE, Email (can also add later).
- **Dashboard admin account** — username + password for `costaff dashboard` (skippable; the dashboard also prompts on first visit).

The wizard auto-generates random values for `ID_SALT`, `MCP_SECRET_KEY`, and `API_HEADERS_KEY`. Leave them alone — they secure agent-to-agent calls. Re-running `costaff onboard` is safe: existing settings become the defaults. For CI, `costaff bootstrap -k <gemini-key>` is the non-interactive equivalent.

## Start CoStaff

```bash
costaff start
```

A preflight check validates `.env` first (model API key, DB URI, secrets) — fatal issues abort with the exact fix instead of a container crash-loop (`--no-preflight` to skip). Then layered start: Postgres → registered agents → Manager → channels. First run builds the Docker images and takes a few minutes; later runs are cached.

The Manager Agent listens on `http://localhost:18080`. Channel host ports are auto-assigned from `18090`–`18099` in add order (`costaff channel list` shows them); specialist agent health ports use `18100`–`18199`, bound to `127.0.0.1` only.

## Add specialist agents

Official agents (in the `costaff-ai` GitHub org): `costaff-agent-business-analysis` (charts + PDF/PPT reports), `costaff-agent-coding` (sandboxed Python), `costaff-agent-database` (plain-language SQL), `costaff-agent-twinkle-hub` (open government data), and `costaff-agent-template` (starting point for your own).

### From GitHub (official + community)

```bash
costaff agent add business-analysis \
  --github https://github.com/costaff-ai/costaff-agent-business-analysis

costaff agent add coding \
  --github https://github.com/costaff-ai/costaff-agent-coding
```

`agent add` validates the manifest (`--strict` for full schema enforcement), prompts for required env vars (`-e KEY=VAL` to pre-supply), and automatically whitelists just the 4 core platform MCP tools for the new agent (customizable in `config.json → agent_mcp_filters`).

### From a local path (development)

```bash
costaff agent add my-agent --local /path/to/my-agent
```

### Register a remote A2A endpoint

```bash
costaff agent add partner-agent --url http://partner.example.com:8081
```

Manage agents with `costaff agent list`, `costaff agent restart <name>`, `costaff agent rebuild <name>`, `costaff agent remove <name>`.

**Model per agent:** each specialist can use a different model. Inspect or set with `costaff agent model <name>`.

## Add chat channels

```bash
# Browser-based chat UI (no bot token — prompts for a login email + password)
costaff channel add webchat

# Telegram bot (prompts for TELEGRAM_BOT_TOKEN)
costaff channel add telegram

# Slack (first-party, added by URL)
costaff channel add slack --github https://github.com/costaff-ai/costaff-channel-slack
```

Official names (`webchat`, `telegram`, `discord`, `line`) auto-resolve to their GitHub repos. Host ports are auto-assigned from `18090`–`18099`; if WebChat is your first channel it lands at `http://localhost:18090`. List or remove with `costaff channel list` / `costaff channel remove <name>`.

## Verify the install

```bash
costaff status

curl -I http://localhost:18080/
# → any non-5xx means the Manager is up

curl http://localhost:<channel-port>/.well-known/agent-card.json
# → agent card JSON (port from `costaff channel list`)
```

Open your WebChat port in a browser and log in, or run `costaff dashboard` (http://localhost:8501) and use the Chat tab. When in doubt, `costaff doctor` ends with a Suggested-fixes list.

**Approval gate (on by default):** the first message from any chat account creates a *pending* identity and the assistant replies "your account has not been approved". Approve yourself in dashboard → Users, then message again.

## Troubleshooting

- **First reflex** — run `costaff doctor`: it diagnoses containers, network, `.env`, and the database, and ends with a Suggested-fixes list.
- **`costaff start` aborts with config errors** — the preflight check found a fatal `.env` issue and printed the fix; usually `costaff onboard` resolves it (`--no-preflight` to bypass).
- **Docker permission denied (Ubuntu)** — log out and back in, or run `newgrp docker`.
- **Port 18080 already in use** — override `COSTAFF_AGENT_PORT` in `~/.costaff/costaff/.env`, then `costaff restart`. Channel/agent ports auto-assign from free slots.
- **Agent unhealthy** — `docker logs costaff-agent-<name> --tail 50`. Usually a missing API key; fix `~/.costaff/costaff-agent/<name>/.env` and `costaff agent rebuild <name>`.
- **Start over** —
  ```bash
  costaff stop
  docker compose -f ~/.costaff/costaff/docker-compose.yaml down -v
  rm -rf ~/.costaff/workspace/*
  costaff start
  ```
- **Still stuck?** — open an issue at https://github.com/costaff-ai/costaff/issues with the output of `costaff doctor`.

## Next

- [AI Staff](https://costaffs.app/agents/) — the specialist agents you can hire
- [Architecture](https://costaffs.app/architecture/) — the 6-layer system diagram
- [User Flow](https://costaffs.app/user-flow/) — what happens end-to-end when you hand off a task
