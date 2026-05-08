# CoStaff — 技術架構

> 六層分工，每層都可獨立替換或擴展。部署視角：Docker 容器、Manager Agent 編排、5 個專家 Agent + MCP 工具、PostgreSQL + 共享 Volume，以及外部 LLM API 層 — 所有東西都跑在使用者自家機器上。

CoStaff 不是單一巨型 AI，而是多個 Agent + 工具串接而成的協作系統。每層都跑在自己的容器、各自負責一件事，可以獨立替換或加新組件。

## 使用者 / USER

在通訊軟體裡用一句話交辦任務 — 你只負責下指令、收成品。

## 通訊軟體 / CHANNELS

WebChat ・ Telegram ・ LINE ・ Discord ・ Slack — 每個 channel 跑在獨立 Docker 容器。同一組 agents、多個通訊軟體共用對話狀態。

## 編排層 / MANAGER

**Manager Agent** — 解析意圖、記憶對話、分派多 agent 工作 (透過 A2A Protocol)。讓你說一句話就能讓專家自動接力的協調者。

## 專家 / SPECIALISTS

商業分析 ・ 程式 ・ 資料庫 ・ Twinkle Hub ・ **Custom Agent with MCP Server** — 每個 agent 跑在獨立容器。Manager 透過 A2A 派工，專家透過 MCP 呼叫工具完成實際任務。

## 資料 / DATA

PostgreSQL + Shared Workspace — per-agent 永續儲存。對話記憶存在 PostgreSQL，檔案產出存在共享 workspace volume。

## LLM

Gemini ・ Gemma ・ Twinkle T1 ・ 第三方模型 — 每個 agent 可獨立配置。每位專家可用不同 LLM，選用本地模型可完全離線執行。

## 設計理念

- **獨立替換** — 任一層可單獨換掉，不影響其他層
- **可插拔** — 用 Docker service 加新 agent / 新通道 / 新 LLM
- **Marketplace 友善** — 第三方 agent 可透過 A2A 註冊加入編排

## 圖表

- 完整 SVG: https://costaffs.app/images/architecture/01-tech-architecture.svg
- HTML 版本: https://costaffs.app/zhtw/architecture/
- 使用者應用架構圖: https://costaffs.app/zhtw/user-flow/
