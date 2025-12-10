import { useMemo } from 'react';
import { getGuaCalendarData } from '../utils/calendar';
import { getSixGods } from '../utils/sixGods';
import { generateFullHexagramData, type FullHexagramResult } from '../utils/engine';
import { GUA_TYPE_MAP } from '../constants/hexagram';
import type { Hexagram } from '../constants/sixtyFourGua';
import type { DisplayLine } from '../types/hexagram';

interface UseHexagramCalculationProps {
  selectedDate: string;
  yaoInputs: number[];
  enabled: boolean; // 只在 result 模式下計算
}

interface UseHexagramCalculationResult {
  calendarData: ReturnType<typeof getGuaCalendarData>;
  result: FullHexagramResult | null;
  displayLines: DisplayLine[];
  metadata: {
    guaName: string;
    family: string;
    changeGuaName: string;
  };
}

// 獲取卦宮與世次文字 (根據世爻推算卦類型)
function getGuaFamilyText(gua: Hexagram): string {
  if (!gua) return '';
  // 根據世爻位置推算卦類型
  const typeMap: Record<number, number> = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6
  };
  const type = typeMap[gua.shi] || 6;
  return `${gua.palace}${gua.element}${GUA_TYPE_MAP[type] || ''}`;
}

export function useHexagramCalculation({
  selectedDate,
  yaoInputs,
  enabled,
}: UseHexagramCalculationProps): UseHexagramCalculationResult {
  return useMemo(() => {
    if (!enabled) {
      // 在 input 模式下返回空數據，避免不必要的計算
      const emptyCalendar = getGuaCalendarData(new Date());
      return {
        calendarData: emptyCalendar,
        result: null,
        displayLines: [],
        metadata: {
          guaName: '',
          family: '',
          changeGuaName: '',
        },
      };
    }

    // 計算日曆數據
    const dateObj = new Date(selectedDate);
    const calendarData = getGuaCalendarData(dateObj);
    const dynamicSixGods = getSixGods(calendarData.dayStem);

    // 呼叫排盤引擎
    const result = generateFullHexagramData(yaoInputs);
    const hasResult = !!result;

    // 準備 Metadata
    const metadata = hasResult
      ? {
          guaName: result.mainGua.name,
          family: getGuaFamilyText(result.mainGua),
          changeGuaName: result.changedGua.name,
        }
      : { guaName: '計算錯誤', family: '', changeGuaName: '' };

    // 準備顯示用的 Lines (從上而下)
    const displayLines: DisplayLine[] = hasResult
      ? [...result.lines].reverse().map((line) => {
          const godIndex = line.position - 1;
          return {
            id: line.position,
            sixBeast: dynamicSixGods[godIndex],
            original: {
              ...line,
              name: line.relation,
              stemBranch: line.najia.stem + line.najia.branch,
              element: line.najia.element,
              hidden: line.hidden, // 保留伏神資料
            },
            transformed: line.transformed,
          };
        })
      : [];

    return {
      calendarData,
      result,
      displayLines,
      metadata,
    };
  }, [selectedDate, yaoInputs, enabled]);
}
