import { FourPillarsSection } from "./FourPillarsSection";
import { HexagramCard } from "./HexagramCard";
import type { CalendarData, DisplayLine } from "../types/hexagram";
import clsx from "clsx";

interface ResultPanelProps {
  subject: string;
  calendarData: CalendarData;
  mainGuaName: string;
  guaFamily: string;
  changedGuaName: string;
  displayLines: DisplayLine[];
  yaoInputs: number[];
  copyStatus: "idle" | "copied";
  onBack: () => void;
  onCopyPrompt: () => void;
}

export function ResultPanel({
  subject,
  calendarData,
  mainGuaName,
  guaFamily,
  changedGuaName,
  displayLines,
  yaoInputs,
  copyStatus,
  onBack,
  onCopyPrompt,
}: ResultPanelProps) {
  return (
    <div className="p-1 max-w-4xl mx-auto bg-amber-50 min-h-screen text-amber-950 font-serif pb-20">
      {/* Header Section */}
      <div className="border-b-2 border-amber-800 pb-4 mb-6 relative">
        <button
          onClick={onBack}
          className="absolute left-0 top-0 text-xs bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded transition-colors"
          aria-label="返回重新測算"
        >
          ← 重測
        </button>

        <div className="flex flex-col items-center mb-2 pt-6">
          <h1 className="text-2xl font-bold tracking-widest text-amber-800">
            六爻神課
          </h1>
          {subject && (
            <div className="mt-2 text-lg font-medium text-amber-700 border-b border-amber-300 pb-1">
              占問：{subject}
            </div>
          )}
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="text-left">
            <span className="block text-sm text-amber-700">
              {calendarData.dateString}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-amber-600">
              {calendarData.lunarString}
            </span>
          </div>
        </div>
      </div>

      {/* Four Pillars & ShenSha */}
      <FourPillarsSection calendarData={calendarData} />

      {/* Hexagram Display */}
      <HexagramCard
        mainGuaName={mainGuaName}
        guaFamily={guaFamily}
        changedGuaName={changedGuaName}
        displayLines={displayLines}
        yaoInputs={yaoInputs}
      />

      <div className="border-t border-stone-200 pt-6 mt-6">
        <button
          onClick={onCopyPrompt}
          disabled={copyStatus === "copied"}
          className={`
      w-full py-3.5 px-6 rounded-lg font-bold text-base transition-all duration-200 border-2
      flex items-center justify-center gap-2
      ${
        copyStatus === "copied"
          ? "bg-stone-800 border-stone-800 text-white"
          : "bg-white border-amber-600 text-amber-700 hover:bg-amber-50 active:bg-amber-100"
      }
    `}
        >
          {copyStatus === "copied" ? (
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              已複製成功
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                ></path>
              </svg>
              複製提示詞
            </span>
          )}
        </button>

        {/* 輔助文字整合得更緊湊 */}
        <div className="mt-3 text-center">
          <span className="text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
            下一步：貼上至 AI 對話框即可
          </span>
        </div>
      </div>
    </div>
  );
}
