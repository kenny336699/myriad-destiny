import { YAO_OPTIONS, YAO_LABELS } from "../constants/hexagram";

interface InputPanelProps {
  subject: string;
  selectedDate: string;
  yaoInputs: number[];
  onSubjectChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onYaoChange: (index: number, value: number) => void;
  onSubmit: () => void;
  onCoinCasting?: () => void;
  onNumberTime?: () => void;
}

export function InputPanel({
  subject,
  selectedDate,
  yaoInputs,
  onSubjectChange,
  onDateChange,
  onYaoChange,
  onSubmit,
  onCoinCasting,
  onNumberTime,
}: InputPanelProps) {
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

          {/* 爻位輸入 */}
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
              {[5, 4, 3, 2, 1, 0].map((yaoIndex) => (
                <div
                  key={yaoIndex}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium w-12 text-amber-700">
                    {YAO_LABELS[yaoIndex]}
                  </span>
                  <select
                    value={yaoInputs[yaoIndex]}
                    onChange={(e) =>
                      onYaoChange(yaoIndex, Number(e.target.value))
                    }
                    className="flex-1 p-2 border border-amber-300 rounded text-sm focus:ring-1 focus:ring-amber-600"
                    aria-label={`選擇${YAO_LABELS[yaoIndex]}的值`}
                  >
                    {YAO_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <p className="text-xs text-amber-600 mt-2 text-center">
              (輸入規則: 0=老陽動, 1=少陰靜, 2=少陽靜, 3=老陰動)
            </p>
          </div>

          <button
            onClick={onSubmit}
            className="w-full !border !border-amber-300 font-bold text-amber-800 py-4 rounded-lg font-bold text-lg hover: transition-colors shadow-lg mt-4"
            aria-label="開始排盤"
          >
            開始排盤
          </button>

          {/* 其他起卦方式 */}
          <div className="border-t border-amber-200 pt-6 mt-6">
            <p className="text-sm font-bold text-amber-800 mb-3 text-center">
              或選擇其他起卦方式：
            </p>
            <div className="grid grid-cols-2 gap-3">
              {onCoinCasting && (
                <button
                  onClick={onCoinCasting}
                  className="py-3 rounded-lg font-bold text-white bg-yellow-600 hover:bg-yellow-700 active:scale-95 transition text-sm"
                  aria-label="線上擲骰"
                >
                  💰 線上擲骰
                </button>
              )}
              {onNumberTime && (
                <button
                  onClick={onNumberTime}
                  className="py-3 rounded-lg font-bold text-white bg-cyan-600 hover:bg-cyan-700 active:scale-95 transition text-sm"
                  aria-label="數字/時間起卦"
                >
                  🔢 數字/時間起卦
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
