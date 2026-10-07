# 天芽 T.I.A.N.Y.A.｜角色與直播介紹

天芽的單頁角色介紹網站：從軍方分離式雙核戰術原型機、博物館展示品與脫逃，接到她選擇以直播繼續輸出、交流與體驗日常的故事。

公開頁面：[天芽的角色與直播介紹](https://skymiku39.github.io/tianya-origin-archive/)

## 內容

- 天芽的原始名稱、設計定位與性格反差
- 天樞—緹亞（Brain）與初芽—恩雅（Frame）的雙核介紹
- 軍方、博物館、脫逃與流浪四階段起源
- 為什麼開始直播，以及可複製的簡短自我介紹
- 可重播的啟動紀錄與鍵盤可操作的雙核分頁

本版以創作者原稿為基礎，收回先前擴寫的硬體規則、事件細節與額外人際背景。直播銜接是本次為介紹頁撰寫的文案；未指定的頻道網址、節目表與觀眾稱呼不填入假資料。

## 素材

網站使用創作者提供的既有素材副本：

| 專案資產 | 來源檔名 | 用途 |
| --- | --- | --- |
| assets/tianya-pixel-portrait.png | image.png | 天芽像素插畫 |
| assets/tianya-stream-room.png | 260709_stream.png | 直播待機畫面 |

來源目錄只供讀取；複製到專案的檔案未經生成式 AI 處理。本版未生成圖片。今後若使用生成式 AI，依創作者要求採「參考圖片 → 文字描述 → 純文字生成圖片」，不將參考圖傳入生成工具。

## 預覽

直接開啟 index.html，或在專案目錄啟動靜態伺服器：

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

前往 http://127.0.0.1:4173/。本專案不需要建置工具或外部套件。

## 專案結構

```text
.
├── assets/
│   ├── tianya-pixel-portrait.png
│   └── tianya-stream-room.png
├── app.js
├── docs/
│   ├── DESIGN-REVIEW.md
│   └── SETTING-AND-DESIGN.md
├── index.html
└── styles.css
```

設定來源與文案見 docs/SETTING-AND-DESIGN.md；本次調整原則見 docs/DESIGN-REVIEW.md。
