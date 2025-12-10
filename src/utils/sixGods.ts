/**
 * 六神 (六獸) 排列邏輯
 * 口訣：甲乙起青龍，丙丁起朱雀，戊起勾陳，己起螣蛇，庚辛起白虎，壬癸起玄武
 */

const SIX_GODS_ORDER = ["青龍", "朱雀", "勾陳", "螣蛇", "白虎", "玄武"];

// 天干對應的起始偏移量
const STEM_OFFSET: Record<string, number> = {
  "甲": 0, "乙": 0, // 青龍起
  "丙": 1, "丁": 1, // 朱雀起
  "戊": 2,          // 勾陳起
  "己": 3,          // 螣蛇起
  "庚": 4, "辛": 4, // 白虎起
  "壬": 5, "癸": 5  // 玄武起
};

/**
 * 根據日干獲取六神陣列
 * @param dayStem 日干 (例如 "甲", "乙")
 * @returns 六神陣列 (從初爻到上爻)
 */
export function getSixGods(dayStem: string): string[] {
  const startIndex = STEM_OFFSET[dayStem];
  
  if (startIndex === undefined) {
    // 如果輸入錯誤，預設回傳一個空或錯誤陣列，這裡預設甲木
    return SIX_GODS_ORDER;
  }

  // 重新排列陣列
  // 例如從 2 (勾陳) 開始：[勾, 蛇, 白, 玄, 青, 朱]
  const result: string[] = [];
  for (let i = 0; i < 6; i++) {
    const index = (startIndex + i) % 6;
    result.push(SIX_GODS_ORDER[index]);
  }

  return result;
}