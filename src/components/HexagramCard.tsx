import { YaoBar } from './YaoBar';
import type { DisplayLine } from '../types/hexagram';

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
    <div className="bg-white p-6 rounded-lg shadow-lg border border-stone-200 mb-8">
      {!hasResult ? (
        <div className="text-center text-red-500 py-10">
          排盤發生錯誤,找不到對應的卦象。請檢查輸入。
          <br />
          輸入代碼: [{yaoInputs.join(', ')}]
        </div>
      ) : (
        <>
          {/* 卦名區 */}
          <div className="flex justify-between mb-8 border-b border-dashed border-stone-300 pb-2">
            <div className="w-1/2 text-center">
              <span className="text-xs block text-stone-400">
                本卦 ({guaFamily})
              </span>
              <span className="text-xl font-bold text-stone-800">{mainGuaName}</span>
            </div>
            <div className="w-1/2 text-center">
              <span className="text-xs block text-stone-400">變卦</span>
              <span className="text-xl font-bold text-stone-600">{changedGuaName}</span>
            </div>
          </div>

          {/* 爻行區 */}
          <div className="flex flex-col gap-3">
            {displayLines.map((line) => (
              <div
                key={line.id}
                className="flex items-center min-h-[3rem] hover:bg-stone-50 transition-colors py-1"
              >
                {/* 六神 */}
                <div className="w-16 text-center text-sm font-medium text-stone-500 border-r border-stone-100">
                  {line.sixBeast}
                </div>

                {/* 伏神 */}
                <div className="w-24 px-2 text-xs text-stone-400 flex flex-col items-center justify-center">
                  {line.original.hidden && (
                    <>
                      <span>{line.original.hidden.name}</span>
                      <span>{line.original.hidden.stemBranch}</span>
                    </>
                  )}
                </div>

                {/* 本卦 */}
                <div className="flex-1 flex items-center justify-center gap-3 relative">
                  {/* 世應標記 */}
                  <div className="absolute left-0 text-[10px] font-bold w-4 text-center">
                    {line.original.isShi && (
                      <span className="text-red-600 border border-red-600 rounded px-0.5">
                        世
                      </span>
                    )}
                    {line.original.isYing && (
                      <span className="text-blue-600 border border-blue-600 rounded px-0.5">
                        應
                      </span>
                    )}
                  </div>

                  {/* 六親、干支 */}
                  <div className="text-right w-24 text-sm">
                    <span className="mr-2 font-medium">{line.original.name}</span>
                    <span className="text-stone-500">
                      {line.original.stemBranch}
                      {line.original.element}
                    </span>
                  </div>

                  {/* 爻條 */}
                  <div className="relative flex items-center">
                    <YaoBar isYang={line.original.isYang} color="bg-stone-800" />
                    {line.original.status === 'MovingCircle' && (
                      <div className="absolute -right-6 text-red-500 font-bold">○</div>
                    )}
                    {line.original.status === 'MovingCross' && (
                      <div className="absolute -right-6 text-red-500 font-bold">✕</div>
                    )}
                  </div>
                </div>

                {/* 箭頭 */}
                <div className="w-12 flex justify-center text-stone-300">
                  {line.original.status !== 'Static' ? '➔' : ''}
                </div>

                {/* 變卦 */}
                <div className="flex-1 flex items-center justify-start gap-3">
                  <div
                    className={
                      line.original.status === 'Static'
                        ? 'opacity-40 grayscale'
                        : 'opacity-100'
                    }
                  >
                    {line.transformed && (
                      <YaoBar isYang={line.transformed.isYang} color="bg-stone-600" />
                    )}
                  </div>
                  {line.transformed && (
                    <div
                      className={`text-left w-24 text-sm ${
                        line.original.status === 'Static'
                          ? 'text-stone-300'
                          : 'text-stone-600'
                      }`}
                    >
                      <span className="mr-2">{line.transformed.name}</span>
                      <span>
                        {line.transformed.stemBranch}
                        {line.transformed.element}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
