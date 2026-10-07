# 天芽 T.I.A.N.Y.A.｜角色設定與創作直播

[公開網站](https://skymiku39.github.io/tianya-origin-archive/)

天芽的單頁介紹：軍方原型機、博物館封存與重啟脫逃，以及開始創作與技術實作直播的原因。使用創作者的原始像素素材，沒有套用生成角色圖。

## 本版內容

- 保留章節網址：`#top`、`#dossier`、`#history`、`#architecture`、`#streaming`。
- 天樞—緹亞為兔形策略核心，初芽—恩雅為人型載體；合體稱為天芽，以恩雅人格主導。
- 正文直接顯示；沒有啟動彈窗、折疊故事、複製介紹按鈕或假頻道連結。
- 像素插畫配上可讀的中文黑體、深藍灰、薄荷綠及紫色。原圖完整呈現，文字不覆蓋角色。
- 手機雙核上下排列。所有內容不依賴 JavaScript；JS 只標示目前章節。
- 沒有後端、第三方套件、外部字型、分析追蹤或自動播放素材。

## 素材與創作規範

| 網站資產 | 創作者來源 | 處理 |
| --- | --- | --- |
| `assets/tianya-pixel-portrait.png` | `image.png` | 原檔副本，首頁與分享預覽 |
| `assets/tianya-stream-room.png` | `260709_stream.png` | 原檔副本，創作直播段落 |
| `assets/enya-original-still.png` | `260727_skymiku_v02.gif` | 僅提取第一影格 |
| `assets/tia-original-still.png` | `tutu.gif` | 僅提取第一影格 |

來源素材目錄維持唯讀。靜態影格沒有重繪、補畫或生成式處理。原圖的房間道具、背景線路與 Q 版比例不另行解釋為角色能力或機構。

依最新指示停止角色生圖。先前樣張保留在本機 `assets/generated/`、`assets/previews/` 與四個 WebP 實驗檔，由 `.gitignore` 排除，不上傳或發布。歷史提示詞保留於 `docs/image-generation*.json`，不是現行設定。

素材雜湊與處理紀錄見 [docs/source-assets.json](docs/source-assets.json)。未宣告開源授權；此儲存庫公開不等於授權他人使用角色或原始美術。

## 本機預覽與檢查

不需安裝套件。Node.js 執行：

```powershell
node scripts/preview.mjs
node --test
```

預覽 [http://127.0.0.1:4174/](http://127.0.0.1:4174/)。預覽伺服器只提供網站必要檔案，不會提供設定文件、Git 資料或生成草稿。以 `?js=off` 可在該次預覽回應用 CSP 停用 JavaScript，檢查原生閱讀與導覽；這不會修改瀏覽器全域設定。

也可直接開啟 `index.html`，或使用任何靜態伺服器。GitHub Pages 沿用 `main` 分支根目錄發布，沒有編譯步驟。

## 設定與維護

- [角色規格](docs/CHARACTER-SPEC.md)：最新的人格、外觀與機構確認。
- [設定與文案來源](docs/SETTING-AND-DESIGN.md)：原稿、後續確認與直播銜接。
- [設計及驗收紀錄](docs/DESIGN-REVIEW.md)：本版範圍、實作與檢查結果。

後續文案以創作者最新回覆優先，不用舊生成提示詞補寫世界觀。頻道、排程或其他資料尚未提供時，不建立佔位連結。
