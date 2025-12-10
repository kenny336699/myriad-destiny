"use client";
import { useState } from "react";
import clsx from "clsx";

interface CoinToss {
  coins: boolean[];
  result: number;
}

interface CoinCastingPanelProps {
  tosses: CoinToss[];
  isAnimating: boolean;
  isComplete: boolean;
  onCastClick: () => void;
  onComplete: () => void;
  onReset: () => void;
}

const RESULT_LABELS: Record<number, string> = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
};

export function CoinCastingPanel({
  tosses,
  isAnimating,
  isComplete,
  onCastClick,
  onComplete,
  onReset,
}: CoinCastingPanelProps) {
  const [showResults, setShowResults] = useState(false);

  const handleComplete = () => {
    setShowResults(true);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 font-serif text-amber-950">
      <div className="bg-white p-8 rounded-xl shadow-xl border border-amber-200 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 tracking-widest border-b pb-4 border-amber-200">
          線上擲骰 (銅錢模擬)
        </h1>
        <p className="text-center text-sm text-amber-700 mb-8">
          三枚銅錢自動判斷陰陽，連續六次生成卦象
        </p>

        {/* 銅錢動畫區域 */}
        <div className="mb-8 p-6 bg-gradient-to-b from-amber-100 to-amber-50 rounded-lg border-2 border-amber-300">
          <h2 className="text-lg font-bold text-amber-800 mb-4 text-center">
            第 {tosses.length + 1} 爻
          </h2>

          <div className="flex justify-center gap-6 mb-6 h-24">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={clsx(
                  "w-20 h-20 flex items-center justify-center rounded-full border-4 text-2xl font-bold transition-transform",
                  isAnimating
                    ? "bg-yellow-300 border-yellow-500 animate-bounce text-amber-900"
                    : tosses.length > 0
                    ? tosses[tosses.length - 1].coins[index]
                      ? "bg-green-200 border-green-600 text-green-800"
                      : "bg-red-200 border-red-600 text-red-800"
                    : "bg-amber-200 border-amber-500 text-amber-800"
                )}
                style={
                  isAnimating
                    ? {
                        animationDelay: `${index * 0.1}s`,
                      }
                    : {}
                }
              >
                {isAnimating
                  ? "?"
                  : tosses.length > 0
                  ? tosses[tosses.length - 1].coins[index]
                    ? "背"
                    : "字"
                  : "?"}
              </div>
            ))}
          </div>

          {/* 最後一次的結果 */}
          {tosses.length > 0 && !isAnimating && (
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-900">
                {RESULT_LABELS[tosses[tosses.length - 1].result]}
              </p>
              <p className="text-sm text-amber-700 mt-1">
                ({tosses[tosses.length - 1].result})
              </p>
            </div>
          )}
        </div>

        {/* 擲卦記錄 */}
        <div className="mb-8 bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h3 className="font-bold text-amber-800 mb-3">擲卦記錄</h3>
          <div className="space-y-2">
            {tosses.map((toss, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-white rounded border border-amber-100"
              >
                <span className="font-medium text-amber-800">
                  第 {index + 1} 爻：
                </span>
                <span className="text-sm">
                  {toss.coins.map((coin, i) => (
                    <span
                      key={i}
                      className={coin ? "text-green-600" : "text-red-600"}
                    >
                      {coin ? "背" : "字"}{" "}
                    </span>
                  ))}
                </span>
                <span className="font-bold text-lg text-amber-900">
                  {RESULT_LABELS[toss.result]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 按鈕 */}
        <div className="flex gap-4">
          {!isComplete ? (
            <button
              onClick={onCastClick}
              disabled={isAnimating}
              className={clsx(
                "flex-1 py-3 rounded-lg font-bold text-white text-lg transition",
                isAnimating
                  ? "bg-amber-400 cursor-not-allowed opacity-75"
                  : "bg-amber-600 hover:bg-amber-700 active:scale-95"
              )}
            >
              {isAnimating ? "擲卦中..." : "擲卦"}
            </button>
          ) : (
            <>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 active:scale-95 transition text-lg"
              >
                確認起卦
              </button>
              <button
                onClick={onReset}
                className="flex-1 py-3 rounded-lg font-bold text-amber-600 bg-white border-2 border-amber-600 hover:bg-amber-50 active:scale-95 transition text-lg"
              >
                重新擲卦
              </button>
            </>
          )}
        </div>

        {/* 說明 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
          <p className="font-bold mb-2">卦象對應規則：</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>3個背 = 3</li>
            <li>2個背 = 2</li>
            <li>1個背 = 1</li>
            <li>0個背 = 0</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
