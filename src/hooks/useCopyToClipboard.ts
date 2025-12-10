import { useState, useCallback } from 'react';
import { COPY_TIMEOUT_MS } from '../constants/hexagram';

type CopyStatus = 'idle' | 'copied';

interface UseCopyToClipboardResult {
  copyStatus: CopyStatus;
  copyToClipboard: (text: string) => Promise<void>;
  resetCopyStatus: () => void;
}

export function useCopyToClipboard(): UseCopyToClipboardResult {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      // 使用現代 Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // 不再使用已廢棄的 execCommand fallback
        throw new Error('Clipboard API not supported');
      }

      setCopyStatus('copied');

      // 自動重置狀態
      setTimeout(() => {
        setCopyStatus('idle');
      }, COPY_TIMEOUT_MS);
    } catch (err) {
      console.error('複製失敗:', err);
      // 拋出錯誤讓調用者處理
      throw err;
    }
  }, []);

  const resetCopyStatus = useCallback(() => {
    setCopyStatus('idle');
  }, []);

  return {
    copyStatus,
    copyToClipboard,
    resetCopyStatus,
  };
}
