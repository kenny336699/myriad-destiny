import { useState, useCallback } from "react";

export interface CoinCastResult {
  yaoValues: number[];
  isComplete: boolean;
  currentCount: number;
}

export interface CoinToss {
  coins: boolean[]; // true = heads (背), false = tails (字)
  result: number; // 6, 7, 8, 9
}

/**
 * 銅錢擲卦邏輯：
 * 正面(背) = 1, 反面(字) = 0
 * 一次擲三枚：
 * - 3個背 = 3
 * - 2個背 = 2
 * - 1個背 = 1
 * - 0個背 = 0
 */
function tossCoin(): boolean {
  return Math.random() > 0.5;
}

function calculateYaoValue(coins: boolean[]): number {
  const heads = coins.filter((c) => c).length;
  switch (heads) {
    case 3:
      return 3;
    case 2:
      return 2;
    case 1:
      return 1;
    case 0:
      return 0;
    default:
      return 0;
  }
}

export function useCoinCasting() {
  const [yaoValues, setYaoValues] = useState<number[]>([]);
  const [tosses, setTosses] = useState<CoinToss[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const castOnce = useCallback(async () => {
    if (yaoValues.length >= 6) return;

    setIsAnimating(true);
    // 模擬動畫延遲
    await new Promise((resolve) => setTimeout(resolve, 800));

    const coins = [tossCoin(), tossCoin(), tossCoin()];
    const result = calculateYaoValue(coins);

    setTosses((prev) => [...prev, { coins, result }]);
    setYaoValues((prev) => [result, ...prev]);
    setIsAnimating(false);
  }, [yaoValues.length]);

  const reset = useCallback(() => {
    setYaoValues([]);
    setTosses([]);
    setIsAnimating(false);
  }, []);

  return {
    yaoValues,
    tosses,
    isAnimating,
    isComplete: yaoValues.length === 6,
    castOnce,
    reset,
  };
}
