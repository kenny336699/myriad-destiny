export const NAJIA_TABLE = {
  // ☰ 乾卦 (全陽)
  "1,1,1": {
    name: "乾",
    familyElement: "金", // 本宮五行 (用於判斷六親)
    inner: [ // 作為下卦時 (初、二、三爻)
      { stem: "甲", branch: "子", element: "水" },
      { stem: "甲", branch: "寅", element: "木" },
      { stem: "甲", branch: "辰", element: "土" }
    ],
    outer: [ // 作為上卦時 (四、五、上爻)
      { stem: "壬", branch: "午", element: "火" },
      { stem: "壬", branch: "申", element: "金" },
      { stem: "壬", branch: "戌", element: "土" }
    ]
  },

  // ☱ 兌卦 (下陽、中陽、上陰)
  "1,1,0": {
    name: "兌",
    familyElement: "金",
    inner: [
      { stem: "丁", branch: "巳", element: "火" },
      { stem: "丁", branch: "卯", element: "木" },
      { stem: "丁", branch: "丑", element: "土" }
    ],
    outer: [
      { stem: "丁", branch: "亥", element: "水" },
      { stem: "丁", branch: "酉", element: "金" },
      { stem: "丁", branch: "未", element: "土" }
    ]
  },

  // ☲ 離卦 (下陽、中陰、上陽)
  "1,0,1": {
    name: "離",
    familyElement: "火",
    inner: [
      { stem: "己", branch: "卯", element: "木" },
      { stem: "己", branch: "丑", element: "土" },
      { stem: "己", branch: "亥", element: "水" }
    ],
    outer: [
      { stem: "己", branch: "酉", element: "金" },
      { stem: "己", branch: "未", element: "土" },
      { stem: "己", branch: "巳", element: "火" }
    ]
  },

  // ☳ 震卦 (下陽、中陰、上陰)
  "1,0,0": {
    name: "震",
    familyElement: "木",
    inner: [
      { stem: "庚", branch: "子", element: "水" },
      { stem: "庚", branch: "寅", element: "木" },
      { stem: "庚", branch: "辰", element: "土" }
    ],
    outer: [
      { stem: "庚", branch: "午", element: "火" },
      { stem: "庚", branch: "申", element: "金" },
      { stem: "庚", branch: "戌", element: "土" }
    ]
  },

  // ☴ 巽卦 (下陰、中陽、上陽)
  "0,1,1": {
    name: "巽",
    familyElement: "木",
    inner: [
      { stem: "辛", branch: "丑", element: "土" },
      { stem: "辛", branch: "亥", element: "水" },
      { stem: "辛", branch: "酉", element: "金" }
    ],
    outer: [
      { stem: "辛", branch: "未", element: "土" },
      { stem: "辛", branch: "巳", element: "火" },
      { stem: "辛", branch: "卯", element: "木" }
    ]
  },

  // ☵ 坎卦 (下陰、中陽、上陰)
  "0,1,0": {
    name: "坎",
    familyElement: "水",
    inner: [
      { stem: "戊", branch: "寅", element: "木" },
      { stem: "戊", branch: "辰", element: "土" },
      { stem: "戊", branch: "午", element: "火" }
    ],
    outer: [
      { stem: "戊", branch: "申", element: "金" },
      { stem: "戊", branch: "戌", element: "土" },
      { stem: "戊", branch: "子", element: "水" }
    ]
  },

  // ☶ 艮卦 (下陰、中陰、上陽)
  "0,0,1": {
    name: "艮",
    familyElement: "土",
    inner: [
      { stem: "丙", branch: "辰", element: "土" },
      { stem: "丙", branch: "午", element: "火" },
      { stem: "丙", branch: "申", element: "金" }
    ],
    outer: [
      { stem: "丙", branch: "戌", element: "土" },
      { stem: "丙", branch: "子", element: "水" },
      { stem: "丙", branch: "寅", element: "木" }
    ]
  },

  // ☷ 坤卦 (全陰)
  "0,0,0": {
    name: "坤",
    familyElement: "土",
    inner: [
      { stem: "乙", branch: "未", element: "土" },
      { stem: "乙", branch: "巳", element: "火" },
      { stem: "乙", branch: "卯", element: "木" }
    ],
    outer: [
      { stem: "癸", branch: "丑", element: "土" },
      { stem: "癸", branch: "亥", element: "水" },
      { stem: "癸", branch: "酉", element: "金" }
    ]
  }
};
export type InputCode = 0 | 1 | 2 | 3;

export interface NajiaInfo {
  stem: string;
  branch: string;
  element: string;
}
