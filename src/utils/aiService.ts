import { FullHexagramResult } from './engine';
import { CalendarData } from './calendar';

// 定義傳入 AI 的資料結構
export interface AIDivinationRequest {
  subject: string;
  calendar: CalendarData;
  result: FullHexagramResult;
  sixGods: string[]; // 傳入計算好的六神陣列
}

/**
 * 產生給 LLM (Gemini/GPT) 的提示詞 (Prompt)
 */
export function generatePrompt(data: AIDivinationRequest): string {
  const { subject, calendar, result, sixGods } = data;
  const { mainGua, changedGua, lines } = result;

  // 1. 角色設定與基礎資訊
  let prompt = `你現在是一位精通《卜筮正宗》、《增刪卜易》與現代心理學的資深六爻占卜師。請依據下方的【專家知識庫】與卦象數據進行專業解讀。\n\n`;
  
  prompt += `### 📖 專家知識庫 (解卦依據)\n`;
  prompt += `請嚴格參考以下定義來取象與判斷吉凶：\n`;
  prompt += `1. **六親核心定義**：\n`;
  prompt += `   - **妻財**：受我掌控者。代表錢財、妻子/女友、下屬、飲食、私人物品、失物。\n`;
  prompt += `   - **父母**：生我庇護我者。代表長輩、文書/契約/成績、房屋/車輛、衣服、訊息、天氣(雨)。\n`;
  prompt += `   - **子孫**：我生者。代表晚輩/子女、醫生/醫藥、快樂/娛樂、寵物、解憂之神(剋官鬼/病災)。\n`;
  prompt += `   - **兄弟**：同輩競爭者。代表兄弟姐妹、朋友同事、競爭對手、破財/花費、阻礙(剋妻財)。\n`;
  prompt += `   - **官鬼**：剋我制約我者。代表上司、丈夫/男友、事業/官運、疾病/災禍、憂慮/盜賊。\n`;
  prompt += `2. **旺衰法則**：\n`;
  prompt += `   - **月建**：掌一月之權，決定爻的旺衰根基。\n`;
  prompt += `   - **日辰**：司四時之旺，主宰當下與未來。日辰沖旺相靜爻為「暗動」(有力)，沖休囚靜爻為「日破」(無用)。\n`;
  prompt += `   - **旬空**：旺相或發動為「假空」(暫時受阻，出空/沖實應吉凶)；休囚安靜為「真空」(到底無用)。\n`;
  prompt += `3. **特殊狀態**：\n`;
  prompt += `   - **墓庫** (金墓丑/木墓未/火墓戌/水土墓辰)：象徵收藏、昏沉、被控制、躲避、迷戀。解法：沖墓或沖爻。\n`;
  prompt += `   - **絕**：象徵無情、絕望、消失。動爻化絕(如酉化寅)為凶象。\n`;
  prompt += `4. **分類斷法**：\n`;
  prompt += `   - **求財**：喜財旺持世、生世。忌兄弟持世(除非財亦旺)。動爻化財吉，化兄弟凶。\n`;
  prompt += `   - **問婚**：男測以財為用，女測以官為用。世應相生吉，相剋凶。\n`;
  prompt += `   - **問病**：官鬼為病灶，或者「空破墓絕」之處即為病處。子孫為醫藥/醫生。旺者吉，衰破墓絕者凶。\n\n`;

  prompt += `### 📋 用戶占卜資料\n`;
  prompt += `- **所測之事**：${subject || "未指定 (請分析當前整體運勢)"}\n`;
  prompt += `- **起卦時間**：${calendar.lunarString} (${calendar.dateString})\n`;
  prompt += `- **干支四柱**：${calendar.fourPillars.year}年 ${calendar.fourPillars.month}月 ${calendar.fourPillars.day}日 ${calendar.fourPillars.hour}時\n`;
  prompt += `- **神煞**：空亡[${calendar.shenSha.void}]  驛馬[${calendar.shenSha.horse}]  桃花[${calendar.shenSha.peach}]  貴人[${calendar.shenSha.noble}]\n\n`;

  // 2. 卦象結構
  prompt += `### 🔮 卦象結構\n`;
  prompt += `- **本卦**：${mainGua.palace}${mainGua.element}宮 - **${mainGua.name}** (世爻在第${mainGua.shi}爻)\n`;
  prompt += `- **變卦**：**${changedGua.name}**\n\n`;

  // 3. 六爻詳情
  prompt += `### 📝 六爻詳情 (由上而下)\n`;
  prompt += `| 六神 | 六親 | 世應 | 干支五行 | 狀態/伏神/變動 |\n`;
  prompt += `|---|---|---|---|---|\n`;
  
  // 反轉陣列以從上爻開始列出
  const reversedLines = [...lines].reverse();
  const reversedGods = [...sixGods].reverse();

  reversedLines.forEach((line, idx) => {
    // 取得對應的六神
    const god = reversedGods[idx];
    
    // 標記世應
    let tags = "";
    if (line.isShi) tags = "世";
    if (line.isYing) tags = "應";

    // 伏神資訊
    let extraInfo = "";
    if (line.status !== 'Static') {
      let changeType = "動";
      if (line.status === 'MovingCircle') changeType = "動(O)"; // 老陽
      if (line.status === 'MovingCross') changeType = "動(X)";  // 老陰
      extraInfo += `${changeType} -> 變${line.transformed?.name}(${line.transformed?.stemBranch}${line.transformed?.element})`;
    }
    
    if (line.hidden) {
      if (extraInfo) extraInfo += " / ";
      extraInfo += `伏: ${line.hidden.name}(${line.hidden.stemBranch}${line.hidden.element})`;
    }

    // 組合單行 Markdown 表格
    prompt += `| ${god} | ${line.relation} | ${tags} | ${line.najia.stem}${line.najia.branch}${line.najia.element} | ${extraInfo} |\n`;
  });

  prompt += `\n### 💡 請依據【專家知識庫】進行邏輯推演：\n`;
  prompt += `1. **定用神**：根據「所測之事」選定用神（例如問財看妻財，問病看官鬼/子孫）。\n`;
  prompt += `2. **吉凶總斷**：分析用神在日月建的旺衰，以及動爻的生剋沖合，直接回答吉凶。\n`;
  prompt += `3. **細節分析**：\n`;
  prompt += `   - **世應關係**：分析世爻（自己）與應爻（他人/環境）的關係。\n`;
  prompt += `   - **特殊訊號**：檢查是否有「暗動」、「化絕」、「入墓」、「旬空」等情況，並解釋其含義（參考知識庫）。\n`;
  prompt += `4. **應期預測**：若事有可成，何時應驗？（參考沖合、出空、長生帝旺之時）。\n`;
  prompt += `5. **大師建議**：給予當事人具體且溫暖的建議。\n`;

  return prompt;
}

/**
 * (保留) 模擬 AI 解卦 - 實際使用時請替換為 fetch API
 */
export async function fetchAIInterpretation(): Promise<string> {

  // console.log("Generated Prompt:", prompt);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`(此為模擬回傳，請使用複製 Prompt 功能貼給 AI)\n\nPrompt 已生成！內容包含了您提供的專業知識庫。`);
    }, 1000);
  });
}