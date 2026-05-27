# CoStaff — 安裝與設定

> macOS、Ubuntu 共用同一套安裝程式。跑完短短的設定精靈，再裝上你要的專家 Agent 與通訊軟體 — 全部跑在你自己的機器上、走 Docker。

## 系統需求

| 項目 | 最低 | 建議 |
|---|---|---|
| 作業系統 | macOS 12+ / Ubuntu 20.04+ | macOS 14+ / Ubuntu 22.04+ |
| CPU | 2 vCPU（x86_64 或 ARM64） | 4 vCPU |
| 記憶體 | 8 GB | 16 GB |
| 硬碟 | 20 GB 可用 | 50 GB（保留給 Agent 工作目錄） |
| Python | 3.12（安裝程式會處理） | — |
| Docker | Engine 24+ / Desktop 4.30+ | — |
| LLM | Google API key、OpenAI 相容 endpoint，或本機 Ollama | — |

CoStaff 完全跑在你自己的機器上。對外只有你選的 LLM 服務，換成本機 Ollama 就完全不出網。

## 安裝

```bash
# macOS 或 Ubuntu
curl -fsSL https://raw.githubusercontent.com/costaff-ai/costaff/main/install.sh | bash
```

安裝程式會：

- 辨識作業系統（只支援 macOS 與 Ubuntu/Debian）。
- macOS 裝 Xcode CLT + Homebrew；Ubuntu 裝 `apt` 套件。
- 裝 Python 3.12（Homebrew 或 `deadsnakes` PPA）與 Docker。
- 把 `costaff-ai/costaff` clone 到 `~/.costaff/costaff/`。
- 在 `~/.costaff/.venv/` 建 venv 並裝好 CLI。
- 把 venv 寫入 `.zshrc` / `.bashrc`。

> **Ubuntu：** 安裝程式會把你加到 `docker` group。先登出再登入（或跑 `newgrp docker`）才能進下一步。

## 首次設定

```bash
source ~/.zshrc        # Ubuntu 改 ~/.bashrc
costaff onboard
```

精靈會問：

- **PostgreSQL URI** — 用預設值即可，會走內建的 Postgres 容器。
- **Model provider** — Google Gemini（需要 Google AI Studio API key）或 LiteLLM（OpenAI、Anthropic、Ollama 等）。
- **回覆語言** — 繁體中文、英文、日文、簡體中文。
- **時區** — 例：`Asia/Taipei`、`America/Los_Angeles`。
- **通訊軟體** — Telegram、Discord、LINE、WebChat、Email（之後也能再加）。

`ID_SALT`、`MCP_SECRET_KEY`、`API_HEADERS_KEY` 是自動產生的隨機 secret，不要改。

## 啟動 CoStaff

```bash
costaff start
```

分層啟動：Postgres → 已註冊的 Agent → Manager → Channels。第一次會 build image，之後走快取。

Manager 在 `http://localhost:18080`，WebChat 預設在 `http://localhost:18090`。

## 加入專家 Agent

### 從 GitHub 安裝

```bash
costaff agent add business-analysis \
  --github https://github.com/costaff-ai/costaff-agent-business-analysis

costaff agent add coding \
  --github https://github.com/costaff-ai/costaff-agent-coding
```

### 從本地路徑（開發用）

```bash
costaff agent add my-agent --local /path/to/my-agent
```

### 註冊遠端 A2A endpoint

```bash
costaff agent add partner-agent --url http://partner.example.com:8081
```

管理指令：`costaff agent list`、`costaff agent restart <name>`、`costaff agent rebuild <name>`、`costaff agent remove <name>`。

**每個 Agent 可以用自己的 model**：`costaff agent model <name>` 查詢或設定。

## 加入通訊軟體

```bash
# 瀏覽器版聊天介面（不需額外金鑰）
costaff channel add webchat

# Telegram bot（會問 TELEGRAM_BOT_TOKEN）
costaff channel add telegram
```

WebChat 在 `http://localhost:18090`。用 `costaff channel list` / `costaff channel remove <name>` 管理。

## 驗證安裝

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

curl http://localhost:18080/health
# → HTTP 200

curl http://localhost:18090/.well-known/agent-card.json
# → WebChat agent card
```

瀏覽器開 `http://localhost:18090` 就能開始對話。

## 問題排解

- **Docker permission denied（Ubuntu）** — 先登出再登入，或跑 `newgrp docker`。
- **Port 18080 / 18090 被佔用** — 在 `~/.costaff/costaff/.env` 改 `COSTAFF_AGENT_PORT` / `WEBCHAT_PORT`，再 `costaff restart`。
- **Agent 不健康** — 看 `docker logs costaff-agent-<name> --tail 50`。多半是 API key 沒設，修 `~/.costaff/costaff-agent/<name>/.env` 之後 `costaff agent rebuild <name>`。
- **整個重來** —
  ```bash
  costaff stop
  docker compose -f ~/.costaff/costaff/docker-compose.yaml down -v
  rm -rf ~/.costaff/workspace/*
  costaff start
  ```
- **還是卡住** — 到 https://github.com/costaff-ai/costaff/issues 開 issue，附上 `costaff doctor` 輸出。

## 下一步

- [AI 員工](https://costaffs.app/zhtw/agents/) — 5 個可以雇用的專家
- [技術架構](https://costaffs.app/zhtw/architecture/) — 6 層系統架構
- [應用架構](https://costaffs.app/zhtw/user-flow/) — 端到端流程圖
