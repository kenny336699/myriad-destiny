"use client";
import { useState, useCallback } from "react";

interface EmbeddedNumberInputProps {
  onSubmit: (numbers: number[]) => void;
}

export function EmbeddedNumberInput({ onSubmit }: EmbeddedNumberInputProps) {
  const [numbers, setNumbers] = useState<[number, number, number]>([0, 0, 0]);

  const handleNumberChange = useCallback(
    (index: number, value: string) => {
      const num = Math.min(9, Math.max(0, parseInt(value) || 0));
      const newNumbers: [number, number, number] = [...numbers] as [
        number,
        number,
        number
      ];
      newNumbers[index] = num;
      setNumbers(newNumbers);
    },
    [numbers]
  );

  const handleSubmit = useCallback(() => {
    if (numbers.some((n) => n === 0)) {
      alert("請輸入1-9的數字");
      return;
    }
    onSubmit(numbers);
  }, [numbers, onSubmit]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-amber-700 text-center">
        輸入三個1-9的數字，自動起卦
      </p>

      <div className="space-y-4">
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <label className="block text-sm font-bold text-amber-800 mb-2">
              第 {index + 1} 個數字
            </label>
            <input
              type="number"
              min="1"
              max="9"
              value={numbers[index] || ""}
              onChange={(e) => handleNumberChange(index, e.target.value)}
              placeholder="1-9"
              className="w-full p-3 text-center text-2xl border border-amber-300 rounded focus:ring-2 focus:ring-amber-600 focus:outline-none transition"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-lg font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition text-lg"
      >
        起卦
      </button>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
        <p className="font-bold mb-2">起卦方法：</p>
        <p>
          依序輸入三個數字，系統會自動計算六爻卦象。適合「報數起卦」、「求簽號碼」等場景。
        </p>
      </div>
    </div>
  );
}
