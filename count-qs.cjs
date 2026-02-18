const fs = require('fs');

function countQuestions(filePath, moduleIds) {
  const src = fs.readFileSync(filePath, 'utf-8');
  moduleIds.forEach(id => {
    const i = src.indexOf("id: '" + id + "'");
    if (i === -1) { console.log(id + ': NOT FOUND'); return; }
    const ct = src.indexOf('contenidoTeorico:', i);
    const br = src.indexOf('[', ct);
    let d = 0, e = -1;
    for (let j = br; j < src.length; j++) {
      if (src[j] === '[') d++;
      else if (src[j] === ']') { d--; if (d === 0) { e = j; break; } }
    }
    const block = src.slice(br, e + 1);
    const c = (block.match(/tipo:\s*'(mini_quiz|true_false|matching_game)'/g) || []).length;
    console.log(id + ': ' + c);
  });
}

console.log('=== WORLD 3 ===');
countQuestions('src/data/world3Data.js', [
  'w3_mod1_biomimetica','w3_mod2_locomocion','w3_mod3_musculos_artificiales','w3_mod4_sentidos_bio',
  'w3_mod5_protesis_intro','w3_mod6_exoesqueletos','w3_mod7_wearables','w3_mod8_interfaz_cerebro',
  'w3_mod9_robots_blandos','w3_mod10_bioimpresion','w3_mod11_ecosistemas','w3_mod12_enjambres',
  'w3_mod13_micro_robots','w3_mod14_bioetica','w3_mod15_diseno_bio','w3_mod16_proyecto_bio_final'
]);
