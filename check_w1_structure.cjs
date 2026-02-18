const fs = require('fs');
const c = fs.readFileSync('src/data/modulesData.js', 'utf8');
const lines = c.split('\n');
const mainIds = ['mod_intro_robot','mod_partes_robot','mod_primer_proyecto','mod_electr','mod_electon','mod_prog_gen','mod_mecanica','mod_arduino','mod_cpp','mod_python','mod_robotica','mod_componentes','mod_control','mod_prog_avanzada','mod_diseno','mod_primer_led'];

for (const mid of mainIds) {
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("'" + mid + "'")) { start = i; break; }
  }
  if (start < 0) { console.log(mid + ': NOT FOUND'); continue; }
  // Find the module object closing (line with just "    }," or "    }")
  for (let j = start + 1; j < lines.length; j++) {
    const l = lines[j].replace(/\r$/, '');
    if (l.match(/^\s{4}\},?\s*$/) || l.match(/^\s{4}\{\s*$/)) {
      // prev line should be end of contenidoTeorico
      const prev = lines[j-1].replace(/\r$/, '');
      console.log(mid + ' -> moduleClose L' + (j+1) + ', prevLine L' + j + ': ...' + prev.slice(-60));
      break;
    }
  }
}
