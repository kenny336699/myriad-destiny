# 新增功能文檔

## 功能概述

本次更新為 I Ching (六爻起卦) 應用程式新增了兩項重要功能：

### 1. 線上擲骰/銅錢模擬 (Digital Coin Casting)

#### 功能說明

- **用途**：解決用戶手邊沒有銅錢的痛點
- **流程**：點擊按鈕三次模擬丟三枚銅錢，自動判斷陰陽（字/背），連續六次生成完整卦象
- **效果**：配合 CSS Animation 動畫效果，增加沈浸感

#### 技術實現

- **Hook**：`useCoinCasting()` - 管理銅錢擲卦狀態
- **組件**：`CoinCastingPanel` - 提供銅錢擲卦的 UI 介面
- **動畫**：使用 `animate-bounce` CSS 動畫模擬銅錢翻轉

#### 卦象對應規則

```
一次擲三枚銅錢（每枚有正反兩面）：
- 3個背 = 老陽(9) - 變爻 (會變成另一爻)
- 2個背 = 少陰(8) - 不變
- 1個背 = 少陽(7) - 不變
- 0個背 = 老陰(6) - 變爻 (會變成另一爻)
```

#### 使用流程

1. 在主介面點擊「💰 線上擲骰」按鈕
2. 進入銅錢擲卦介面
3. 點擊「擲卦」按鈕，模擬擲三枚銅錢（800ms 動畫）
4. 自動判斷結果並記錄
5. 重複 6 次得到完整卦象
6. 點擊「確認起卦」進入排盤結果頁面

---

### 2. 數字起卦/時間起卦 (Number & Time-Based Divination)

#### 功能說明

- **數字起卦**：輸入三個數字（1-9），自動計算卦象
  - 適用於「報數起卦」、「求簽號碼」等場景
- **時間起卦**：按當下時間（年月日時數）自動起卦
  - 無需手動輸入，點擊即可推算卦象
  - 適用於「擇日起卦」等場景

#### 技術實現

- **Hook**：
  - `useNumberBasedHexagram()` - 基於數字計算卦象
  - `useTimeBasedHexagram()` - 基於時間計算卦象
- **組件**：`NumberTimeInputPanel` - 提供標籤頁 UI 介面
- **算法**：

  ```typescript
  // 數字起卦
  sum = (num1 + num2 + num3 + index) % 6;
  yaoValue = 6 + (sum % 4);

  // 時間起卦
  sum = year + month + day + hour + index;
  yaoValue = 6 + (sum % 4);
  ```

#### 使用流程

**數字起卦**

1. 在主介面點擊「🔢 數字/時間起卦」按鈕
2. 保持「數字起卦」標籤頁（預設）
3. 輸入三個 1-9 的數字
4. 點擊「起卦」進入排盤結果頁面

**時間起卦**

1. 在主介面點擊「🔢 數字/時間起卦」按鈕
2. 切換至「時間起卦」標籤頁
3. 選擇或確認時間（預設為當前時刻）
4. 點擊「起卦」進入排盤結果頁面

---

## 檔案結構

### 新增文件

```
src/
├── hooks/
│   ├── useCoinCasting.ts           # 銅錢擲卦 Hook
│   └── useNumberTimeHexagram.ts    # 數字/時間起卦 Hook
├── components/
│   ├── CoinCastingPanel.tsx        # 銅錢擲卦 UI 組件
│   └── NumberTimeInputPanel.tsx    # 數字/時間起卦 UI 組件
└── app/
    └── page.tsx                    # 主應用頁面（已更新）
```

### 修改文件

- `src/app/page.tsx` - 整合新功能的主應用邏輯
- `src/components/InputPanel.tsx` - 新增兩個按鈕進入新功能

---

## API 說明

### useCoinCasting Hook

```typescript
const {
  yaoValues, // 生成的六爻值 (6, 7, 8, 9)
  tosses, // 擲卦記錄陣列 [{coins: [boolean], result: number}, ...]
  isAnimating, // 是否正在動畫
  isComplete, // 是否完成六爻擲卦
  castOnce, // 執行一次擲卦
  reset, // 重置狀態
} = useCoinCasting();
```

### useNumberBasedHexagram Hook

```typescript
const yaoValues = useNumberBasedHexagram([num1, num2, num3]);
// 返回計算出的六爻值陣列
```

### useTimeBasedHexagram Hook

```typescript
const yaoValues = useTimeBasedHexagram(date);
// 根據 Date 物件計算六爻值陣列
```

---

## 集成說明

### 在 page.tsx 中的整合

```typescript
// 1. 新增視圖模式
type ViewMode = "input" | "result" | "coin" | "numberTime";

// 2. 使用新 Hooks
const {
  yaoValues: coinYaoValues,
  tosses,
  isAnimating,
  isComplete: isCoinComplete,
  castOnce,
  reset: resetCoin,
} = useCoinCasting();

// 3. 處理完成回調
const handleCoinComplete = useCallback(() => {
  setYaoInputs(coinYaoValues);
  resetCopyStatus();
  setViewMode("result");
}, [coinYaoValues, resetCopyStatus]);

// 4. 根據視圖模式渲染不同組件
if (viewMode === "coin") {
  return <CoinCastingPanel ... />;
}
if (viewMode === "numberTime") {
  return <NumberTimeInputPanel ... />;
}
```

---

## 使用建議

### 何時使用各功能

1. **線上擲骰**

   - 用戶沒有實體銅錢
   - 希望快速體驗起卦流程
   - 想要視覺化的動畫效果

2. **數字起卦**

   - 有特定的數字序列（如簽號、報數）
   - 需要可重複的結果
   - 離線或無法使用時間戳的場景

3. **時間起卦**
   - 純粹根據當下時刻起卦
   - 最傳統的起卦方式
   - 需要時間戳驗證的場景

---

## 測試檢查清單

- [ ] 銅錢擲卦：動畫正常播放
- [ ] 銅錢擲卦：六次後自動完成
- [ ] 銅錢擲卦：完成後能進入排盤頁面
- [ ] 數字起卦：3 個數字輸入正常
- [ ] 數字起卦：卦象計算正確
- [ ] 時間起卦：時間選擇器正常
- [ ] 時間起卦：卦象計算正確
- [ ] UI：所有按鈕和輸入欄位工作正常
- [ ] 導航：能正確返回主界面

---

## 未來改進方向

1. **增強動畫**

   - 使用 React Spring 實現更複雜的動畫效果
   - 添加音效反饋

2. **功能擴展**

   - 支持保存起卦歷史記錄
   - 添加批量起卦模式
   - 支持自定義計算算法

3. **UX 優化**
   - 添加 Toast 通知
   - 實現深色模式
   - 響應式設計改進

---

## 常見問題

**Q: 銅錢擲卦的結果是否真正隨機？**
A: 是的，使用 JavaScript 的 `Math.random()` 函數，每次都有 50% 的概率產生正/反結果。

**Q: 數字起卦和時間起卦的算法是否符合傳統易學？**
A: 算法基於簡化的數學模式，確保可重複性。實際使用時可根據需要調整算法。

**Q: 能否在手機上使用？**
A: 可以，應用支援響應式設計，可在各種設備上使用。
