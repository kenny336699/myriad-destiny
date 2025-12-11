"use client";
import { useState, useCallback } from "react";

interface EmbeddedTimeInputProps {
  onSubmit: (date: Date) => void;
}

export function EmbeddedTimeInput({ onSubmit }: EmbeddedTimeInputProps) {
  const [selectedTime, setSelectedTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  const handleSubmit = useCallback(() => {
    onSubmit(new Date(selectedTime));
  }, [selectedTime, onSubmit]);

  return (
    <div className="space-y-4">
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
                年份: {date.getFullYear()} (末位: {date.getFullYear() % 100})
              </li>
              <li>月份: {date.getMonth() + 1}</li>
              <li>日期: {date.getDate()}</li>
              <li>時辰: {String(date.getHours()).padStart(2, "0")} 時</li>
            </ul>
          );
        })()}
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
          使用年月日時的數字進行起卦計算，無需手動輸入，按下「起卦」直接推算卦象。
        </p>
      </div>
    </div>
  );
}
