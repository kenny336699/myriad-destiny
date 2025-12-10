"use client";
import { useState, useCallback } from "react";
import clsx from "clsx";

interface NumberTimeInputPanelProps {
  onNumberSubmit: (numbers: number[]) => void;
  onTimeSubmit: (date: Date) => void;
  onBack: () => void;
}

export function NumberTimeInputPanel({
  onNumberSubmit,
  onTimeSubmit,
  onBack,
}: NumberTimeInputPanelProps) {
  const [activeTab, setActiveTab] = useState<"number" | "time">("number");
  const [numbers, setNumbers] = useState<[number, number, number]>([0, 0, 0]);
  const [selectedTime, setSelectedTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

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

  const handleNumberSubmit = useCallback(() => {
    if (numbers.some((n) => n === 0)) {
      alert("請輸入1-9的數字");
      return;
    }
    onNumberSubmit(numbers);
  }, [numbers, onNumberSubmit]);

  const handleTimeSubmit = useCallback(() => {
    onTimeSubmit(new Date(selectedTime));
  }, [selectedTime, onTimeSubmit]);

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 font-serif text-amber-950">
      <div className="bg-white p-8 rounded-xl shadow-xl border border-amber-200 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8 tracking-widest border-b pb-4 border-amber-200">
          數字/時間起卦
        </h1>

        {/* 標籤頁 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("number")}
            className={clsx(
              "flex-1 py-2 px-4 rounded-lg font-bold transition",
              activeTab === "number"
                ? "bg-amber-600 text-white"
                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
            )}
          >
            數字起卦
          </button>
          <button
            onClick={() => setActiveTab("time")}
            className={clsx(
              "flex-1 py-2 px-4 rounded-lg font-bold transition",
              activeTab === "time"
                ? "bg-amber-600 text-white"
                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
            )}
          >
            時間起卦
          </button>
        </div>

        {/* 數字起卦 */}
        {activeTab === "number" && (
          <div className="space-y-6">
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
              onClick={handleNumberSubmit}
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
        )}

        {/* 時間起卦 */}
        {activeTab === "time" && (
          <div className="space-y-6">
            <p className="text-sm text-amber-700 text-center">
              根據當下時間自動起卦
            </p>

            <div>
              <label className="block text-sm font-bold text-amber-800 mb-2">
                起卦時間
              </label>
              <input
                type="datetime-local"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border border-amber-300 rounded focus:ring-2 focus:ring-amber-600 focus:outline-none font-mono text-sm"
              />
            </div>

            <div className="bg-amber-100 p-4 rounded-lg border border-amber-300 text-sm">
              <p className="font-bold text-amber-900 mb-2">時間分解：</p>
              {(() => {
                const date = new Date(selectedTime);
                return (
                  <ul className="space-y-1 text-amber-800">
                    <li>
                      年份: {date.getFullYear()} (末位:{" "}
                      {date.getFullYear() % 100})
                    </li>
                    <li>月份: {date.getMonth() + 1}</li>
                    <li>日期: {date.getDate()}</li>
                    <li>時辰: {String(date.getHours()).padStart(2, "0")} 時</li>
                  </ul>
                );
              })()}
            </div>

            <button
              onClick={handleTimeSubmit}
              className="w-full py-3 rounded-lg font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition text-lg"
            >
              起卦
            </button>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
              <p className="font-bold mb-2">起卦方法：</p>
              <p>
                使用年月日時的數字進行起卦計算，無需手動輸入，按下「起卦」直接推算卦象。
              </p>
            </div>
          </div>
        )}

        {/* 返回按鈕 */}
        <button
          onClick={onBack}
          className="w-full mt-8 py-2 rounded-lg font-bold text-amber-600 border-2 border-amber-600 hover:bg-amber-50 active:scale-95 transition"
        >
          返回
        </button>
      </div>
    </div>
  );
}
