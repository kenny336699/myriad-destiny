import { useMemo } from "react";

export interface NumberBasedInputProps {
  numbers: number[];
}

export interface TimeBasedInputProps {
  date: Date;
}

/**
 * 數字起卦：將三個數字相加取模4
 * 範圍: 1-9
 * 計算: (num1 + num2 + num3) % 4
 * 結果對應: 0, 1, 2, 3
 */
function calculateFromNumbers(numbers: number[]): number[] {
  if (numbers.length !== 3) return [];

  const yaoValues: number[] = [];
  for (let i = 0; i < 6; i++) {
    // 每爻使用不同的數字組合
    const sum = (numbers[0] + numbers[1] + numbers[2] + i) % 4;
    // 映射到卦象值: 0, 1, 2, 3
    yaoValues.push(sum);
  }
  return yaoValues;
}

/**
 * 時間起卦：使用年月日時的數字
 * 年份: 取末兩位
 * 月份: 1-12
 * 日期: 1-31
 * 時辰: 0-23 (或轉換為12時辰制)
 */
function calculateFromTime(date: Date): number[] {
  const year = date.getFullYear() % 100;
  const month = date.getMonth() + 1; // 0-11 -> 1-12
  const day = date.getDate();
  const hour = date.getHours();

  // 使用各時間成分計算六爻
  const yaoValues: number[] = [];
  const baseNumbers = [year, month, day];

  for (let i = 0; i < 6; i++) {
    const sum = baseNumbers[0] + baseNumbers[1] + baseNumbers[2] + hour + i;
    yaoValues.push(sum % 4);
  }

  return yaoValues;
}

export function useNumberBasedHexagram(numbers: number[]) {
  return useMemo(() => {
    if (numbers.length !== 3) return [];
    return calculateFromNumbers(numbers);
  }, [numbers]);
}

export function useTimeBasedHexagram(date: Date) {
  return useMemo(() => {
    return calculateFromTime(date);
  }, [date]);
}
