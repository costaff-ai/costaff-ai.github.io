# CoStaff — 你的 AI 員工

專家 AI Agent 自動分工接力。每個跑在獨立 Docker 容器、呼叫 MCP 工具、透過 A2A 協定溝通。其中 6 個 repo 開源（含 Agent Template），其餘為私有艦隊 — 聯絡取得。

## 開源

### ❶ 商業分析 Agent

對應職位：商業分析師 / 簡報設計師。

把數據丟給它，自動挑對的圖表、寫好敘事、排出**支援中文字型**的精美 PDF/PPT — 不再用 Excel 拉醜醜的圖表，老闆要的週報直接交差。

- 自動選擇圖表類型 + 撰寫分析敘事
- 產出 PDF / PPT / PNG（中文字型完整支援）
- 排版精美，無需後製即可交付
- 自然語言追問與調整

### ❷ 程式開發 Agent

對應職位：資料工程師 / Python 工程師。

客戶寄來欄位亂、格式爛的 Excel？**30 分鐘手動清的活直接交給它**。寫 Python、跑運算、清資料，產出乾淨檔案 — 而且記得你上次的清洗規則，下次不用重講。

- CSV / Excel 資料清洗與格式轉換
- Python 程式撰寫與執行
- 資料運算與批次處理
- 工作空間檔案直接讀寫

### ❸ 資料庫 Agent

對應職位：資料分析師 / DBA。

想看數字**不用再排隊等工程師**。用白話文問「上個月哪個產品賣最好」，它自己摸資料庫、找對的表、跑出結果 — 你不需要知道 schema 長什麼樣子。

- 自然語言查詢，自動探索 schema
- 支援多種資料庫（PostgreSQL / MySQL ...）
- 跨資料庫聯合查詢
- 結構化結果輸出（JSON / CSV）

### ❹ Twinkle Hub Agent

對應職位：政府開放資料專員。

想撈政府開放資料？**不用再翻 19 個部會的網站**。用白話文問，它幫你找對的資料集（超過 52,960 筆），用 DuckDB SQL 在來源端撈剛好夠用的切片，存成乾淨的 CSV 還附上資料溯源，下游 Agent 直接接著用。

- 超過 52,960 筆政府開放資料、19 個領域
- DuckDB SQL 在資料來源端過濾
- 資料溯源 sidecar（機關、查詢、時間）
- 整理好的 CSV 自動交棒給商業分析 / 程式開發

### ❺ WrenAI GenBI Agent（OSS）

對應職位：自然語言 SQL 分析師。

用白話文問資料 — 它幫你寫 SQL、打到你自架的 WrenAI GenBI 服務跑、把答案回給你，必要時還附上圖表。引擎拒絕 SQL 時會自動透過 WrenAI 的 corrections API 重試一次。

- 一鍵自然語言 → SQL → 答案
- 可選 Vega-Lite v5 圖表規格輸出
- 透過 /v1/sql-corrections 自動修 SQL
- 驗證過的 Q/SQL 對寫回 few-shot 範例庫

### ❻ Agent Template

用 ADK + MCP 自己做專家、外掛自家工具，跑自家私有流程。

- 完整存取 CoStaff MCP 工具
- A2A 協定相容
- 自帶 LLM 模型
- 與內建 Agent 並存部署

## 私有艦隊（聯絡取得）

- **Gmail** — 信箱自動化：列 / 搜 / 讀 / 寫 / 標籤，`gmail.modify` scope（永不永久刪除）
- **Google Calendar** — 白話文查詢與編輯行事曆；相對時間靠真實 time tool 解析
- **Google Drive** — Drive 檔案管理 + Google Docs + Google Sheets 編輯，`drive.file` scope
- **Notion** — 走官方 hosted Notion MCP 的端到端 workspace 專員
- **RSS 訂閱** — 訂閱與整理 RSS / Atom feed、全文搜尋、starter pack
- **網路搜尋** — 公開網路與新聞搜尋、一行答案、URL 內容抽取（Tavily 後端）
- **人資招募** — 招募文件產出：JD、面試計畫、評分表、題庫
- **Kubernetes** — 官方 `kubectl-ai` MCP 上的叢集操作，寫操作需明確確認
- **Terraform** — Registry 搜尋、HCP TFE workspace 巡檢、gated plan / apply
- **飲食營養** — 減重 / 減脂顧問：照片＋文字記飲食、趨勢圖、依個人歷史回答
- **表格填寫（Fill-Table）** — .docx 範本 + PDF 附件 → 填好可直接送出的 PDF；17 欄位實測、中文 OK
- **瀏覽器操作（Browser Operator）** — Playwright 無頭瀏覽器；政府網站巡檢、標案追蹤
- **Builder** — 一句話 scaffold 新 Agent：clone → 產生 → 驗證 → push 全自動
- **醫療助理（Medical）** — 醫療領域問答助手

企業平台（ERP / CRM / HRM / SCM / PLM / 會計 / KMS / 專案 / 報銷 / 客服）各有配對的操作 Agent — 詳見[企業平台](https://costaffs.app/zhtw/platforms/)。

## 打造你自己的 Agent

從開源的 [Agent Template](https://github.com/costaff-ai/costaff-agent-template) 開始自行開發，或聯絡我們為你客製。

## 自動分工

老闆說「給我這季南區的銷售報告」 — 你不用一個一個叫 agent。資料庫 Agent 撈訂單 → 商業分析 Agent 排版，**一個對話框走完整條流程**。底層用 A2A 協定串接，Manager Agent 自動派工。

[完整 HTML 版本](https://costaffs.app/zhtw/agents/)
