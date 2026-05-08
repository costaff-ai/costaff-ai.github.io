# CoStaff — 使用者應用架構圖

> 應用視角：以「一筆使用者請求」為主軸，展示一筆完整對話如何穿透五層架構 — 通訊軟體 → 編排層 → 專家 Agent → 工具 → 資料層 → 回到使用者。

## 對話範例

**YOU**：幫我看 Q3 銷售，做成 PDF 給我

**MANAGER**：收到。我先請 DB Agent 查資料，再請 BA Agent 做 PDF。*(Routing: DB → BA)*

**DB AGENT**：SQL 查 Q3 銷售 → 取回 12,345 筆。*(via MCP · PostgreSQL)*

**BA AGENT**：產出圖表 + 寫敘述 → 排版成 PDF。*(via MCP · PDF/Chart tool)*

**YOU ◀**：📎 Q3-report.pdf — 完成，回到聊天視窗。

## 技術上發生了什麼

1. 使用者在通訊軟體（如 Telegram bot）發訊息
2. Channel adapter 透過 A2A 轉發給 Manager Agent
3. Manager 解析意圖：「需要 DB 查詢 + 報告產出」
4. Manager 透過 A2A 呼叫 DB Agent：「撈 Q3 銷售」
5. DB Agent 透過 MCP 工具查 PostgreSQL → 取回 12,345 筆
6. DB Agent 把資料回傳 Manager
7. Manager 透過 A2A 呼叫 BA Agent：「做成 PDF」
8. BA Agent 透過 MCP 工具產圖表 + 寫敘事 + 渲染 PDF
9. BA Agent 把 Q3-report.pdf 回傳 Manager
10. Manager 透過 channel adapter 轉發 → 使用者在聊天視窗看到 PDF

使用者觸點：1 條訊息進、1 個檔案出。Agent 接力：4 次。MCP 工具呼叫：~3-5 次。

## 圖表

- 完整 SVG 序列圖: https://costaffs.app/images/architecture/02-app-architecture.svg
- HTML 版本: https://costaffs.app/zhtw/user-flow/
- 系統架構: https://costaffs.app/zhtw/architecture/
