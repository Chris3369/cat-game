# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案說明

Web 迷宮遊戲。玩家控制一張紙在隨機生成的迷宮中移動，與貓咪互動並完成關卡。

- **線上遊玩**：https://chris3369.github.io/cat-game/
- **Repository**：git@github.com:Chris3369/cat-game.git

## 技術棧

- 純 HTML / CSS / JavaScript（無框架、無建置工具）
- 迷宮渲染：Canvas API
- 部署：GitHub Pages（master branch 根目錄）

## 建置與執行

不需要任何建置步驟，直接用瀏覽器開啟 `index.html` 即可在本機執行。

發布更新：
```bash
git add -A
git commit -m "..."
git push
```

## 專案架構

```
game/
├── index.html         # HTML 骨架（狀態列、canvas、玩家、對話框）
├── style.css          # 樣式與動畫
├── assets/
│   └── mix.png        # 玳瑁貓圖片
└── js/
    ├── main.js        # 進入點、鍵盤輸入（方向鍵 / WASD）
    ├── gameState.js   # 全域狀態管理（HP / MP / 關卡 / 計時器）
    ├── maze.js        # 迷宮生成（Recursive Backtracking）+ Canvas 渲染
    ├── player.js      # 玩家移動、事件觸發順序
    └── dialog.js      # 對話框系統（玳瑁貓 / 橘貓 / Game Over / 過關）
```

## 遊戲規則

- **角色**：HP 5、MP 10（稱為「乾乾」），每 10 秒恢復 1 點
- **玳瑁貓**：隨機出現，給 2 乾乾得愛心，拒絕則 HP -1
- **橘貓**（死路）：走入死路時乾乾歸零
- **過關條件**：HP > 0 抵達出口，進入下一關，HP / MP 重置
- **Game Over**：HP ≤ 0

## 迷宮參數

- 初始尺寸：13×13，每關 +3（第 2 關 16×16，以此類推）
- 格子大小：48px（`CELL_SIZE`，定義於 `js/maze.js`）
- 玳瑁貓密度：約 5%，至少 1 隻，不出現在起點 / 出口 / 死路
