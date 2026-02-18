const fs = require('fs');

function countQuizzes(file) {
  const d = fs.readFileSync(file, 'utf8');
  const idRegex = /id:\s*'([^']+)'/g;
  const allIds = [];
  let m;
  while ((m = idRegex.exec(d)) !== null) {
    if (m[1].startsWith('mod_') || m[1].startsWith('w2_') || m[1].startsWith('w3_') || m[1].startsWith('w4_') || m[1].startsWith('w5_') || m[1].startsWith('w6_')) {
      allIds.push({ id: m[1], pos: m.index });
    }
  }
  
  console.log(`\n=== ${file} (${allIds.length} modules) ===`);
  let total = 0;
  let needWork = 0;
  for (let i = 0; i < allIds.length; i++) {
    const start = allIds[i].pos;
    const end = i < allIds.length - 1 ? allIds[i+1].pos : d.length;
    const block = d.substring(start, end);
    const count = (block.match(/tipo:\s*'mini_quiz'/g) || []).length;
    total += count;
    const mark = count === 10 ? '✓' : count < 10 ? `NEED +${10-count}` : `OVER by ${count-10}`;
    if (count !== 10) needWork++;
    console.log(`  ${allIds[i].id}: ${count} [${mark}]`);
  }
  console.log(`  TOTAL: ${total} quizzes, ${needWork} modules need work`);
}

countQuizzes('src/data/modulesData.js');
countQuizzes('src/data/world2Data.js');
countQuizzes('src/data/world3Data.js');
countQuizzes('src/data/world4Data.js');
countQuizzes('src/data/world5Data.js');
