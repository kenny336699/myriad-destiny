export type InputCode = 0 | 1 | 2 | 3;

export interface NajiaInfo {
  stem: string;
  branch: string;
  element: string;
}

export interface LineData {
  position: number;
  isYang: boolean;
  status: 'Static' | 'Moving';
  najia: NajiaInfo;
  relation?: string; // 六親 (之後算出)
}