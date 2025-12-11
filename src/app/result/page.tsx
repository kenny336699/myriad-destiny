"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generatePrompt } from "../../utils/aiService";
import { ResultPanel } from "../../components/ResultPanel";
import { DEFAULT_YAO_VALUES } from "../../constants/hexagram";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { useHexagramCalculation } from "../../hooks/useHexagramCalculation";

interface DivinationData {
  subject: string;
  selectedDate: string;
  yaoInputs: number[];
}

export default function ResultPage() {
  const router = useRouter();
  const [divinationData, setDivinationData] = useState<DivinationData | null>(
    null
  );

  // 複製功能
  const { copyStatus, copyToClipboard } = useCopyToClipboard();

  // 從 sessionStorage 讀取資料
  useEffect(() => {
    const savedData = sessionStorage.getItem("divinationData");
    if (savedData) {
      try {
        const data: DivinationData = JSON.parse(savedData);
        setDivinationData(data);
      } catch (error) {
        console.error("Failed to parse divination data:", error);
        // 如果解析失敗，返回首頁
        router.push("/");
      }
    } else {
      // 如果沒有資料，返回首頁
      router.push("/");
    }
  }, [router]);

  // 排盤計算
  const { calendarData, result, displayLines, metadata } =
    useHexagramCalculation({
      selectedDate: divinationData?.selectedDate || "",
      yaoInputs: divinationData?.yaoInputs || DEFAULT_YAO_VALUES,
      enabled: divinationData !== null,
    });

  // 返回輸入頁面
  const handleBack = useCallback(() => {
    router.push("/");
  }, [router]);

  // 複製提示詞
  const handleCopyPrompt = useCallback(async () => {
    if (!result || !divinationData) return;

    const prompt = generatePrompt({
      subject: divinationData.subject,
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
  }, [result, divinationData, calendarData, displayLines, copyToClipboard]);

  // 資料尚未載入時顯示 loading
  if (!divinationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <ResultPanel
      subject={divinationData.subject}
      calendarData={calendarData}
      mainGuaName={metadata.guaName}
      guaFamily={metadata.family}
      changedGuaName={metadata.changeGuaName}
      displayLines={displayLines}
      yaoInputs={divinationData.yaoInputs}
      copyStatus={copyStatus}
      onBack={handleBack}
      onCopyPrompt={handleCopyPrompt}
    />
  );
}
