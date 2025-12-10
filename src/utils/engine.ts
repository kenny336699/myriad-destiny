import { NAJIA_TABLE, NajiaInfo } from '../constants/najia';
import { HEXAGRAMS_TABLE, getPalaceElement, Hexagram } from '../constants/sixtyFourGua';
import { SIX_RELATIONS_MAP } from '../constants/elementInteractions';
import { findHiddenSpirits } from './hiddenSpirit';

// --- 資料結構定義 ---

export interface TransformedLineInfo {
  name: string;      // 六親
  stemBranch: string;
  element: string;
  isYang: boolean;
}

export interface FinalYaoData {
  position: number;
  originalCode: number; // 0,1,2,3
  isMoving: boolean;
  isShi: boolean;
  isYing: boolean;
  isYang: boolean;      // 用於繪圖
  status: 'Static' | 'MovingCircle' | 'MovingCross';
  najia: NajiaInfo;
  relation: string;     // 六親
  hidden?: { name: string; stemBranch: string; element: string };
  transformed?: TransformedLineInfo; // 變卦對應資訊
}

export interface FullHexagramResult {
  mainGua: Hexagram;
  changedGua: Hexagram;
  lines: FinalYaoData[]; // 順序：初爻(0) -> 上爻(5)
}

// --- 輔助函式 ---

/**
 * 解析輸入碼 (0-3) 為二進制與動靜狀態
 */
function parseInputCodes(inputs: number[]) {
  const mainCode: number[] = [];
  const changedCode: number[] = [];
  const movingLines: number[] = [];

  inputs.forEach((code, index) => {
    const position = index + 1;
    // 0=老陽(動), 1=少陰(靜), 2=少陽(靜), 3=老陰(動)
    // 二進制: 陽=1, 陰=0
    switch (code) {
      case 0: // 老陽 -> 本陽變陰
        mainCode.push(1); changedCode.push(0); movingLines.push(position); break;
      case 1: // 少陰 -> 本陰不變
        mainCode.push(0); changedCode.push(0); break;
      case 2: // 少陽 -> 本陽不變
        mainCode.push(1); changedCode.push(1); break;
      case 3: // 老陰 -> 本陰變陽
        mainCode.push(0); changedCode.push(1); movingLines.push(position); break;
    }
  });

  return { mainCode, changedCode, movingLines };
}

/**
 * 獲取單卦的納甲資訊
 */
function getTrigramNajia(code3bit: number[], isInner: boolean): NajiaInfo[] {
  const key = code3bit.join(',');
  const trigramData = NAJIA_TABLE[key as keyof typeof NAJIA_TABLE];
  if (!trigramData) return [];
  return isInner ? trigramData.inner : trigramData.outer;
}

// --- 主引擎 ---

export function generateFullHexagramData(inputs: number[]): FullHexagramResult | null {
  // 1. 解析輸入
  const { mainCode, changedCode, movingLines } = parseInputCodes(inputs);
  const mainKey = mainCode.join('');
  const changedKey = changedCode.join('');

  // 2. 查找卦象
  const mainGua = HEXAGRAMS_TABLE[mainKey];
  const changedGua = HEXAGRAMS_TABLE[changedKey];
  
  if (!mainGua || !changedGua) return null;

  // 3. 準備參數
  const palaceElement = getPalaceElement(mainGua.palace); // 本宮五行 (定六親用)
  const shiPos = mainGua.shi;
  const yingPos = (shiPos + 3 > 6) ? shiPos - 3 : shiPos + 3;

  // 4. 計算本卦納甲
  const mainLowerNajia = getTrigramNajia(mainCode.slice(0, 3), true);
  const mainUpperNajia = getTrigramNajia(mainCode.slice(3, 6), false);
  const mainFullNajia = [...mainLowerNajia, ...mainUpperNajia];

  // 5. 計算變卦納甲 (用於顯示變爻資訊)
  // 注意：變卦的六親，依然是以「本卦宮位五行」來定
  const changedLowerNajia = getTrigramNajia(changedCode.slice(0, 3), true);
  const changedUpperNajia = getTrigramNajia(changedCode.slice(3, 6), false);
  const changedFullNajia = [...changedLowerNajia, ...changedUpperNajia];

  // 6. 整合每一爻的詳細資料
  // 先計算基礎線路資訊
  const baseLines = inputs.map((inputCode, index) => {
    const position = index + 1;
    const isMoving = movingLines.includes(position);
    const najia = mainFullNajia[index];
    
    // 安本卦六親
    const relation = SIX_RELATIONS_MAP[palaceElement]?.[najia.element] || '未知';

    // 處理變卦資訊
    const changedNajia = changedFullNajia[index];
    const transformedRelation = SIX_RELATIONS_MAP[palaceElement]?.[changedNajia.element] || '未知';
    
    // 判斷陰陽 (用於繪圖)
    const isYang = (mainCode[index] === 1);
    const transformedIsYang = (changedCode[index] === 1);

    // 狀態字串
    let status: 'Static' | 'MovingCircle' | 'MovingCross' = 'Static';
    if (inputCode === 0) status = 'MovingCircle'; // 老陽 O
    if (inputCode === 3) status = 'MovingCross';  // 老陰 X

    return {
      position,
      originalCode: inputCode,
      isMoving,
      isShi: position === shiPos,
      isYing: position === yingPos,
      isYang,
      status,
      najia,
      relation,
      transformed: {
        name: transformedRelation,
        stemBranch: changedNajia.stem + changedNajia.branch,
        element: changedNajia.element,
        isYang: transformedIsYang
      }
    };
  });

  // 7. 查找伏神
  // 收集已出現的六親
  const presentRelations = baseLines.map(l => l.relation);
  const hiddenSpirits = findHiddenSpirits(mainGua.palace, presentRelations);

  // 將伏神合併入爻
  const finalLines = baseLines.map(line => {
    const hidden = hiddenSpirits.find(h => h.position === line.position);
    return {
      ...line,
      hidden: hidden ? {
        name: hidden.name,
        stemBranch: hidden.stem + hidden.branch,
        element: hidden.element
      } : undefined
    };
  });

  return {
    mainGua,
    changedGua,
    lines: finalLines
  };
}