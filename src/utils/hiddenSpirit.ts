import { NAJIA_TABLE } from '../constants/najia';
import { SIX_RELATIONS_MAP } from '../constants/elementInteractions';
import { getPalaceElement } from '../constants/sixtyFourGua';

// 伏神資料結構
export interface HiddenSpirit {
  position: number; // 伏在第幾爻 (1-6)
  name: string;     // 六親 (e.g. 父母)
  stem: string;     // 天干
  branch: string;   // 地支
  element: string;  // 五行
}

// 八宮對應的本宮首卦 (八純卦) 二進制碼 (由下而上: 初爻->上爻)
// 這些是用來查 NAJIA_TABLE 的 Key
const PALACE_PURE_CODES: Record<string, string> = {
  "乾": "111111", // 乾為天
  "兌": "110110", // 兌為澤
  "離": "101101", // 離為火
  "震": "100100", // 震為雷
  "巽": "011011", // 巽為風
  "坎": "010010", // 坎為水
  "艮": "001001", // 艮為山
  "坤": "000000"  // 坤為地
};

/**
 * 輔助函式：計算單個純卦的所有六親分佈
 * @param palaceName 宮名 (e.g. "艮")
 * @returns 該宮首卦的 6 爻詳情 (包含六親)
 */
function getPureHexagramLines(palaceName: string) {
  const code = PALACE_PURE_CODES[palaceName];
  if (!code) return [];

  // 1. 取得本宮五行 (首卦的五行即為本宮五行)
  const palaceElement = getPalaceElement(palaceName);

  // 2. 取得納甲
  // 八純卦上下卦相同，直接切分
  const lowerCode = code.slice(0, 3); // 實際上八純卦前3碼與後3碼邏輯固定
  const upperCode = code.slice(3, 6);

  // 查表 (這裡使用 Type Assertion 避免 TS 索引錯誤)
  const lowerNajia = NAJIA_TABLE[lowerCode as keyof typeof NAJIA_TABLE]?.inner || [];
  const upperNajia = NAJIA_TABLE[upperCode as keyof typeof NAJIA_TABLE]?.outer || [];
  const fullNajia = [...lowerNajia, ...upperNajia];

  // 3. 算出六親
  return fullNajia.map((najia, index) => {
    // 查六親表
    const relation = SIX_RELATIONS_MAP[palaceElement]?.[najia.element] || "未知";
    return {
      position: index + 1,
      najia,
      relation
    };
  });
}

/**
 * 核心函式：查找伏神
 * @param palaceName 本卦所屬宮位 (e.g. "艮")
 * @param presentRelations 本卦中已經出現的所有六親陣列 (e.g. ["官鬼", "兄弟", "妻財"])
 * @returns 伏神列表 (如果有缺六親，會回傳對應的伏神物件)
 */
export function findHiddenSpirits(palaceName: string, presentRelations: string[]): HiddenSpirit[] {
  // 1. 定義完整的六親集合
  const ALL_RELATIONS = ["父母", "兄弟", "子孫", "妻財", "官鬼"];
  
  // 2. 找出缺失的六親
  // 使用 Set 來加速查找
  const presentSet = new Set(presentRelations);
  const missingRelations = ALL_RELATIONS.filter(r => !presentSet.has(r));

  // 如果六親齊全，直接回傳空陣列
  if (missingRelations.length === 0) {
    return [];
  }

  // 3. 獲取本宮首卦的所有爻 (作為伏神池)
  const pureLines = getPureHexagramLines(palaceName);

  const hiddenSpirits: HiddenSpirit[] = [];

  // 4. 針對每一個缺失的六親，去本宮首卦找
  missingRelations.forEach(missingRel => {
    // 規則：通常找本宮卦中該六親出現的位置。
    // 如果本宮卦中該六親出現多次，通常取第一順位或特定邏輯 (卜筮正宗通常取動爻或特定規則，
    // 但程式實作上，最標準做法是：本宮卦該六親在哪爻，就伏在哪爻下)
    
    const foundLine = pureLines.find(line => line.relation === missingRel);
    
    if (foundLine) {
      hiddenSpirits.push({
        position: foundLine.position, // 伏在第幾爻下
        name: missingRel,
        stem: foundLine.najia.stem,
        branch: foundLine.najia.branch,
        element: foundLine.najia.element
      });
    }
  });

  return hiddenSpirits;
}