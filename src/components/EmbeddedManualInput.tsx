"use client";
import { useMemo } from "react";
import { YAO_LABELS, DEFAULT_YAO_VALUES } from "../constants/hexagram";
import { HEXAGRAMS_TABLE } from "../constants/sixtyFourGua";
import { YaoBar } from "./YaoBar";

interface EmbeddedManualInputProps {
  yaoInputs: number[];
  onYaoChange: (index: number, value: number) => void;
  onReset: () => void;
}

export function EmbeddedManualInput({
  yaoInputs,
  onYaoChange,
  onReset,
}: EmbeddedManualInputProps) {
  // 計算當前卦名（即時預覽）
  const currentHexagramName = useMemo(() => {
    // 將 yaoInputs 轉換為二進制字符串 (1 代表陽，0 代表陰)
    // 0=老陽(陽), 1=少陰(陰), 2=少陽(陽), 3=老陰(陰)
    const binaryString = yaoInputs
      .map((yao) => (yao === 0 || yao === 2 ? "1" : "0"))
      .join("");

    const hexagram = HEXAGRAMS_TABLE[binaryString];
    return hexagram ? hexagram.name : "未知卦象";
  }, [yaoInputs]);

  // 處理爻位線條點擊（切換陰陽）
  const handleYaoLineClick = (index: number) => {
    const currentValue = yaoInputs[index];
    let newValue: number;

    // 如果是陽爻 (0 或 2)，切換為陰爻
    // 如果是陰爻 (1 或 3)，切換為陽爻
    // 保持動/靜狀態不變
    if (currentValue === 0 || currentValue === 2) {
      // 陽爻 -> 陰爻
      newValue = currentValue === 0 ? 3 : 1; // 老陽->老陰, 少陽->少陰
    } else {
      // 陰爻 -> 陽爻
      newValue = currentValue === 3 ? 0 : 2; // 老陰->老陽, 少陰->少陽
    }

    onYaoChange(index, newValue);
  };

  // 處理「動」按鈕點擊（切換動靜）
  const handleMotionToggle = (index: number) => {
    const currentValue = yaoInputs[index];
    let newValue: number;

    // 切換動靜狀態，保持陰陽不變
    if (currentValue === 0 || currentValue === 3) {
      // 動爻 -> 靜爻
      newValue = currentValue === 0 ? 2 : 1; // 老陽->少陽, 老陰->少陰
    } else {
      // 靜爻 -> 動爻
      newValue = currentValue === 2 ? 0 : 3; // 少陽->老陽, 少陰->老陰
    }

    onYaoChange(index, newValue);
  };

  // 判斷是否為陽爻
  const isYangYao = (value: number) => value === 0 || value === 2;

  // 判斷是否為動爻
  const isMovingYao = (value: number) => value === 0 || value === 3;

  return (
    <>
      {/* 即時預覽 - 當前卦名 */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-4 rounded-lg border border-amber-300 text-center">
        <div className="text-xs text-amber-600 mb-1">本卦預覽</div>
        <div className="text-2xl font-bold text-amber-900 tracking-wider">
          {currentHexagramName}
        </div>
      </div>

      {/* 爻位輸入 - 互動式視覺化 */}
      <div>
        <label className="block text-sm font-bold text-amber-800 mb-3">
          爻象輸入 (由下而上)
        </label>
        <div
          className="space-y-3 bg-amber-50 p-4 rounded-lg border border-amber-200"
          role="group"
          aria-label="六爻輸入區"
        >
          {/* 顯示順序：上爻(5) -> 初爻(0) */}
          {[5, 4, 3, 2, 1, 0].map((yaoIndex) => {
            const yaoValue = yaoInputs[yaoIndex];
            const isYang = isYangYao(yaoValue);
            const isMoving = isMovingYao(yaoValue);

            return (
              <div key={yaoIndex} className="flex items-center gap-3">
                {/* 爻位標籤 */}
                <span className="text-sm font-medium w-12 text-amber-700">
                  {YAO_LABELS[yaoIndex]}
                </span>

                {/* 可點擊的爻線 */}
                <button
                  onClick={() => handleYaoLineClick(yaoIndex)}
                  className={`flex-1 flex items-center justify-center h-10 rounded transition-all ${
                    isMoving
                      ? "bg-red-50 hover:bg-red-100 border-2 border-red-300"
                      : "bg-white hover:bg-amber-100 border-2 border-amber-300"
                  }`}
                  aria-label={`點擊切換${YAO_LABELS[yaoIndex]}的陰陽`}
                >
                  <YaoBar
                    isYang={isYang}
                    color={isMoving ? "bg-red-600" : "bg-amber-900"}
                  />
                </button>

                {/* 「動」按鈕 */}
                <button
                  onClick={() => handleMotionToggle(yaoIndex)}
                  className={`w-12 h-10 rounded-full font-bold text-sm transition-all ${
                    isMoving
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-105"
                      : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  }`}
                  aria-label={`切換${YAO_LABELS[yaoIndex]}的動靜狀態`}
                >
                  動
                </button>
              </div>
            );
          })}
        </div>

        {/* 重置按鈕 */}
        <div className="flex justify-center mt-3">
          <button
            onClick={onReset}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium border border-gray-300"
            aria-label="重置所有爻位"
          >
            🔄 重置
          </button>
        </div>

        <p className="text-xs text-amber-600 mt-3 text-center">
          點擊線條切換陰陽，點擊「動」字切換變爻
        </p>
      </div>
    </>
  );
}
