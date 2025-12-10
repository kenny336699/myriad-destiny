import { generateFullHexagramData } from './src/utils/engine';

// 測試輸入: 122121
const testInput = [1, 2, 2, 1, 2, 1];

console.log('=== 測試 generateFullHexagramData ===');
console.log('輸入:', testInput.join(''));
console.log('\n解析:');
testInput.forEach((code, idx) => {
  const types = ['老陽(動)', '少陰(靜)', '少陽(靜)', '老陰(動)'];
  console.log(`  第${idx + 1}爻: ${code} = ${types[code]}`);
});

const result = generateFullHexagramData(testInput);

if (!result) {
  console.error('\n❌ 錯誤: 無法生成卦象資料');
  process.exit(1);
}

console.log('\n=== 卦象資料 ===');
console.log('\n本卦:', result.mainGua.name);
console.log('  宮位:', result.mainGua.palace);
console.log('  世爻:', result.mainGua.shi);
console.log('  應爻:', result.lines.find(l => l.isYing)?.position);

console.log('\n變卦:', result.changedGua.name);
console.log('  宮位:', result.changedGua.palace);

// 統計六親
const relationsCount = new Map<string, number>();
result.lines.forEach(line => {
  relationsCount.set(line.relation, (relationsCount.get(line.relation) || 0) + 1);
});

console.log('\n=== 六親統計 ===');
const allRelations = ['父母', '兄弟', '子孫', '妻財', '官鬼'];
allRelations.forEach(rel => {
  const count = relationsCount.get(rel) || 0;
  if (count === 0) {
    console.log(`  ${rel}: ❌ 缺失 (需要伏神)`);
  } else {
    console.log(`  ${rel}: ${count}個`);
  }
});

console.log('\n=== 爻位詳細資訊 ===');
result.lines.forEach((line) => {
  console.log(`\n第${line.position}爻 (${line.isYang ? '陽' : '陰'}爻):`);
  console.log(`  原始碼: ${line.originalCode}`);
  console.log(`  狀態: ${line.status}${line.isMoving ? ' (動爻)' : ''}`);
  console.log(`  世應: ${line.isShi ? '世' : ''}${line.isYing ? '應' : ''}`);
  console.log(`  納甲: ${line.najia.stem}${line.najia.branch} (${line.najia.element})`);
  console.log(`  六親: ${line.relation}`);

  if (line.hidden) {
    console.log(`  ⚠️  伏神: ${line.hidden.name} ${line.hidden.stemBranch} (${line.hidden.element})`);
  }

  if (line.transformed) {
    console.log(`  變爻: ${line.transformed.name} ${line.transformed.stemBranch} (${line.transformed.element})`);
  }
});

console.log('\n=== 測試完成 ✓ ===');
