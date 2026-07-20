<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="images/logo/lockup-vertical-dark.png" />
    <img src="images/logo/lockup-vertical.png" alt="CoStaff" width="300" />
  </picture>
</p>

# costaff-ai.github.io

[CoStaff](https://github.com/costaff-ai/costaff) 的公開產品介紹頁，透過 GitHub Pages 部署於 **https://costaffs.app**。

---

## 儲存庫結構

```
costaff-ai.github.io/
├── index.html                  # 英文首頁
├── zhtw/                       # 繁體中文版，完整鏡射整個目錄樹
│   └── …                       #   路徑相同，前綴 /zhtw
├── agents/                     # 產品 — AI 員工清單
├── manager/                    # 產品 — Manager Agent
├── channels/                   # 產品 — 通道
│   ├── webchat/
│   └── webchat-enterprise/
├── platforms/                  # 產品 — 業務平台
├── identity/                   # 產品 — 身分驗證 / SSO
├── architecture/               # 資源 — 技術架構圖
├── user-flow/                  # 資源 — 使用者應用架構圖
├── docs/                       # 文件 — 安裝、啟動、CLI、教學、驗證…
├── pricing/                    # 方案
├── blog/
├── partners/
│   ├── community/
│   └── enterprise/
├── deck.html                   # 獨立簡報頁
├── 404.html                    # 轉址頁
├── assets/
│   ├── site.js                 # 共用導覽列與頁尾注入器
│   └── site.css                # 共用外框樣式
├── images/
│   ├── logo/                   # 品牌資產 — favicon、OG 卡、lockup
│   └── architecture/           # 架構圖（SVG）
└── scripts/                    # 工具腳本（例如 Google Form 設定）
```

每個頁面都有雙語版本：英文在 `/<路徑>/`，繁體中文在 `/zhtw/<路徑>/`。

---

## 共用外框

`assets/site.js` 是導覽列、橫幅與頁尾的唯一真實來源，於執行期注入各頁面。
頁面只需要兩個佔位 div，加上樣式表與腳本：

```html
<link rel="stylesheet" href="/assets/site.css" />
<div id="cs-header"></div>
<!-- 頁面內容 -->
<div id="cs-footer"></div>
<script src="/assets/site.js"></script>
```

語言（`en` / `zhtw`）與當前導覽區塊會依 `location.pathname` 自動判斷，頁面無需任何設定。

> `index.html` 與 `zhtw/index.html` 使用自己的 inline 頁尾，不吃注入版 —— 修改頁尾時兩處都要改。

---

## 首頁區塊

`index.html` 採用 scroll-snap 單頁式版面：

| 區塊 | 錨點 | 說明 |
|---|---|---|
| Hero | — | 標語與行動呼籲 |
| Watch | `#demo` | 30 秒介紹影片 |
| 01 Sound familiar? | `#problems` | CoStaff 解決的痛點 |
| 02 How it works | `#flow` | AI 員工團隊的任務交接流程 |
| 03 System architecture | `#architecture` | 六層架構，各層可獨立替換 |
| 04 Getting started | `#how` | 只需 Docker 的安裝流程 |
| 05 One command for everything | `#cli` | `costaff` CLI 指令說明 |
| 06 Where it lives | `#channels` | 支援的通訊通道 |
| 07 Plans | `#plans` | 開源版與付費方案 |
| 08 Partners | `#partners` | 合作夥伴社群 |
| 09 Your data | `#privacy` | 資料處理承諾 |
| Ready when you are | `#start` | 結尾行動呼籲 |

---

## 品牌資產

所有品牌檔案位於 `images/logo/`：

| 檔案 | 用途 |
|---|---|
| `mark.svg` | 純圖示，真向量 —— 導覽列與頁尾 lockup |
| `favicon.svg` | 筆畫加粗版圖示，確保小尺寸下的辨識度 |
| `favicon.ico` | 多解析度（16–256px）；16/32px 使用加粗版 |
| `apple-touch-icon.png` | 180×180，iOS 主畫面圖示 |
| `icon-192.png` / `icon-512.png` | PWA / Android 圖示尺寸 |
| `og.png` | 1200×630 社群分享卡 |
| `lockup-vertical.png` | 直式 lockup，深色文字 —— 淺色背景用 |
| `lockup-vertical-dark.png` | 直式 lockup，白色文字 —— 深色背景用 |

原始設計檔存放於本儲存庫之外的 `costaff-logo/`。

---

## 編輯方式

各頁面自帶 inline `<style>`，沒有建置步驟，也沒有打包工具。

1. 先改英文頁，再把變更鏡射到對應的 `/zhtw/` 頁面。
2. 導覽列與頁尾的變更一律只改 `assets/site.js`，不要逐頁改。
3. 推送到 `main`，GitHub Pages 會自動部署。

---

## 部署

GitHub Pages 搭配自訂網域（`CNAME` → `costaffs.app`）。推送到 `main` 即自動部署，
不需要 CI 或建置流程。
