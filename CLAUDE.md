# 生管系統儀表板 v2

## 專案概覽

- **網址**：https://prod-dashboard.zeabur.app
- **GitHub**：https://github.com/Johnny6891/production-dashboard
- **Docker image**：`ghcr.io/johnny6891/production-dashboard:latest`
- **詳細部署資訊**：見 `生管系統儀表板-v2-部署摘要.md`

---

## 技術棧

| 層級 | 技術 |
|------|------|
| 前端 | React 18 + Vite（`client/`） |
| 後端 | Node.js + Express（port 3000） |
| 資料庫 | PostgreSQL（待辦事項） |
| 試算表 | Google Sheets API v4（Service Account） |
| 部署 | Zeabur（GHCR Prebuilt Docker image） |

---

## 架構

```
生管系統儀表板-v2/
├── server.js              # Express 主程式
├── config.js              # 設定檔
├── Dockerfile             # Node 20 Alpine
├── routes/
│   ├── dashboard.js       # GET /api/dashboard
│   └── todos.js           # CRUD /api/todos
├── services/
│   ├── sheetsService.js   # Google Sheets（15 分鐘快取）
│   └── dbService.js       # PostgreSQL pool
└── client/src/
    ├── App.jsx
    ├── api.js
    └── components/
        ├── DataCard.jsx
        ├── LinksGrid.jsx        # 備用（目前未使用，連結已移至 Navbar modal）
        ├── Navbar.jsx           # 含問候語、日期、待辦顯示、常用系統按鈕與彈窗
        └── TodoList.jsx
```

---

## Zeabur 服務資訊

| 項目 | 值 |
|------|-----|
| 專案 ID | `69b8ebccc6239dfce66de90e` |
| 服務 ID | `69c249b582fb34707a9e3376` |
| 環境 ID | `69b8ebcc6853f6f4f5f6b459`（production） |

---

## 部署流程

1. 修改程式碼 → `git push`
2. GitHub Actions 自動 build image 推送到 GHCR
3. Zeabur Dashboard → 服務 → **重啟目前版本**（等同 restart service）

---

## 注意事項

- API 憑證禁止用 `VITE_` 前綴，一律走後端 proxy
- Google Service Account 用 `GOOGLE_SERVICE_ACCOUNT_JSON`（JSON 字串），不用 PATH
- Zeabur Prebuilt 服務用 `restartService`，不是 `redeployService`
- Navbar 待辦區與內容區對齊：統一使用 `--content-width: min(1200px, 95vw)`，套用於 `.nav-todos-wrapper` 與 `.section-width`

---

## 最近更新（2026-03-25）

- 完成常用系統導航彈窗化、按鈕左側外掛定位、連結垂直排列與新增「同事需求管理系統」。
- 修正 nav 與內容區寬度偏差，確認已對齊。
- 版本已推送並部署：commit `1fa5adef94f736f47c5ddddbf30dc7f170b7b2`，Actions run `23525892240` 成功，Zeabur 以「重啟目前版本」套用。
- 新增「2F 生產排程甘特圖」二層彈窗（含 README / 連結子按鈕），排列於同事需求管理系統下方。
- 新增「週工時統計系統」二層彈窗（README / 連結）。
- 新增「報工異動記錄系統」常用系統按鈕。
- 更新「2F 生產排程甘特圖」子按鈕「連結」URL。

---

## 常用系統導航（連結清單）

定義於 `config.js` 的 `LINKS` 陣列，由 `Navbar.jsx` 讀取並在彈窗中垂直顯示。

| 順序 | 名稱 | 說明 |
|------|------|------|
| 1 | 生管常用頁面 | Gamma 文件頁面 |
| 2 | 1F-訂單排程系統 | GAS 1F 排程 |
| 3 | 2F-訂單排程系統 | GAS 2F 排程 |
| 4 | 同事需求管理系統 | https://colleague-request-system.vercel.app/ |
| 5 | 週工時統計系統 | 二層彈窗：README（Notion）/ 連結（GAS） |
| 6 | 2F 生產排程甘特圖 | 二層彈窗：README（Notion）/ 連結（GAS） |
| 7 | 報工異動記錄系統 | GAS 網頁 |

> `週工時統計系統` 與 `2F 生產排程甘特圖` 皆有 `children` 欄位，Navbar.jsx 偵測到後顯示二層子彈窗。

### 二層彈窗 URL（最新）

- 週工時統計系統 / README: https://www.notion.so/32eee389af1a80fda286cbd0c0ed0b51
- 週工時統計系統 / 連結: https://script.google.com/macros/s/AKfycbxXBygTXFMSQkK44E3qgAe8S8Jh0cbNYaU60YfhG5xryOpdgDLndyan854duOygJ68fRA/exec
- 2F 生產排程甘特圖 / README: https://www.notion.so/2F-grmini-32eee389af1a80dd9a9efb433cf131af
- 2F 生產排程甘特圖 / 連結: https://script.google.com/macros/s/AKfycbzEbqKpehL8gEquD5vLmlEnsJN2CjHWb1fBHEiLFCtk4Xf1jc4LHUy5kteSfaWS_0WZ/exec
