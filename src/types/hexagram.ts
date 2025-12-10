// 爻的狀態
export type YaoStatus = 'Static' | 'MovingCircle' | 'MovingCross';

// 六親關係
export type Relation = '父母' | '兄弟' | '子孫' | '妻財' | '官鬼';

// 五行
export type Element = '金' | '木' | '水' | '火' | '土';

// 納甲信息
export interface NajiaInfo {
  stem: string;      // 天干
  branch: string;    // 地支
  element: Element;  // 五行
}

// 伏神信息
export interface HiddenSpirit {
  name: Relation;
  stemBranch: string;
}

// 單個爻的信息
export interface YaoLine {
  position: number;        // 爻位 (1-6)
  isYang: boolean;         // 是否為陽爻
  status: YaoStatus;       // 爻的狀態
  relation: Relation;      // 六親
  najia: NajiaInfo;        // 納甲信息
  isShi?: boolean;         // 是否為世
  isYing?: boolean;        // 是否為應
  hidden?: HiddenSpirit;   // 伏神
  transformed?: TransformedYao; // 變爻
}

// 變爻信息
export interface TransformedYao {
  isYang: boolean;
  name: Relation;
  stemBranch: string;
  element: Element;
}

// 卦象信息
export interface GuaInfo {
  name: string;      // 卦名
  palace: string;    // 卦宮
  element: Element;  // 五行
  type: number;      // 卦類型 (1-8)
}

// 排盤結果
export interface HexagramResult {
  mainGua: GuaInfo;
  changedGua: GuaInfo;
  lines: YaoLine[];
}

// 顯示用的爻行數據
export interface DisplayLine {
  id: number;
  sixBeast: string;
  original: {
    position: number;
    isYang: boolean;
    status: YaoStatus;
    relation: string;
    isShi?: boolean;
    isYing?: boolean;
    name: string;
    stemBranch: string;
    element: string;
    hidden?: {
      name: string;
      stemBranch: string;
    };
  };
  transformed?: {
    isYang: boolean;
    name: string;
    stemBranch: string;
    element: string;
  };
}

// 四柱
export interface FourPillars {
  year: string;
  month: string;
  day: string;
  hour: string;
}

// 神煞
export interface ShenSha {
  void: string;   // 空亡
  horse: string;  // 驛馬
  peach: string;  // 桃花
  noble: string;  // 貴人
}

// 日曆數據
export interface CalendarData {
  dateString: string;
  lunarString: string;
  fourPillars: FourPillars;
  shenSha: ShenSha;
  dayStem: string;
}

// 爻輸入選項
export interface YaoOption {
  value: number;
  label: string;
}
