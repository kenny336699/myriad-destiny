import { Solar } from 'lunar-typescript';

// 定義回傳給 UI 的資料介面
export interface CalendarData {
  dateString: string;     // 格式化後的西元時間 (e.g., 2025年11月29日 14時07分)
  lunarString: string;    // 農曆描述 (e.g., 乙巳年 十月 廿九)
  fourPillars: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  shenSha: {
    void: string;         // 空亡 (e.g., 辰巳)
    horse: string;        // 驛馬
    peach: string;        // 桃花
    noble: string;        // 貴人
  };
  dayStem: string;        // 日干 (用於起六神，e.g., "甲")
}

/**
 * 計算空亡 (旬空)
 * 口訣：甲子旬中戌亥空...
 * @param dayStem 日干
 * @param dayBranch 日支
 */
function getVoid(dayStem: string, dayBranch: string): string {
  // 天干數 (甲=1 ... 癸=10)
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  // 地支數 (子=1 ... 亥=12)
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  const stemIdx = stems.indexOf(dayStem) + 1;
  const branchIdx = branches.indexOf(dayBranch) + 1;

  // 計算旬空公式：(地支數 - 天干數)
  // 如果結果 <= 0，加 12
  let voidIdx = branchIdx - stemIdx;
  if (voidIdx <= 0) voidIdx += 12;

  // voidIdx 對應的是旬尾的前一位 (例如甲子旬，算出來是 11-1=10? 不對，簡單算法是地支-天干)
  // 讓我們用更直觀的查表法或偏移法
  // 簡單算法：(支 - 干) 的餘數決定旬首，但空亡是旬尾後兩位
  // 修正公式：(地支索引 - 天干索引)
  // 若 = 0 (子-甲=0) -> 戌亥
  // 若 = 2 (寅-甲=2) -> 子丑
  // 若 = 4 (辰-甲=4) -> 寅卯
  // 若 = 6 (午-甲=6) -> 辰巳
  // 若 = 8 (申-甲=8) -> 午未
  // 若 = 10 (戌-甲=10) -> 申酉
  
  // 處理負數 (e.g. 丑(1) - 乙(1) = 0) -> 注意 array index 是 0-9 和 0-11
  const sI = stems.indexOf(dayStem);
  const bI = branches.indexOf(dayBranch);
  
  let diff = bI - sI;
  if (diff < 0) diff += 12;

  switch (diff) {
    case 0: return "戌亥";
    case 2: return "子丑";
    case 4: return "寅卯";
    case 6: return "辰巳";
    case 8: return "午未";
    case 10: return "申酉";
    default: return "";
  }
}

/**
 * 計算驛馬 (以日支為主，年支為輔，這裡採六爻常用之日支)
 * 申子辰馬在寅，寅午戌馬在申，亥卯未馬在巳，巳酉丑馬在亥
 */
function getHorse(dayBranch: string): string {
  if (["申", "子", "辰"].includes(dayBranch)) return "寅";
  if (["寅", "午", "戌"].includes(dayBranch)) return "申";
  if (["亥", "卯", "未"].includes(dayBranch)) return "巳";
  if (["巳", "酉", "丑"].includes(dayBranch)) return "亥";
  return "";
}

/**
 * 計算桃花 (以日支為主)
 * 申子辰在酉，寅午戌在卯，亥卯未在子，巳酉丑在午
 */
function getPeach(dayBranch: string): string {
  if (["申", "子", "辰"].includes(dayBranch)) return "酉";
  if (["寅", "午", "戌"].includes(dayBranch)) return "卯";
  if (["亥", "卯", "未"].includes(dayBranch)) return "子";
  if (["巳", "酉", "丑"].includes(dayBranch)) return "午";
  return "";
}

/**
 * 計算貴人 (天乙貴人 - 以日干為主)
 * 口訣：甲戊庚牛羊，乙己鼠猴鄉，丙丁豬雞位，壬癸兔蛇藏，六辛逢馬虎
 */
function getNoble(dayStem: string): string {
  switch (dayStem) {
    case "甲":
    case "戊":
    case "庚":
      return "丑/未"; // 牛羊
    case "乙":
    case "己":
      return "子/申"; // 鼠猴
    case "丙":
    case "丁":
      return "亥/酉"; // 豬雞
    case "壬":
    case "癸":
      return "卯/巳"; // 兔蛇
    case "辛":
      return "午/寅"; // 馬虎
    default:
      return "";
  }
}

/**
 * 獲取完整的萬年曆資料
 * @param date Javascript Date 物件
 */
export function getGuaCalendarData(date: Date): CalendarData {
  // 1. 建立 Solar 物件
  const solar = Solar.fromDate(date);
  
  // 2. 轉為 Lunar (農曆/八字) 物件
  const lunar = solar.getLunar();
  
  // 3. 獲取四柱 (干支)
  // lunar-typescript 的 getYearInGanZhi() 等方法回傳的是 "甲子" 這樣的字串
  // 八字計算通常以「節氣」為準，lunar-typescript 預設 getBaZiYearInGanZhi() 就是精確的節氣八字
  const yearPillar = lunar.getYearInGanZhi();
  const monthPillar = lunar.getMonthInGanZhi();
  const dayPillar = lunar.getDayInGanZhi();
  const hourPillar = lunar.getTimeInGanZhi();

  // 4. 解析日柱的天干與地支 (用於神煞計算)
  const dayStem = dayPillar.substring(0, 1);   // 日干
  const dayBranch = dayPillar.substring(1, 2); // 日支

  // 5. 計算神煞
  const voidText = getVoid(dayStem, dayBranch);
  const horse = getHorse(dayBranch);
  const peach = getPeach(dayBranch);
  const noble = getNoble(dayStem);

  // 6. 格式化時間字串
  const formattedDate = `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${date.getHours()}時${date.getMinutes()}分`;
  const lunarString = `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}`;

  return {
    dateString: formattedDate,
    lunarString: lunarString,
    fourPillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
    },
    shenSha: {
      void: voidText,
      horse: horse,
      peach: peach,
      noble: noble,
    },
    dayStem: dayStem // 回傳日干，給 SixGods 模組使用
  };
}