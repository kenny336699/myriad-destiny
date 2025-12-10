import { findHiddenSpirits } from './src/utils/hiddenSpirit';
import { NAJIA_TABLE } from './src/constants/najia';
import { SIX_RELATIONS_MAP } from './src/constants/elementInteractions';
import { getPalaceElement } from './src/constants/sixtyFourGua';

// 測試震宮的伏神
const palaceName = '震';
const presentRelations = ['父母', '妻財', '官鬼']; // 水風井卦的六親

console.log('=== 調試伏神系統 ===');
console.log('宮位:', palaceName);
console.log('本宮五行:', getPalaceElement(palaceName));
console.log('已出現六親:', presentRelations);

// 檢查震為雷卦（震宮首卦）
const pureCode = '100100'; // 震為雷
console.log('\n=== 震為雷卦（震宮首卦）===');
console.log('卦碼:', pureCode);

const lowerCode = pureCode.slice(0, 3);
const upperCode = pureCode.slice(3, 6);
console.log('下卦碼:', lowerCode);
console.log('上卦碼:', upperCode);

const lowerNajia = NAJIA_TABLE[lowerCode as keyof typeof NAJIA_TABLE]?.inner || [];
const upperNajia = NAJIA_TABLE[upperCode as keyof typeof NAJIA_TABLE]?.outer || [];
const fullNajia = [...lowerNajia, ...upperNajia];

const palaceElement = getPalaceElement(palaceName);
console.log('\n震宮首卦各爻:');
fullNajia.forEach((najia, index) => {
  const relation = SIX_RELATIONS_MAP[palaceElement]?.[najia.element] || '未知';
  console.log(`  第${index + 1}爻: ${najia.stem}${najia.branch} (${najia.element}) -> ${relation}`);
});

// 呼叫伏神函數
console.log('\n=== 呼叫 findHiddenSpirits ===');
const hiddenSpirits = findHiddenSpirits(palaceName, presentRelations);

if (hiddenSpirits.length === 0) {
  console.log('❌ 未找到伏神！');
} else {
  console.log(`✅ 找到 ${hiddenSpirits.length} 個伏神:`);
  hiddenSpirits.forEach(hs => {
    console.log(`  ${hs.name} 伏於第${hs.position}爻: ${hs.stem}${hs.branch} (${hs.element})`);
  });
}
