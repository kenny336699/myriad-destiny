

interface HexagramStructure {
  mainCode: number[];    // 本卦的陰陽陣列 (例如 [1, 1, 0, ...])
  changedCode: number[]; // 變卦的陰陽陣列
  movingLines: number[]; // 記錄哪幾爻在動 (例如 [1, 6]) -> 用於 UI 標記
}

/**
 * 將用戶輸入轉換為本卦與變卦的結構
 * @param inputs 用戶輸入的 6 個數字 (順序：初爻 -> 上爻)
 */
export function parseHexagram(inputs: number[]): HexagramStructure {
  const mainCode: number[] = [];
  const changedCode: number[] = [];
  const movingLines: number[] = [];

  inputs.forEach((code, index) => {
    // 爻位 (1-6)，因為 index 是 0-5
    const position = index + 1;

    switch (code) {
      case 0: // 老陽 (動)
        mainCode.push(1);    // 本卦：陽
        changedCode.push(0); // 變卦：陰
        movingLines.push(position);
        break;
        
      case 1: // 少陰 (靜)
        mainCode.push(0);    // 本卦：陰
        changedCode.push(0); // 變卦：陰
        break;
        
      case 2: // 少陽 (靜)
        mainCode.push(1);    // 本卦：陽
        changedCode.push(1); // 變卦：陽
        break;
        
      case 3: // 老陰 (動)
        mainCode.push(0);    // 本卦：陰
        changedCode.push(1); // 變卦：陽
        movingLines.push(position);
        break;
    }
  });

  return { mainCode, changedCode, movingLines };
}