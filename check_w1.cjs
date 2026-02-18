const fs = require('fs');
const c = fs.readFileSync('src/data/modulesData.js','utf8');
// Find all module IDs and count their quizzes
const idMatches = [...c.matchAll(/id:\s*'([^']+)'/g)];
for (let i = 0; i < idMatches.length; i++) {
  const id = idMatches[i][1];
  const start = idMatches[i].index;
  const end = i+1 < idMatches.length ? idMatches[i+1].index : c.length;
  const section = c.slice(start, end);
  const cnt = (section.match(/tipo:\s*'mini_quiz'/g) || []).length;
  if (cnt > 0) console.log(id + ': ' + cnt + ' (need +' + (10-cnt) + ')');
}
