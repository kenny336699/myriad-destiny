"use client";
import { useCallback, useState } from "react";
import { generatePrompt } from "../utils/aiService";
import { ResultPanel } from "../components/ResultPanel";
import { InputPanel } from "../components/InputPanel";
import { CoinCastingPanel } from "../components/CoinCastingPanel";
import { NumberTimeInputPanel } from "../components/NumberTimeInputPanel";
import { DEFAULT_YAO_VALUES } from "../constants/hexagram";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { useHexagramCalculation } from "../hooks/useHexagramCalculation";
import { useCoinCasting } from "../hooks/useCoinCasting";
import {
  useNumberBasedHexagram,
  useTimeBasedHexagram,
} from "../hooks/useNumberTimeHexagram";

type ViewMode = "input" | "result" | "coin" | "numberTime";

export default function App() {
  // 視圖模式
  const [viewMode, setViewMode] = useState<ViewMode>("input");

  // 輸入資料狀態
  const [subject, setSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [yaoInputs, setYaoInputs] = useState<number[]>(DEFAULT_YAO_VALUES);

  // 銅錢擲卦功能
  const {
    yaoValues: coinYaoValues,
    tosses,
    isAnimating,
    isComplete: isCoinComplete,
    castOnce,
    reset: resetCoin,
  } = useCoinCasting();

  // 複製功能
  const { copyStatus, copyToClipboard, resetCopyStatus } = useCopyToClipboard();

  // 排盤計算 (只在 result 模式下執行)
  const { calendarData, result, displayLines, metadata } =
    useHexagramCalculation({
      selectedDate,
      yaoInputs,
      enabled: viewMode === "result",
    });

  // 數字/時間起卦計算
  const numberBasedYao = useNumberBasedHexagram([]);
  const timeBasedYao = useTimeBasedHexagram(new Date());

  // 處理爻位變更
  const handleYaoChange = useCallback((index: number, value: number) => {
    setYaoInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index] = value;
      return newInputs;
    });
  }, []);

  // 開始排盤
  const handleStartDivination = useCallback(() => {
    resetCopyStatus();
    setViewMode("result");
  }, [resetCopyStatus]);

  // 處理銅錢擲卦完成
  const handleCoinComplete = useCallback(() => {
    setYaoInputs(coinYaoValues);
    resetCopyStatus();
    setViewMode("result");
  }, [coinYaoValues, resetCopyStatus]);

  // 處理數字起卦
  const handleNumberSubmit = useCallback(
    (numbers: number[]) => {
      // 計算數字起卦結果
      const yaoValues: number[] = [];
      for (let i = 0; i < 6; i++) {
        const sum = (numbers[0] + numbers[1] + numbers[2] + i) % 4;
        yaoValues.push(sum);
      }
      setYaoInputs(yaoValues);
      resetCopyStatus();
      setViewMode("result");
    },
    [resetCopyStatus]
  );

  // 處理時間起卦
  const handleTimeSubmit = useCallback(
    (date: Date) => {
      const year = date.getFullYear() % 100;
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();

      const yaoValues: number[] = [];
      const baseNumbers = [year, month, day];
      for (let i = 0; i < 6; i++) {
        const sum = baseNumbers[0] + baseNumbers[1] + baseNumbers[2] + hour + i;
        yaoValues.push(sum % 4);
      }

      setYaoInputs(yaoValues);
      resetCopyStatus();
      setViewMode("result");
    },
    [resetCopyStatus]
  );

  // 返回輸入
  const handleBack = useCallback(() => {
    setViewMode("input");
  }, []);

  const handleBackFromNumberTime = useCallback(() => {
    setViewMode("input");
  }, []);

  // 複製提示詞
  const handleCopyPrompt = useCallback(async () => {
    if (!result) return;

    const prompt = generatePrompt({
      subject,
      calendar: calendarData,
      result: result,
      sixGods: displayLines.map((line) => line.sixBeast),
    });

    try {
      await copyToClipboard(prompt);
    } catch (err) {
      // 錯誤處理 - 可以在未來改為 Toast 通知
      alert("複製失敗，請確保瀏覽器支援剪貼簿功能。");
    }
  }, [result, subject, calendarData, displayLines, copyToClipboard]);

  // 渲染銅錢擲卦介面
  if (viewMode === "coin") {
    return (
      <CoinCastingPanel
        tosses={tosses}
        isAnimating={isAnimating}
        isComplete={isCoinComplete}
        onCastClick={castOnce}
        onComplete={handleCoinComplete}
        onReset={resetCoin}
      />
    );
  }

  // 渲染數字/時間起卦介面
  if (viewMode === "numberTime") {
    return (
      <NumberTimeInputPanel
        onNumberSubmit={handleNumberSubmit}
        onTimeSubmit={handleTimeSubmit}
        onBack={handleBackFromNumberTime}
      />
    );
  }

  // 渲染輸入介面
  if (viewMode === "input") {
    return (
      <InputPanel
        subject={subject}
        selectedDate={selectedDate}
        yaoInputs={yaoInputs}
        onSubjectChange={setSubject}
        onDateChange={setSelectedDate}
        onYaoChange={handleYaoChange}
        onSubmit={handleStartDivination}
        onCoinCasting={() => setViewMode("coin")}
        onNumberTime={() => setViewMode("numberTime")}
      />
    );
  }

  // 渲染結果介面
  return (
    <ResultPanel
      subject={subject}
      calendarData={calendarData}
      mainGuaName={metadata.guaName}
      guaFamily={metadata.family}
      changedGuaName={metadata.changeGuaName}
      displayLines={displayLines}
      yaoInputs={yaoInputs}
      copyStatus={copyStatus}
      onBack={handleBack}
      onCopyPrompt={handleCopyPrompt}
    />
  );
}
