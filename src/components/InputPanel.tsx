import { useState } from "react";
import { DEFAULT_YAO_VALUES } from "../constants/hexagram";
import { EmbeddedManualInput } from "./EmbeddedManualInput";
import { EmbeddedCoinCasting } from "./EmbeddedCoinCasting";
import { EmbeddedNumberInput } from "./EmbeddedNumberInput";
import { EmbeddedTimeInput } from "./EmbeddedTimeInput";

type InputMethod = "manual" | "coin" | "number" | "time";

interface CoinToss {
  coins: boolean[];
  result: number;
}

interface InputPanelProps {
  subject: string;
  selectedDate: string;
  yaoInputs: number[];
  onSubjectChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onYaoChange: (index: number, value: number) => void;
  onSubmit: () => void;
  // Coin casting props
  coinTosses?: CoinToss[];
  isCoinAnimating?: boolean;
  isCoinComplete?: boolean;
  onCoinCast?: () => void;
  onCoinReset?: () => void;
  onCoinComplete?: () => void;
  // Number/Time props
  onNumberSubmit?: (numbers: number[]) => void;
  onTimeSubmit?: (date: Date) => void;
}

export function InputPanel({
  subject,
  selectedDate,
  yaoInputs,
  onSubjectChange,
  onDateChange,
  onYaoChange,
  onSubmit,
  coinTosses = [],
  isCoinAnimating = false,
  isCoinComplete = false,
  onCoinCast,
  onCoinReset,
  onNumberSubmit,
  onTimeSubmit,
}: InputPanelProps) {
  const [inputMethod, setInputMethod] = useState<InputMethod>("manual");

  // 重置所有爻位
  const handleReset = () => {
    DEFAULT_YAO_VALUES.forEach((value, index) => {
      onYaoChange(index, value);
    });
  };

  // 處理數字起卦提交
  const handleNumberSubmitInternal = (numbers: number[]) => {
    if (onNumberSubmit) {
      onNumberSubmit(numbers);
      onSubmit();
    }
  };

  // 處理時間起卦提交
  const handleTimeSubmitInternal = (date: Date) => {
    if (onTimeSubmit) {
      onTimeSubmit(date);
      onSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 font-serif text-amber-950">
      <div className="bg-white p-8 rounded-xl shadow-xl border border-amber-200 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8 tracking-widest border-b pb-4 border-amber-200">
          六爻起卦
        </h1>

        <div className="space-y-6">
          {/* 所測之事 */}
          <div>
            <label
              htmlFor="subject-input"
              className="block text-sm font-bold text-amber-800 mb-2"
            >
              所測之事
            </label>
            <input
              id="subject-input"
              type="text"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              placeholder="例如：這筆生意是否可成？"
              className="w-full p-3 border border-amber-300 rounded focus:ring-2 focus:ring-amber-600 focus:outline-none transition"
              aria-label="請輸入所測之事"
            />
          </div>

          {/* 日期選擇 */}
          <div>
            <label
              htmlFor="date-input"
              className="block text-sm font-bold text-amber-800 mb-2"
            >
              起卦時間
            </label>
            <input
              id="date-input"
              type="datetime-local"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full p-3 border border-amber-300 rounded focus:ring-2 focus:ring-amber-600 focus:outline-none font-mono text-sm"
              aria-label="選擇起卦時間"
            />
          </div>

          {/* 起卦方式選擇 */}
          <div>
            <label
              htmlFor="input-method"
              className="block text-sm font-bold text-amber-800 mb-2"
            >
              起卦方式
            </label>
            <select
              id="input-method"
              value={inputMethod}
              onChange={(e) => setInputMethod(e.target.value as InputMethod)}
              className="w-full p-3 border border-amber-300 rounded focus:ring-2 focus:ring-amber-600 focus:outline-none transition"
            >
              <option value="manual">手動裝卦 (Manual Input)</option>
              <option value="coin">金錢龜卜 (Digital Coin Cast)</option>
              <option value="number">數字起卦 (Number Based)</option>
              <option value="time">時間起卦 (Time Based)</option>
            </select>
          </div>

          {/* 根據選擇的輸入方式顯示不同內容 */}
          {inputMethod === "manual" && (
            <>
              <EmbeddedManualInput
                yaoInputs={yaoInputs}
                onYaoChange={onYaoChange}
                onReset={handleReset}
              />

              {/* 主要操作按鈕 */}
              <button
                onClick={onSubmit}
                className="w-full !border !border-amber-300 font-bold text-amber-800 py-4 rounded-lg text-lg hover:bg-amber-50 transition-colors shadow-lg"
                aria-label="開始排盤"
              >
                開始排盤
              </button>
            </>
          )}

          {inputMethod === "coin" && onCoinCast && onCoinReset && (
            <>
              <EmbeddedCoinCasting
                tosses={coinTosses}
                isAnimating={isCoinAnimating}
                isComplete={isCoinComplete}
                onCastClick={onCoinCast}
                onReset={onCoinReset}
              />

              {/* 共享的提交按鈕 */}
              {isCoinComplete && (
                <button
                  onClick={onSubmit}
                  className="w-full !border !border-amber-300 font-bold text-amber-800 py-4 rounded-lg text-lg hover:bg-amber-50 transition-colors shadow-lg"
                  aria-label="開始排盤"
                >
                  開始排盤
                </button>
              )}
            </>
          )}

          {inputMethod === "number" && onNumberSubmit && (
            <>
              <EmbeddedNumberInput onSubmit={handleNumberSubmitInternal} />
            </>
          )}

          {inputMethod === "time" && onTimeSubmit && (
            <>
              <EmbeddedTimeInput onSubmit={handleTimeSubmitInternal} />
            </>
          )}
          {/* 說明 */}
          {(inputMethod === "manual" || inputMethod === "coin") && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-900">
              <p className="font-bold mb-2">卦象對應規則：</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>3個字 = 陰爻發動</li>
                <li>2個字 = 陽爻</li>
                <li>1個字 = 陰爻</li>
                <li>0個字 = 陽爻發動</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
