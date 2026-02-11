import React, { useState } from 'react';
import { ArrowLeft, Download, Award, CheckCircle, Lock, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';

// Module licenses data — maps module IDs to license info
const MODULE_LICENSES = [
  { moduleId: 'mod_intro_robot', title: 'Introducción a la Robótica', icon: '🤖', licenseTitle: 'Explorador Robótico', color: '#2563EB', description: 'Conoces qué es un robot y sus componentes básicos' },
  { moduleId: 'mod_partes_robot', title: 'Partes de un Robot', icon: '🧩', licenseTitle: 'Anatomista Mecánico', color: '#7C3AED', description: 'Identificas las partes esenciales de un robot' },
  { moduleId: 'mod_primer_proyecto', title: 'Primer Proyecto', icon: '🛠️', licenseTitle: 'Constructor Principiante', color: '#059669', description: 'Has completado tu primer proyecto de robótica' },
  { moduleId: 'mod_electr', title: 'Electricidad Básica', icon: '⚡', licenseTitle: 'Electricista Junior', color: '#F59E0B', description: 'Entiendes los fundamentos de la electricidad' },
  { moduleId: 'mod_electon', title: 'Electrónica', icon: '🔌', licenseTitle: 'Técnico Electrónico', color: '#EF4444', description: 'Dominas los componentes electrónicos básicos' },
  { moduleId: 'mod_prog_gen', title: 'Programación General', icon: '💻', licenseTitle: 'Programador Novato', color: '#3B82F6', description: 'Conoces los fundamentos de la programación' },
  { moduleId: 'mod_mecanica', title: 'Mecánica', icon: '⚙️', licenseTitle: 'Ingeniero Mecánico Jr.', color: '#6366F1', description: 'Entiendes los principios mecánicos de la robótica' },
  { moduleId: 'mod_arduino', title: 'Arduino', icon: '🔷', licenseTitle: 'Especialista Arduino', color: '#00979D', description: 'Sabes programar y usar placas Arduino' },
  { moduleId: 'mod_cpp', title: 'C++', icon: '🔧', licenseTitle: 'Programador C++', color: '#659AD2', description: 'Dominas los fundamentos de C++ para robótica' },
  { moduleId: 'mod_python', title: 'Python', icon: '🐍', licenseTitle: 'Programador Python', color: '#3776AB', description: 'Programas en Python con confianza' },
  { moduleId: 'mod_robotica', title: 'Robótica Avanzada', icon: '🤖', licenseTitle: 'Robótico Avanzado', color: '#DC2626', description: 'Dominas conceptos avanzados de robótica' },
  { moduleId: 'mod_componentes', title: 'Componentes', icon: '🧬', licenseTitle: 'Experto en Componentes', color: '#0891B2', description: 'Conoces todos los componentes electrónicos' },
  { moduleId: 'mod_control', title: 'Control', icon: '🎮', licenseTitle: 'Controlador de Sistemas', color: '#4F46E5', description: 'Entiendes los sistemas de control robótico' },
  { moduleId: 'mod_prog_avanzada', title: 'Programación Avanzada', icon: '🚀', licenseTitle: 'Programador Experto', color: '#9333EA', description: 'Dominas la programación avanzada para robots' },
  { moduleId: 'mod_diseno', title: 'Diseño', icon: '✏️', licenseTitle: 'Diseñador Robótico', color: '#EC4899', description: 'Sabes diseñar robots desde cero' },
  { moduleId: 'mod_primer_led', title: 'Primer LED', icon: '💡', licenseTitle: 'Iluminador Digital', color: '#F97316', description: 'Has dado vida a tu primer circuito LED' },
];

const DIRECTOR_NAME = 'Abraham Isaías Navarro Doñate';

// Today's date in Spanish
const getFormattedDate = () => {
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const d = new Date();
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
};

// License Card component
const LicenseCard = ({ license, isUnlocked, onView }) => {
  const rarity = isUnlocked ? 'unlocked' : 'locked';
  
  return (
    <div 
      onClick={isUnlocked ? onView : null}
      className={`relative rounded-2xl border-2 p-4 transition-all ${
        isUnlocked 
          ? 'bg-white border-[#58CC02]/30 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98] hover:border-[#58CC02]' 
          : 'bg-gray-50 border-[#E5E5E5] opacity-60'
      }`}
    >
      {/* Badge */}
      {isUnlocked && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#58CC02] rounded-full flex items-center justify-center shadow-md">
          <CheckCircle size={16} className="text-white" />
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          isUnlocked ? 'bg-gradient-to-br from-white to-gray-50 shadow-inner' : 'bg-gray-100'
        }`} style={isUnlocked ? { border: `2px solid ${license.color}20` } : {}}>
          {isUnlocked ? license.icon : <Lock size={20} className="text-gray-300" />}
        </div>
        <div className="flex-grow min-w-0">
          <p className={`text-sm font-black truncate ${isUnlocked ? 'text-[#3C3C3C]' : 'text-[#AFAFAF]'}`}>
            {license.licenseTitle}
          </p>
          <p className={`text-xs font-semibold truncate ${isUnlocked ? 'text-[#777]' : 'text-[#CDCDCD]'}`}>
            {license.title}
          </p>
          {isUnlocked && (
            <p className="text-[10px] text-[#58CC02] font-black mt-0.5">✅ Licencia obtenida</p>
          )}
        </div>
        {isUnlocked && (
          <ChevronRight size={16} className="text-[#CDCDCD] flex-shrink-0" />
        )}
      </div>
    </div>
  );
};

// License Detail Modal
const LicenseModal = ({ license, fullName, onClose }) => {
  if (!license) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 animate-scale-in shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* License visual */}
        <div className="text-center mb-4">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-3 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${license.color}15, ${license.color}30)`, border: `3px solid ${license.color}40` }}>
            {license.icon}
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-black text-white mb-2" style={{ backgroundColor: license.color }}>
            LICENCIA OBTENIDA
          </div>
          <h2 className="text-xl font-black text-[#3C3C3C]">{license.licenseTitle}</h2>
          <p className="text-sm text-[#777] font-semibold mt-1">{license.title}</p>
        </div>
        
        {/* Certificate-like content */}
        <div className="bg-[#F7F7F7] rounded-2xl p-4 mb-4 border border-[#E5E5E5]">
          <p className="text-xs text-[#AFAFAF] font-bold text-center mb-2">Se certifica que</p>
          <p className="text-base font-black text-center mb-2" style={{ color: license.color }}>{fullName}</p>
          <p className="text-xs text-[#777] font-semibold text-center leading-relaxed">{license.description}</p>
          <div className="mt-3 pt-3 border-t border-[#E5E5E5] flex justify-between items-center">
            <p className="text-[10px] text-[#AFAFAF] font-bold">CultivaTec</p>
            <p className="text-[10px] text-[#AFAFAF] font-bold">{getFormattedDate()}</p>
          </div>
        </div>
        
        <button onClick={onClose} className="w-full py-3 bg-[#2563EB] text-white font-black rounded-xl border-b-4 border-[#1D4ED8] active:scale-95 transition text-sm">
          ¡Genial! 🎉
        </button>
      </div>
    </div>
  );
};

// ============================================================
// Helper: load image from URL as base64 data URL for PDF
// ============================================================
const loadImageAsBase64 = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

// ============================================================
// Draw ornate corner flourish on PDF (for each corner)
// ============================================================
const drawCornerOrnament = (doc, x, y, size, flipX, flipY) => {
  const sx = flipX ? -1 : 1;
  const sy = flipY ? -1 : 1;
  const s = size / 20;

  // Outer bracket — thick
  doc.setDrawColor(195, 160, 40);
  doc.setLineWidth(0.8);
  const outer = [
    [0, 20], [0, 6], [0, 2.5], [2.5, 0], [6, 0], [20, 0]
  ];
  for (let i = 0; i < outer.length - 1; i++) {
    doc.line(
      x + outer[i][0] * s * sx, y + outer[i][1] * s * sy,
      x + outer[i+1][0] * s * sx, y + outer[i+1][1] * s * sy
    );
  }

  // Inner bracket — thin blue
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.35);
  const inner = [
    [2.5, 17], [2.5, 5], [2.5, 3.5], [3.5, 2.5], [5, 2.5], [17, 2.5]
  ];
  for (let i = 0; i < inner.length - 1; i++) {
    doc.line(
      x + inner[i][0] * s * sx, y + inner[i][1] * s * sy,
      x + inner[i+1][0] * s * sx, y + inner[i+1][1] * s * sy
    );
  }

  // Innermost accent — dashed gold
  doc.setDrawColor(210, 180, 60);
  doc.setLineWidth(0.2);
  const accent = [
    [4.5, 14], [4.5, 6], [4.5, 5], [5, 4.5], [6, 4.5], [14, 4.5]
  ];
  for (let i = 0; i < accent.length - 1; i++) {
    doc.line(
      x + accent[i][0] * s * sx, y + accent[i][1] * s * sy,
      x + accent[i+1][0] * s * sx, y + accent[i+1][1] * s * sy
    );
  }

  // Diamond ornament at vertex
  doc.setFillColor(195, 160, 40);
  const dx = x + 1.2 * s * sx, dy = y + 1.2 * s * sy;
  const d = 1.8 * s;
  doc.triangle(dx, dy - d, dx + d, dy, dx, dy + d, 'F');
  doc.triangle(dx, dy - d, dx - d, dy, dx, dy + d, 'F');

  // Tiny circle accent
  doc.setFillColor(37, 99, 235);
  doc.circle(x + 7 * s * sx, y + 7 * s * sy, 0.5 * s, 'F');
};

// ============================================================
// Draw premium gold seal / medal stamp
// ============================================================
const drawGoldSeal = (doc, cx, cy, radius) => {
  const r = radius;

  // Outer shadow ring
  doc.setFillColor(180, 150, 40);
  doc.setGState(new doc.GState({ opacity: 0.15 }));
  doc.circle(cx + 0.5, cy + 0.5, r * 1.2, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));

  // Starburst teeth (32 points for smoother star)
  const teeth = 32;
  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2;
    const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
    const midAngle = (angle + nextAngle) / 2;
    const outerR = r * 1.18;
    const innerR = r * 0.95;
    doc.setFillColor(200, 165, 45);
    doc.triangle(
      cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR,
      cx + Math.cos(midAngle) * innerR, cy + Math.sin(midAngle) * innerR,
      cx + Math.cos(nextAngle) * outerR, cy + Math.sin(nextAngle) * outerR,
      'F'
    );
  }

  // Main circle with gradient simulation (3 layers)
  doc.setFillColor(225, 195, 80);
  doc.circle(cx, cy, r * 0.92, 'F');
  doc.setFillColor(215, 185, 65);
  doc.circle(cx, cy, r * 0.85, 'F');
  doc.setFillColor(220, 190, 75);
  doc.circle(cx, cy, r * 0.78, 'F');

  // Double ring border
  doc.setDrawColor(170, 135, 25);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, r * 0.74, 'S');
  doc.setLineWidth(0.3);
  doc.circle(cx, cy, r * 0.66, 'S');

  // Monogram "CT"
  doc.setFontSize(r * 1.3);
  doc.setTextColor(130, 100, 15);
  doc.setFont('times', 'bold');
  doc.text('CT', cx, cy + r * 0.18, { align: 'center' });

  // Top/bottom curved label text
  doc.setFontSize(r * 0.32);
  doc.setTextColor(140, 110, 20);
  doc.setFont('helvetica', 'bold');
  doc.text('★ CULTIVATEC ★', cx, cy - r * 0.44, { align: 'center' });
  doc.setFontSize(r * 0.28);
  doc.text('CERTIFICADO OFICIAL', cx, cy + r * 0.58, { align: 'center' });

  // Tiny stars decorations
  doc.setFontSize(r * 0.22);
  doc.text('✦', cx - r * 0.55, cy + r * 0.08, { align: 'center' });
  doc.text('✦', cx + r * 0.55, cy + r * 0.08, { align: 'center' });
};

// ============================================================
// Draw decorative guilloche-style line pattern
// ============================================================
const drawGuillocheLine = (doc, x1, x2, y, color) => {
  const [r, g, b] = color;
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(0.15);
  const segments = 40;
  const segW = (x2 - x1) / segments;
  for (let i = 0; i < segments; i++) {
    const sx = x1 + i * segW;
    const wave = Math.sin((i / segments) * Math.PI * 6) * 1.2;
    const wave2 = Math.sin(((i + 0.5) / segments) * Math.PI * 6) * 1.2;
    doc.line(sx, y + wave, sx + segW, y + wave2);
    doc.line(sx, y - wave, sx + segW, y - wave2);
  }
};

// ============================================================
// PREMIUM PDF CERTIFICATE GENERATOR
// ============================================================
const generateCertificatePDF = async (fullName, completedCount, totalCount) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
  const w = doc.internal.pageSize.getWidth();   // 279.4
  const h = doc.internal.pageSize.getHeight();  // 215.9
  const m = 8; // outer margin

  // ── Load images in parallel ──────────────────────────
  const [logoData, firmaData] = await Promise.all([
    loadImageAsBase64('./logo-v2.png'),
    loadImageAsBase64('./firma.png'),
  ]);

  // ═══════════════ BACKGROUND ═══════════════
  // Warm ivory parchment base
  doc.setFillColor(253, 251, 244);
  doc.rect(0, 0, w, h, 'F');

  // Subtle textured gradient (concentric fading rectangles)
  for (let i = 0; i < 12; i++) {
    doc.setGState(new doc.GState({ opacity: 0.006 + i * 0.002 }));
    doc.setFillColor(37, 99, 235);
    doc.rect(m + i * 5, m + i * 4, w - m * 2 - i * 10, h - m * 2 - i * 8, 'F');
  }
  doc.setGState(new doc.GState({ opacity: 1 }));

  // ═══════════════ BORDER SYSTEM ═══════════════
  // Outermost — heavy gold
  doc.setDrawColor(180, 148, 35);
  doc.setLineWidth(3);
  doc.rect(m, m, w - m * 2, h - m * 2);

  // Second — thin dark accent
  doc.setDrawColor(140, 115, 25);
  doc.setLineWidth(0.3);
  doc.rect(m + 2.5, m + 2.5, w - m * 2 - 5, h - m * 2 - 5);

  // Third — blue feature border
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1.2);
  doc.rect(m + 5, m + 5, w - m * 2 - 10, h - m * 2 - 10);

  // Fourth — thin blue inner
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.25);
  doc.rect(m + 7.5, m + 7.5, w - m * 2 - 15, h - m * 2 - 15);

  // Innermost — thin gold
  doc.setDrawColor(210, 180, 60);
  doc.setLineWidth(0.2);
  doc.rect(m + 9, m + 9, w - m * 2 - 18, h - m * 2 - 18);

  // ═══════════════ CORNER ORNAMENTS ═══════════════
  const co = m + 9;
  drawCornerOrnament(doc, co, co, 18, false, false);
  drawCornerOrnament(doc, w - co, co, 18, true, false);
  drawCornerOrnament(doc, co, h - co, 18, false, true);
  drawCornerOrnament(doc, w - co, h - co, 18, true, true);

  // ═══════════════ TOP DECORATIVE BAND ═══════════════
  const topBandY = 26;
  // Gold lines
  doc.setDrawColor(195, 160, 40);
  doc.setLineWidth(0.5);
  doc.line(40, topBandY, w / 2 - 35, topBandY);
  doc.line(w / 2 + 35, topBandY, w - 40, topBandY);
  // Guilloche wave ornament in the middle
  drawGuillocheLine(doc, w / 2 - 34, w / 2 + 34, topBandY, [195, 160, 40]);
  // Small gold diamonds at line ends
  const drawMiniDiamond = (xx, yy, sz) => {
    doc.setFillColor(195, 160, 40);
    doc.triangle(xx, yy - sz, xx + sz, yy, xx, yy + sz, 'F');
    doc.triangle(xx, yy - sz, xx - sz, yy, xx, yy + sz, 'F');
  };
  drawMiniDiamond(40, topBandY, 1.5);
  drawMiniDiamond(w - 40, topBandY, 1.5);

  // ═══════════════ LOGO ═══════════════
  let contentTop = 30;
  if (logoData) {
    const logoW = 24, logoH = 24;
    doc.addImage(logoData, 'PNG', w / 2 - logoW / 2, contentTop, logoW, logoH);
    contentTop += logoH + 2;
  }

  // Institution name
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.text('CultivaTec', w / 2, contentTop + 4, { align: 'center' });

  // Tagline
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Programa Educativo de Robótica, Electrónica y Programación', w / 2, contentTop + 9, { align: 'center' });

  // ═══════════════ CERTIFICATE TITLE ═══════════════
  const titleY = contentTop + 20;

  // Pre-title line
  doc.setFontSize(8.5);
  doc.setTextColor(195, 160, 40);
  doc.setFont('helvetica', 'bold');
  doc.text('— — —    OTORGA EL PRESENTE    — — —', w / 2, titleY - 2, { align: 'center' });

  // Main title
  doc.setFontSize(28);
  doc.setTextColor(25, 25, 45);
  doc.setFont('times', 'bold');
  doc.text('CERTIFICADO DE FINALIZACIÓN', w / 2, titleY + 8, { align: 'center' });

  // Decorative double lines under title
  const tlY = titleY + 12;
  doc.setDrawColor(195, 160, 40);
  doc.setLineWidth(0.6);
  doc.line(w / 2 - 80, tlY, w / 2 - 8, tlY);
  doc.line(w / 2 + 8, tlY, w / 2 + 80, tlY);
  doc.setLineWidth(0.2);
  doc.line(w / 2 - 75, tlY + 1.5, w / 2 - 12, tlY + 1.5);
  doc.line(w / 2 + 12, tlY + 1.5, w / 2 + 75, tlY + 1.5);
  // Center ornament
  doc.setFillColor(195, 160, 40);
  doc.circle(w / 2, tlY + 0.75, 1.5, 'F');
  doc.setFillColor(253, 251, 244);
  doc.circle(w / 2, tlY + 0.75, 0.7, 'F');

  // ═══════════════ "SE OTORGA A" ═══════════════
  const otorgaY = titleY + 23;
  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text('Se otorga el presente certificado a:', w / 2, otorgaY, { align: 'center' });

  // ═══════════════ STUDENT NAME ═══════════════
  const nameY = otorgaY + 13;
  doc.setFontSize(28);
  doc.setTextColor(15, 15, 35);
  doc.setFont('times', 'bolditalic');
  doc.text(fullName, w / 2, nameY, { align: 'center' });

  // Elegant double underline
  const nw = doc.getTextWidth(fullName);
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.7);
  doc.line((w - nw) / 2 - 12, nameY + 3, (w + nw) / 2 + 12, nameY + 3);
  doc.setDrawColor(195, 160, 40);
  doc.setLineWidth(0.25);
  doc.line((w - nw) / 2 - 8, nameY + 5.5, (w + nw) / 2 + 8, nameY + 5.5);

  // ═══════════════ DESCRIPTION ═══════════════
  const descY = nameY + 15;
  doc.setFontSize(10);
  doc.setTextColor(75, 75, 75);
  doc.setFont('helvetica', 'normal');
  doc.text('Por haber completado satisfactoriamente la totalidad de los módulos', w / 2, descY, { align: 'center' });
  doc.text('del programa educativo CultivaTec, demostrando conocimientos y competencias', w / 2, descY + 5.5, { align: 'center' });
  doc.text(`destacadas en ${completedCount} áreas de robótica, electrónica y programación.`, w / 2, descY + 11, { align: 'center' });

  // ═══════════════ COMPETENCY BADGES ═══════════════
  const badgeY = descY + 20;
  const skills = ['Robótica', 'Arduino', 'Python', 'C++', 'Electrónica', 'Mecánica', 'Diseño'];
  const bSpacing = 29;
  const bStartX = (w - skills.length * bSpacing) / 2;
  skills.forEach((skill, i) => {
    const bx = bStartX + i * bSpacing + bSpacing / 2;
    // Pill background
    doc.setFillColor(240, 245, 255);
    doc.roundedRect(bx - 13, badgeY - 3.5, 26, 9, 2.5, 2.5, 'F');
    // Pill border
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.2);
    doc.roundedRect(bx - 13, badgeY - 3.5, 26, 9, 2.5, 2.5, 'S');
    // Text
    doc.setFontSize(6);
    doc.setTextColor(37, 99, 235);
    doc.setFont('helvetica', 'bold');
    doc.text(skill, bx, badgeY + 2, { align: 'center' });
  });

  // ═══════════════ SEPARATOR ═══════════════
  const sepY = badgeY + 14;
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.15);
  doc.line(50, sepY, w - 50, sepY);
  // Ornamental dots on separator
  [w * 0.33, w * 0.5, w * 0.67].forEach(dx => {
    doc.setFillColor(195, 160, 40);
    doc.circle(dx, sepY, 0.6, 'F');
  });

  // ═══════════════ SIGNATURE & SEAL SECTION ═══════════════
  const sigBaseY = sepY + 4;
  const colDate = w * 0.2;
  const colSeal = w * 0.5;
  const colSign = w * 0.8;

  // ── LEFT: DATE ──
  doc.setFontSize(9.5);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(getFormattedDate(), colDate, sigBaseY + 18, { align: 'center' });
  doc.setDrawColor(70, 70, 70);
  doc.setLineWidth(0.35);
  doc.line(colDate - 32, sigBaseY + 20, colDate + 32, sigBaseY + 20);
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text('Fecha de expedición', colDate, sigBaseY + 25, { align: 'center' });

  // ── CENTER: GOLD SEAL ──
  drawGoldSeal(doc, colSeal, sigBaseY + 14, 13);

  // ── RIGHT: DIRECTOR SIGNATURE (firma.png) ──
  if (firmaData) {
    // Place the real signature image
    const sigImgW = 55;
    const sigImgH = 22;
    doc.addImage(firmaData, 'PNG', colSign - sigImgW / 2, sigBaseY + 1, sigImgW, sigImgH);
  }

  // Signature line
  doc.setDrawColor(55, 55, 55);
  doc.setLineWidth(0.4);
  doc.line(colSign - 35, sigBaseY + 20, colSign + 35, sigBaseY + 20);

  // Director name
  doc.setFontSize(9.5);
  doc.setTextColor(25, 25, 25);
  doc.setFont('helvetica', 'bold');
  doc.text(DIRECTOR_NAME, colSign, sigBaseY + 25, { align: 'center' });

  // Director title
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text('Director General de CultivaTec', colSign, sigBaseY + 29, { align: 'center' });

  // ═══════════════ BOTTOM BAND ═══════════════
  const botY = h - 20;
  // Decorative lines
  doc.setDrawColor(195, 160, 40);
  doc.setLineWidth(0.5);
  doc.line(40, botY, w / 2 - 18, botY);
  doc.line(w / 2 + 18, botY, w - 40, botY);
  drawGuillocheLine(doc, w / 2 - 17, w / 2 + 17, botY, [195, 160, 40]);
  drawMiniDiamond(40, botY, 1.2);
  drawMiniDiamond(w - 40, botY, 1.2);

  // Certificate ID / folio
  const certId = `CT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  doc.setFontSize(6);
  doc.setTextColor(175, 175, 175);
  doc.setFont('helvetica', 'normal');
  doc.text(`Folio: ${certId}`, w / 2, h - 15, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text('Este documento certifica la finalización exitosa del programa educativo CultivaTec.', w / 2, h - 12, { align: 'center' });

  // ═══════════════ WATERMARK ═══════════════
  doc.setGState(new doc.GState({ opacity: 0.025 }));
  doc.setFontSize(65);
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.text('CultivaTec', w / 2, h / 2 + 5, { align: 'center', angle: 28 });
  doc.setGState(new doc.GState({ opacity: 1 }));

  // ═══════════════ SAVE ═══════════════
  doc.save(`Certificado_CultivaTec_${fullName.replace(/\s+/g, '_')}.pdf`);
};

// Main Licenses Screen
const LicensesScreen = ({ onBack, userScores, userProfile, completedModules }) => {
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [showCertConfirm, setShowCertConfirm] = useState(false);
  
  const fullName = userProfile?.fullName || userProfile?.userName || 'Estudiante';
  
  // Check which modules are completed
  const completedModuleIds = new Set();
  if (completedModules && completedModules instanceof Set) {
    completedModules.forEach(id => completedModuleIds.add(id));
  }
  // Also check from userScores
  if (userScores) {
    Object.entries(userScores).forEach(([key, val]) => {
      if (val && val.total > 0 && val.score >= val.total && !key.startsWith('challenge_')) {
        completedModuleIds.add(key);
      }
    });
  }
  
  const unlockedLicenses = MODULE_LICENSES.filter(l => completedModuleIds.has(l.moduleId));
  const totalModules = MODULE_LICENSES.length;
  const completedCount = unlockedLicenses.length;
  const allComplete = completedCount >= totalModules;
  const progressPercent = Math.round((completedCount / totalModules) * 100);
  
  const handleDownloadCertificate = async () => {
    await generateCertificatePDF(fullName, completedCount, totalModules);
    setShowCertConfirm(false);
  };

  return (
    <div className="pb-24 min-h-full bg-[#F7F7F7] w-full animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-6 pt-8 pb-10 text-center relative overflow-hidden">
        <div className="absolute top-2 right-4 text-7xl opacity-10 rotate-12">📜</div>
        <div className="absolute bottom-2 left-4 text-5xl opacity-10 -rotate-12">🏅</div>
        
        <button onClick={onBack}
          className="absolute top-4 left-4 text-white/80 hover:text-white transition flex items-center bg-white/10 p-2 rounded-xl active:scale-95">
          <ArrowLeft size={18} />
        </button>
        
        <span className="text-5xl mb-2 block animate-float">🏅</span>
        <h1 className="text-3xl font-black text-white">Mis Licencias</h1>
        <p className="text-white/80 text-sm font-bold mt-1">Cada módulo completado te otorga una licencia</p>
        
        <div className="mt-3 flex justify-center gap-3">
          <div className="bg-white/20 px-3 py-1.5 rounded-xl">
            <span className="text-white text-xs font-black">{completedCount}/{totalModules} </span>
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-xl">
            <span className="text-white text-xs font-black">{progressPercent}% Completado</span>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="px-4 -mt-5 max-w-2xl mx-auto relative z-10">
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">📊</span>
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-black text-[#3C3C3C]">Progreso hacia el Certificado</p>
                <span className="text-xs font-black text-[#2563EB]">{completedCount}/{totalModules}</span>
              </div>
              <div className="w-full h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#1CB0F6] rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}>
                  {progressPercent > 10 && (
                    <span className="flex items-center justify-end pr-2 h-full text-[10px] font-black text-white">{progressPercent}%</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {allComplete ? (
            <div className="bg-[#58CC02]/10 rounded-xl p-3 border border-[#58CC02]/20 mt-2">
              <p className="text-sm font-black text-[#58CC02] text-center">🎉 ¡Completaste TODOS los módulos!</p>
              <p className="text-xs text-[#777] text-center font-semibold mt-1">Ya puedes descargar tu certificado oficial</p>
            </div>
          ) : (
            <p className="text-xs text-[#AFAFAF] font-semibold mt-1 text-center">
              Completa todos los módulos para obtener tu certificado oficial de CultivaTec
            </p>
          )}
        </div>
      </div>
      
      {/* Certificate download section */}
      <div className="px-4 max-w-2xl mx-auto mb-4">
        <div className={`rounded-2xl border-2 p-4 transition-all ${
          allComplete 
            ? 'bg-gradient-to-br from-[#FFC800]/10 to-[#FF9600]/10 border-[#FFC800]/40 shadow-lg' 
            : 'bg-gray-50 border-[#E5E5E5]'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
              allComplete ? 'bg-[#FFC800]/20 shadow-inner' : 'bg-gray-100'
            }`}>
              {allComplete ? '📜' : '🔒'}
            </div>
            <div className="flex-grow">
              <p className={`text-sm font-black ${allComplete ? 'text-[#FF9600]' : 'text-[#AFAFAF]'}`}>
                Certificado Oficial CultivaTec
              </p>
              <p className={`text-xs font-semibold ${allComplete ? 'text-[#777]' : 'text-[#CDCDCD]'}`}>
                {allComplete 
                  ? 'Avalado por el Director Abraham Isaías Navarro Doñate' 
                  : `Completa ${totalModules - completedCount} módulos más para desbloquearlo`}
              </p>
              <p className={`text-[10px] font-bold mt-0.5 ${allComplete ? 'text-[#FF9600]' : 'text-[#E5E5E5]'}`}>
                A nombre de: {fullName}
              </p>
            </div>
          </div>
          
          {allComplete && (
            <button onClick={() => setShowCertConfirm(true)}
              className="w-full mt-3 py-3 bg-gradient-to-r from-[#FFC800] to-[#FF9600] text-white font-black rounded-xl border-b-4 border-[#E5A000] active:scale-95 transition text-sm flex items-center justify-center gap-2 shadow-lg">
              <Download size={18} /> Descargar Certificado PDF
            </button>
          )}
        </div>
      </div>
      
      {/* Licenses grid */}
      <div className="px-4 max-w-2xl mx-auto">
        <h2 className="text-sm font-black text-[#3C3C3C] mb-3 flex items-center gap-2">
          <Award size={16} className="text-[#2563EB]" /> Licencias por Módulo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODULE_LICENSES.map(license => (
            <LicenseCard
              key={license.moduleId}
              license={license}
              isUnlocked={completedModuleIds.has(license.moduleId)}
              onView={() => setSelectedLicense(license)}
            />
          ))}
        </div>
      </div>
      
      {/* License detail modal */}
      {selectedLicense && (
        <LicenseModal 
          license={selectedLicense} 
          fullName={fullName}
          onClose={() => setSelectedLicense(null)} 
        />
      )}
      
      {/* Certificate download confirmation modal */}
      {showCertConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowCertConfirm(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 animate-scale-in shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <span className="text-5xl block mb-3">📜</span>
              <h2 className="text-xl font-black text-[#3C3C3C] mb-1">¿Descargar Certificado?</h2>
              <p className="text-sm text-[#777] font-semibold">Se generará un PDF oficial a nombre de:</p>
              <p className="text-base font-black text-[#2563EB] mt-2">{fullName}</p>
            </div>
            
            <div className="bg-[#F7F7F7] rounded-xl p-3 mb-4 border border-[#E5E5E5]">
              <div className="flex items-center gap-2 text-xs text-[#777] font-semibold">
                <span>📝</span>
                <span>Avalado por: <b className="text-[#3C3C3C]">{DIRECTOR_NAME}</b></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#777] font-semibold mt-1">
                <span>📅</span>
                <span>Fecha: <b className="text-[#3C3C3C]">{getFormattedDate()}</b></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#777] font-semibold mt-1">
                <span>📊</span>
                <span>Módulos: <b className="text-[#3C3C3C]">{completedCount}/{totalModules} completados</b></span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => setShowCertConfirm(false)}
                className="flex-1 py-3 bg-[#F7F7F7] text-[#777] font-black rounded-xl border-2 border-[#E5E5E5] active:scale-95 transition text-sm">
                Cancelar
              </button>
              <button onClick={handleDownloadCertificate}
                className="flex-1 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-black rounded-xl border-b-4 border-[#1a3fa0] active:scale-95 transition text-sm flex items-center justify-center gap-1">
                <Download size={16} /> Descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicensesScreen;
