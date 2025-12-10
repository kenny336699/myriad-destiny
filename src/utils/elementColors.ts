// 天干五行对应
const STEM_ELEMENTS: Record<string, string> = {
  "甲": "木", "乙": "木",
  "丙": "火", "丁": "火",
  "戊": "土", "己": "土",
  "庚": "金", "辛": "金",
  "壬": "水", "癸": "水"
};

// 地支五行对应
const BRANCH_ELEMENTS: Record<string, string> = {
  "子": "水", "亥": "水",
  "寅": "木", "卯": "木",
  "巳": "火", "午": "火",
  "申": "金", "酉": "金",
  "辰": "土", "戌": "土", "丑": "土", "未": "土"
};

// 五行颜色映射
export const ELEMENT_COLORS: Record<string, string> = {
  "金": "text-yellow-600",
  "木": "text-green-600",
  "水": "text-blue-600",
  "火": "text-red-600",
  "土": "text-amber-700"
};

export function getStemColor(stem: string): string {
  const element = STEM_ELEMENTS[stem];
  return element ? ELEMENT_COLORS[element] : "text-stone-500";
}

export function getBranchColor(branch: string): string {
  const element = BRANCH_ELEMENTS[branch];
  return element ? ELEMENT_COLORS[element] : "text-stone-500";
}
