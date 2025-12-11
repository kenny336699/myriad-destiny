"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { InputPanel } from "../components/InputPanel";
import { DEFAULT_YAO_VALUES } from "../constants/hexagram";
import { useCoinCasting } from "../hooks/useCoinCasting";

export default function App() {
  const router = useRouter();

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

  // 處理爻位變更
  const handleYaoChange = useCallback((index: number, value: number) => {
    setYaoInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index] = value;
      return newInputs;
    });
  }, []);

  // 開始排盤 - 保存資料並導航到結果頁面
  const handleStartDivination = useCallback(() => {
    // 保存資料到 sessionStorage
    const divinationData = {
      subject,
      selectedDate,
      yaoInputs,
    };
    sessionStorage.setItem("divinationData", JSON.stringify(divinationData));

    // 導航到結果頁面
    router.push("/result");
  }, [subject, selectedDate, yaoInputs, router]);

  // 處理銅錢擲卦完成
  const handleCoinComplete = useCallback(() => {
    setYaoInputs(coinYaoValues);
  }, [coinYaoValues]);

  // 處理數字起卦
  const handleNumberSubmit = useCallback((numbers: number[]) => {
    // 計算數字起卦結果
    const yaoValues: number[] = [];
    for (let i = 0; i < 6; i++) {
      const sum = (numbers[0] + numbers[1] + numbers[2] + i) % 4;
      yaoValues.push(sum);
    }
    setYaoInputs(yaoValues);
  }, []);

  // 處理時間起卦
  const handleTimeSubmit = useCallback((date: Date) => {
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
  }, []);

  return (
    <InputPanel
      subject={subject}
      selectedDate={selectedDate}
      yaoInputs={yaoInputs}
      onSubjectChange={setSubject}
      onDateChange={setSelectedDate}
      onYaoChange={handleYaoChange}
      onSubmit={handleStartDivination}
      coinTosses={tosses}
      isCoinAnimating={isAnimating}
      isCoinComplete={isCoinComplete}
      onCoinCast={castOnce}
      onCoinReset={resetCoin}
      onNumberSubmit={handleNumberSubmit}
      onTimeSubmit={handleTimeSubmit}
    />
  );
}
