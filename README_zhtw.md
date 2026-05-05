# costaff-ai.github.io

[CoStaff](https://github.com/costaff-ai/costaff) 的公開產品介紹頁，透過 GitHub Pages 部署於 **https://costaff-ai.github.io/**。

---

## 儲存庫結構

```
costaff-ai.github.io/
├── index.html          # 英文版落地頁（預設）
├── index.zh.html       # 繁體中文落地頁
├── agents.html         # 英文版 agents 頁面
├── agents.zh.html      # 繁體中文 agents 頁面
├── deck.html           # 簡報 / Deck 頁面
├── images/             # 靜態圖片資源
└── scripts/            # 工具腳本（例如 Google Form 設定）
```

網站採用全頁捲動吸附（scroll-snap）設計，各區塊如下：

| 區塊 | 錨點 | 說明 |
|---|---|---|
| Hero | — | 主標語與行動呼籲按鈕 |
| 01 Why | `#problems` | 痛點對比與 CoStaff 解決方案 |
| 02 How | `#how` | 三步驟快速上手 |
| 03 CLI | `#cli` | `cst` 指令說明 |
| 04 Where | `#channels` | 支援的訊息平台（網頁聊天、Telegram、Discord、LINE、Slack）|
| 05 Plans | `#plans` | Open Source (OSS) + Advanced Plan（Starter / Pro / Max / Enterprise） |
| Partners | `#partners` | 合作社群 |
| 06 Your data | `#privacy` | 資料處理原則 |

---

## 編輯方式

頁面皆為獨立單一 HTML 檔案，所有 CSS 內嵌於 `<style>` 標籤中，無需任何建置工具或外部資源依賴。

1. 修改 `index.html` 更新英文版落地頁；同步將內容變更鏡射到 `index.zh.html`。
2. 修改 `agents.html` 更新 agents 頁面；同步鏡射到 `agents.zh.html`。
3. 推送至 `main` 分支 — GitHub Pages 會自動部署。

---

## 語言切換

導覽列包含語言切換按鈕：
- 英文頁連結至 `index.zh.html`
- 繁中頁連結至 `index.html`

---

## 部署

此儲存庫已設定為 GitHub Pages 站台。任何推送至 `main` 的提交都會觸發自動部署，無需 CI 或建置流程。
