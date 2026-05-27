# CoStaff — Install &amp; Setup

> One installer for macOS and Ubuntu. A short setup wizard. Then add the specialist agents and chat channels you want — all locally on your machine via Docker.

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

- Detects your OS (macOS or Ubuntu/Debian only).
- Installs Xcode CLT + Homebrew on macOS, or `apt` packages on Ubuntu.
- Installs Python 3.12 (Homebrew or `deadsnakes` PPA) and Docker.
- Clones `costaff-ai/costaff` into `~/.costaff/costaff/`.
- Creates a venv at `~/.costaff/.venv/` and installs the CLI.
- Appends the venv to your `.zshrc` / `.bashrc`.

> **Ubuntu:** the installer adds you to the `docker` group. Log out and back in (or run `newgrp docker`) before the next step.

## First-run setup

```bash
source ~/.zshrc        # or ~/.bashrc on Ubuntu
costaff onboard
```

The wizard asks for:

- **PostgreSQL URI** — keep the default to use the bundled Postgres container.
- **Model provider** — Google Gemini (needs a Google AI Studio key) or LiteLLM (OpenAI, Anthropic, Ollama, etc.).
- **Language** — Traditional Chinese, English, Japanese, or Simplified Chinese.
- **Timezone** — e.g. `Asia/Taipei`, `America/Los_Angeles`.
- **Channels** — Telegram, Discord, LINE, WebChat, or Email (can also add later).

The wizard auto-generates random values for `ID_SALT`, `MCP_SECRET_KEY`, and `API_HEADERS_KEY`. Leave them alone — they secure agent-to-agent calls.

## Start CoStaff

```bash
costaff start
```

Layered start: Postgres → registered agents → Manager → channels. First run builds the Docker images and takes a few minutes; later runs are cached.

The Manager Agent listens on `http://localhost:18080`. Channels expose their own ports (WebChat is on `18090` by default).

## Add specialist agents

### From GitHub (official + community)

```bash
costaff agent add business-analysis \
  --github https://github.com/costaff-ai/costaff-agent-business-analysis

costaff agent add coding \
  --github https://github.com/costaff-ai/costaff-agent-coding
```

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
# Browser-based chat UI (no extra credentials)
costaff channel add webchat

# Telegram bot (prompts for TELEGRAM_BOT_TOKEN)
costaff channel add telegram
```

WebChat lands at `http://localhost:18090`. List or remove with `costaff channel list` / `costaff channel remove <name>`.

## Verify the install

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

curl http://localhost:18080/health
# → HTTP 200

curl http://localhost:18090/.well-known/agent-card.json
# → WebChat agent card
```

Open `http://localhost:18090` in your browser to start chatting.

## Troubleshooting

- **Docker permission denied (Ubuntu)** — log out and back in, or run `newgrp docker`.
- **Port 18080 / 18090 already in use** — override `COSTAFF_AGENT_PORT` / `WEBCHAT_PORT` in `~/.costaff/costaff/.env`, then `costaff restart`.
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

- [AI Staff](https://costaffs.app/agents/) — the 5 specialist agents you can hire
- [Architecture](https://costaffs.app/architecture/) — the 6-layer system diagram
- [User Flow](https://costaffs.app/user-flow/) — what happens end-to-end when you hand off a task
