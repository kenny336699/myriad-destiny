import { YaoBar } from "./YaoBar";
import type { DisplayLine } from "../types/hexagram";
import { getStemColor, getBranchColor } from "../utils/elementColors";

interface HexagramCardProps {
  mainGuaName: string;
  guaFamily: string;
  changedGuaName: string;
  displayLines: DisplayLine[];
  yaoInputs: number[];
}

export function HexagramCard({
  mainGuaName,
  guaFamily,
  changedGuaName,
  displayLines,
  yaoInputs,
}: HexagramCardProps) {
  const hasResult = displayLines.length > 0;

  return (
    <div className="bg-white p-1 rounded-lg shadow-lg border border-stone-200 mb-8">
      {!hasResult ? (
        <div className="text-center text-red-500 py-10">
          排盤發生錯誤,找不到對應的卦象。請檢查輸入。
          <br />
          輸入代碼: [{yaoInputs.join(", ")}]
        </div>
      ) : (
        <>
          {/* 卦名區 */}
          <div className="flex justify-between mb-8 border-b border-dashed border-stone-300 pb-2">
            <div className="w-1/2 text-center">
              <span className="text-xs block text-stone-400">
                本卦 ({guaFamily})
              </span>
              <span className="text-xl font-bold text-stone-800">
                {mainGuaName}
              </span>
            </div>
            <div className="w-1/2 text-center">
              <span className="text-xs block text-stone-400">變卦</span>
              <span className="text-xl font-bold text-stone-600">
                {changedGuaName}
              </span>
            </div>
          </div>

          {/* 爻行區 */}
          <div className="flex flex-col gap-3">
            {displayLines.map((line) => (
              <div
                key={line.id}
                className="flex items-center min-h-[3rem] hover:bg-stone-50 transition-colors py-1"
              >
                {/* 六神 - 固定宽度 */}
                <div className="w-[48px] text-center text-sm font-medium text-stone-500 border-r border-stone-100">
                  {line.sixBeast}
                </div>

                {/* 伏神六亲 - 固定宽度 */}
                <div className="w-[48px] text-center text-sm text-stone-400">
                  {line.original.hidden?.name || ""}
                </div>

                {/* 伏神干支 - 固定宽度 */}
                <div className="w-[48px] text-center text-sm text-stone-400">
                  {line.original.hidden?.stemBranch && (
                    <>
                      <span className={getStemColor(line.original.hidden.stemBranch[0])}>
                        {line.original.hidden.stemBranch[0]}
                      </span>
                      <span className={getBranchColor(line.original.hidden.stemBranch[1])}>
                        {line.original.hidden.stemBranch[1]}
                      </span>
                    </>
                  )}
                </div>

                {/* 本卦六亲 - 固定宽度 */}
                <div className="w-[48px] text-right text-sm font-medium">
                  {line.original.name}
                </div>

                {/* 本卦干支 - 固定宽度 */}
                <div className="w-[48px] text-center text-sm">
                  <span className={getStemColor(line.original.stemBranch[0])}>
                    {line.original.stemBranch[0]}
                  </span>
                  <span className={getBranchColor(line.original.stemBranch[1])}>
                    {line.original.stemBranch[1]}
                  </span>
                </div>

                {/* 本卦爻條 - 固定宽度 */}
                <div className="w-[48px] flex justify-center">
                  <YaoBar
                    isYang={line.original.isYang}
                    color="bg-stone-800"
                  />
                </div>

                {/* 动爻标记 O/X - 固定宽度 */}
                <div className="w-[48px] text-center text-red-500 font-bold text-lg">
                  {line.original.status === "MovingCircle" && "○"}
                  {line.original.status === "MovingCross" && "✕"}
                </div>

                {/* 世應標記 - 固定宽度 */}
                <div className="w-[48px] text-center font-bold">
                  {line.original.isShi && (
                    <span className="text-red-600 border border-red-600 rounded px-0.5 text-xs">
                      世
                    </span>
                  )}
                  {line.original.isYing && (
                    <span className="text-blue-600 border border-blue-600 rounded px-0.5 text-xs">
                      應
                    </span>
                  )}
                </div>

                {/* 變卦六亲 - 固定宽度 */}
                <div className="w-[48px] text-left text-sm">
                  <span className={
                    line.original.status === "Static"
                      ? "text-stone-300"
                      : "text-stone-600"
                  }>
                    {line.transformed?.name || ""}
                  </span>
                </div>

                {/* 變卦干支 - 固定宽度 */}
                <div className="w-[48px] text-center text-sm">
                  {line.transformed?.stemBranch && (
                    <>
                      <span className={
                        line.original.status === "Static"
                          ? "text-stone-300"
                          : getStemColor(line.transformed.stemBranch[0])
                      }>
                        {line.transformed.stemBranch[0]}
                      </span>
                      <span className={
                        line.original.status === "Static"
                          ? "text-stone-300"
                          : getBranchColor(line.transformed.stemBranch[1])
                      }>
                        {line.transformed.stemBranch[1]}
                      </span>
                    </>
                  )}
                </div>

                {/* 變卦爻條 - 固定宽度 */}
                <div className="w-[48px] flex justify-center">
                  <div className={
                    line.original.status === "Static"
                      ? "opacity-40 grayscale"
                      : "opacity-100"
                  }>
                    {line.transformed && (
                      <YaoBar
                        isYang={line.transformed.isYang}
                        color="bg-stone-600"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
