import type { CalendarData } from '../types/hexagram';

interface FourPillarsSectionProps {
  calendarData: CalendarData;
}

export function FourPillarsSection({ calendarData }: FourPillarsSectionProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 mb-6">
      <div className="grid grid-cols-5 gap-4 text-center">
        {/* 四柱 */}
        <div className="col-span-3 grid grid-cols-4 gap-2 border-r border-stone-300 pr-4">
          <div className="flex flex-col">
            <span className="text-xs text-stone-400 mb-1">年</span>
            <span className="font-bold text-lg">{calendarData.fourPillars.year}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-stone-400 mb-1">月</span>
            <span className="font-bold text-lg">{calendarData.fourPillars.month}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-stone-400 mb-1">日</span>
            <span className="font-bold text-lg">{calendarData.fourPillars.day}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-stone-400 mb-1">時</span>
            <span className="font-bold text-lg">{calendarData.fourPillars.hour}</span>
          </div>
        </div>

        {/* 神煞 */}
        <div className="col-span-2 grid grid-cols-2 gap-y-2 text-sm text-left pl-2">
          <div>
            <span className="text-stone-400">空亡：</span>
            {calendarData.shenSha.void}
          </div>
          <div>
            <span className="text-stone-400">驛馬：</span>
            {calendarData.shenSha.horse}
          </div>
          <div>
            <span className="text-stone-400">桃花：</span>
            {calendarData.shenSha.peach}
          </div>
          <div>
            <span className="text-stone-400">貴人：</span>
            {calendarData.shenSha.noble}
          </div>
        </div>
      </div>
    </div>
  );
}
