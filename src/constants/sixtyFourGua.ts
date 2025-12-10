export interface Hexagram {
  name: string;
  palace: string;
  element: string;
  shi: number;
}

export function getPalaceElement(palaceName: string): string {
  const map: Record<string, string> = {
    "乾": "金", "兌": "金", "離": "火", "震": "木", 
    "巽": "木", "坎": "水", "艮": "土", "坤": "土"
  };
  return map[palaceName] || "土";
}
export const HEXAGRAMS_TABLE: Record<string, Hexagram> = {

  // 乾宮
  "111111": { name: "乾為天", palace: "乾", element: "金", shi: 6 },
  "011111": { name: "天風姤", palace: "乾", element: "金", shi: 1 },
  "001111": { name: "天山遯", palace: "乾", element: "金", shi: 2 },
  "000111": { name: "天地否", palace: "乾", element: "金", shi: 3 },
  "000011": { name: "風地觀", palace: "乾", element: "金", shi: 4 },
  "000001": { name: "山地剝", palace: "乾", element: "金", shi: 5 },
  "000101": { name: "火地晉", palace: "乾", element: "金", shi: 4 },
  "111101": { name: "火天大有", palace: "乾", element: "金", shi: 3 },

  // 兌宮
  "110110": { name: "兌為澤", palace: "兌", element: "金", shi: 6 },
  "010110": { name: "澤水困", palace: "兌", element: "金", shi: 1 },
  "000110": { name: "澤地萃", palace: "兌", element: "金", shi: 2 },
  "001110": { name: "澤山咸", palace: "兌", element: "金", shi: 3 },
  "001010": { name: "水山蹇", palace: "兌", element: "金", shi: 4 },
  "001000": { name: "地山謙", palace: "兌", element: "金", shi: 5 },
  "001100": { name: "雷山小過", palace: "兌", element: "金", shi: 4 },
  "110100": { name: "雷澤歸妹", palace: "兌", element: "金", shi: 3 },

  // 離宮
  "101101": { name: "離為火", palace: "離", element: "火", shi: 6 },
  "001101": { name: "火山旅", palace: "離", element: "火", shi: 1 },
  "011101": { name: "火風鼎", palace: "離", element: "火", shi: 2 },
  "010101": { name: "火水未濟", palace: "離", element: "火", shi: 3 },
  "010001": { name: "山水蒙", palace: "離", element: "火", shi: 4 },
  "010011": { name: "風水渙", palace: "離", element: "火", shi: 5 },
  "010111": { name: "天水訟", palace: "離", element: "火", shi: 4 },
  "101111": { name: "天火同人", palace: "離", element: "火", shi: 3 },

  // 震宮
  "100100": { name: "震為雷", palace: "震", element: "木", shi: 6 },
  "000100": { name: "雷地豫", palace: "震", element: "木", shi: 1 },
  "010100": { name: "雷水解", palace: "震", element: "木", shi: 2 }, 
  "011100": { name: "雷風恆", palace: "震", element: "木", shi: 3 },
  "011000": { name: "地風升", palace: "震", element: "木", shi: 4 },
  "011010": { name: "水風井", palace: "震", element: "木", shi: 5 },
  "011110": { name: "澤風大過", palace: "震", element: "木", shi: 4 },
  "100110": { name: "澤雷隨", palace: "震", element: "木", shi: 3 },

  // 巽宮
  "011011": { name: "巽為風", palace: "巽", element: "木", shi: 6 },
  "111011": { name: "風天小畜", palace: "巽", element: "木", shi: 1 },
  "101011": { name: "風火家人", palace: "巽", element: "木", shi: 2 },
  "100011": { name: "風雷益", palace: "巽", element: "木", shi: 3 },
  "100111": { name: "天雷無妄", palace: "巽", element: "木", shi: 4 },
  "100101": { name: "火雷噬嗑", palace: "巽", element: "木", shi: 5 },
  "100001": { name: "山雷頤", palace: "巽", element: "木", shi: 4 },
  "011001": { name: "山風蠱", palace: "巽", element: "木", shi: 3 },

// ================= 6. 坎宮 (屬水) =================
  "010010": { name: "坎為水", palace: "坎", element: "水", shi: 6 },
  "110010": { name: "水澤節", palace: "坎", element: "水", shi: 1 }, 
  "100010": { name: "水雷屯", palace: "坎", element: "水", shi: 2 },
  "101010": { name: "水火既濟", palace: "坎", element: "水", shi: 3 },
  "101110": { name: "澤火革", palace: "坎", element: "水", shi: 4 },
  "101100": { name: "雷火豐", palace: "坎", element: "水", shi: 5 },
  "101000": { name: "地火明夷", palace: "坎", element: "水", shi: 4 }, 
  "010000": { name: "地水師", palace: "坎", element: "水", shi: 3 }, // 修正 Key

  // 艮宮
  "001001": { name: "艮為山", palace: "艮", element: "土", shi: 6 },
  "101001": { name: "山火賁", palace: "艮", element: "土", shi: 1 },
  "111001": { name: "山天大畜", palace: "艮", element: "土", shi: 2 },
  "110001": { name: "山澤損", palace: "艮", element: "土", shi: 3 },
  "110101": { name: "火澤睽", palace: "艮", element: "土", shi: 4 },
  "110111": { name: "天澤履", palace: "艮", element: "土", shi: 5 },
  "110011": { name: "風澤中孚", palace: "艮", element: "土", shi: 4 },
  "001011": { name: "風山漸", palace: "艮", element: "土", shi: 3 },

// ================= 坤宮 (屬土) =================
  "000000": { name: "坤為地", palace: "坤", element: "土", shi: 6 },
  "100000": { name: "地雷復", palace: "坤", element: "土", shi: 1 },
  "110000": { name: "地澤臨", palace: "坤", element: "土", shi: 2 },
  "111000": { name: "地天泰", palace: "坤", element: "土", shi: 3 },
  "111100": { name: "雷天大壯", palace: "坤", element: "土", shi: 4 },
  "111110": { name: "澤天夬", palace: "坤", element: "土", shi: 5 },
  "111010": { name: "水天需", palace: "坤", element: "土", shi: 4 }, 
  "000010": { name: "水地比", palace: "坤", element: "土", shi: 3 }
};