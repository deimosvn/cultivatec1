import React, { useState } from 'react';
import { ArrowLeft, Download, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';

// Module licenses data — maps module IDs to license info
const MODULE_LICENSES = [
  { moduleId: 'mod_intro_robot', title: 'Introducción a la Robótica', licenseTitle: 'Explorador Robótico', color: '#2563EB', description: 'Conoces qué es un robot y sus componentes básicos' },
  { moduleId: 'mod_partes_robot', title: 'Partes de un Robot', licenseTitle: 'Anatomista Mecánico', color: '#3B82F6', description: 'Identificas las partes esenciales de un robot' },
  { moduleId: 'mod_primer_proyecto', title: 'Primer Proyecto', licenseTitle: 'Constructor Principiante', color: '#059669', description: 'Has completado tu primer proyecto de robótica' },
  { moduleId: 'mod_electr', title: 'Electricidad Básica', licenseTitle: 'Electricista Junior', color: '#F59E0B', description: 'Entiendes los fundamentos de la electricidad' },
  { moduleId: 'mod_electon', title: 'Electrónica', licenseTitle: 'Técnico Electrónico', color: '#EF4444', description: 'Dominas los componentes electrónicos básicos' },
  { moduleId: 'mod_prog_gen', title: 'Programación General', licenseTitle: 'Programador Novato', color: '#3B82F6', description: 'Conoces los fundamentos de la programación' },
  { moduleId: 'mod_mecanica', title: 'Mecánica', licenseTitle: 'Ingeniero Mecánico Jr.', color: '#6366F1', description: 'Entiendes los principios mecánicos de la robótica' },
  { moduleId: 'mod_arduino', title: 'Arduino', licenseTitle: 'Especialista Arduino', color: '#00979D', description: 'Sabes programar y usar placas Arduino' },
  { moduleId: 'mod_cpp', title: 'C++', licenseTitle: 'Programador C++', color: '#659AD2', description: 'Dominas los fundamentos de C++ para robótica' },
  { moduleId: 'mod_python', title: 'Python', licenseTitle: 'Programador Python', color: '#3776AB', description: 'Programas en Python con confianza' },
  { moduleId: 'mod_robotica', title: 'Robótica Avanzada', licenseTitle: 'Robótico Avanzado', color: '#DC2626', description: 'Dominas conceptos avanzados de robótica' },
  { moduleId: 'mod_componentes', title: 'Componentes', licenseTitle: 'Experto en Componentes', color: '#0891B2', description: 'Conoces todos los componentes electrónicos' },
  { moduleId: 'mod_control', title: 'Control', licenseTitle: 'Controlador de Sistemas', color: '#4F46E5', description: 'Entiendes los sistemas de control robótico' },
  { moduleId: 'mod_prog_avanzada', title: 'Programación Avanzada', licenseTitle: 'Programador Experto', color: '#2563EB', description: 'Dominas la programación avanzada para robots' },
  { moduleId: 'mod_diseno', title: 'Diseño', licenseTitle: 'Diseñador Robótico', color: '#EC4899', description: 'Sabes diseñar robots desde cero' },
  { moduleId: 'mod_primer_led', title: 'Primer LED', licenseTitle: 'Iluminador Digital', color: '#F97316', description: 'Has dado vida a tu primer circuito LED' },
];

const DIRECTOR_NAME = 'Abraham Isaías Navarro Doñate';

// Today's date in Spanish
const getFormattedDate = () => {
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const d = new Date();
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
};

// License Card component — official certificate style
const LicenseCard = ({ license, isUnlocked, onView }) => {
  return (
    <div
      onClick={isUnlocked ? onView : null}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        border: isUnlocked ? `2px solid ${license.color}40` : '2px solid #e0e0e0',
        background: isUnlocked
          ? 'linear-gradient(135deg, #fffdf5 0%, #faf8f0 40%, #f5f0e0 100%)'
          : '#f5f5f5',
        padding: '16px',
        cursor: isUnlocked ? 'pointer' : 'default',
        opacity: isUnlocked ? 1 : 0.5,
        transition: 'all 0.2s',
        boxShadow: isUnlocked ? '0 4px 20px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(195,160,40,0.15)' : 'none',
      }}
    >
      {/* Watermark pattern */}
      {isUnlocked && (
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(45deg, ${license.color} 0px, ${license.color} 1px, transparent 1px, transparent 12px)`,
        }} />
      )}

      {/* Gold corner accents */}
      {isUnlocked && <>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 28, borderTop: '3px solid #c8a832', borderLeft: '3px solid #c8a832', borderRadius: '12px 0 0 0', opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 28, height: 28, borderTop: '3px solid #c8a832', borderRight: '3px solid #c8a832', borderRadius: '0 12px 0 0', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 28, height: 28, borderBottom: '3px solid #c8a832', borderLeft: '3px solid #c8a832', borderRadius: '0 0 0 12px', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderBottom: '3px solid #c8a832', borderRight: '3px solid #c8a832', borderRadius: '0 0 12px 0', opacity: 0.6 }} />
      </>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
        {/* Color accent bar */}
        <div style={{
          width: 4, alignSelf: 'stretch', flexShrink: 0,
          borderRadius: 2,
          background: isUnlocked
            ? `linear-gradient(180deg, ${license.color}, ${license.color}80)`
            : '#ddd',
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 12, fontWeight: 900,
            color: isUnlocked ? '#2c2c2c' : '#aaa',
            margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            fontFamily: 'Georgia, "Times New Roman", serif',
            letterSpacing: '0.02em',
          }}>
            {license.licenseTitle}
          </p>
          <p style={{
            fontSize: 10, fontWeight: 600,
            color: isUnlocked ? '#888' : '#ccc',
            margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {license.title}
          </p>
          {isUnlocked && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <div style={{
                fontSize: 8, fontWeight: 800, color: '#c8a832',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '2px 8px', borderRadius: 4,
                border: '1px solid #c8a83240',
                background: 'linear-gradient(135deg, #fdf8e8, #faf2d0)',
              }}>
                CERTIFICADA
              </div>
            </div>
          )}
        </div>

        {isUnlocked && (
          <ChevronRight size={16} color="#c8a832" style={{ flexShrink: 0 }} />
        )}
      </div>
    </div>
  );
};

// License Detail Modal — Official certificate look
const LicenseModal = ({ license, fullName, onClose }) => {
  if (!license) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(6px)', zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, animation: 'fadeIn 0.2s',
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(160deg, #fffef7 0%, #faf6e8 30%, #f5efd8 100%)',
        borderRadius: 20, maxWidth: 370, width: '100%',
        padding: 0, boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        position: 'relative', overflow: 'hidden',
        animation: 'scaleIn 0.25s ease-out',
      }} onClick={e => e.stopPropagation()}>

        {/* Ornate double border */}
        <div style={{
          position: 'absolute', inset: 6,
          border: '2px solid #c8a83240',
          borderRadius: 14, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 10,
          border: '1px solid #c8a83220',
          borderRadius: 10, pointerEvents: 'none',
        }} />

        {/* Corner flourishes */}
        {[{t:6,l:6,br:'0'},{t:6,r:6,br:'0'},{b:6,l:6,br:'0'},{b:6,r:6,br:'0'}].map((pos,i) => (
          <div key={i} style={{
            position:'absolute',
            ...(pos.t !== undefined ? {top:pos.t} : {}),
            ...(pos.b !== undefined ? {bottom:pos.b} : {}),
            ...(pos.l !== undefined ? {left:pos.l} : {}),
            ...(pos.r !== undefined ? {right:pos.r} : {}),
            width:24,height:24,pointerEvents:'none',
            borderTop: pos.t !== undefined ? '3px solid #c8a832' : 'none',
            borderBottom: pos.b !== undefined ? '3px solid #c8a832' : 'none',
            borderLeft: pos.l !== undefined ? '3px solid #c8a832' : 'none',
            borderRight: pos.r !== undefined ? '3px solid #c8a832' : 'none',
            borderTopLeftRadius: (pos.t !== undefined && pos.l !== undefined) ? 14 : 0,
            borderTopRightRadius: (pos.t !== undefined && pos.r !== undefined) ? 14 : 0,
            borderBottomLeftRadius: (pos.b !== undefined && pos.l !== undefined) ? 14 : 0,
            borderBottomRightRadius: (pos.b !== undefined && pos.r !== undefined) ? 14 : 0,
          }} />
        ))}

        {/* Watermark */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%) rotate(-25deg)',
          fontSize: 60, fontWeight: 900, color: license.color,
          opacity: 0.03, pointerEvents: 'none', whiteSpace: 'nowrap',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}>
          CultivaTec
        </div>

        {/* Content */}
        <div style={{ padding: '28px 24px 20px', position: 'relative', zIndex: 1 }}>
          {/* Top ornament line */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, marginBottom: 16,
          }}>
            <div style={{ flex: 1, maxWidth: 60, height: 1, background: 'linear-gradient(90deg, transparent, #c8a832)' }} />
            <span style={{ fontSize: 7, color: '#c8a832', fontWeight: 800, letterSpacing: '0.15em' }}>CULTIVATEC</span>
            <div style={{ flex: 1, maxWidth: 60, height: 1, background: 'linear-gradient(90deg, #c8a832, transparent)' }} />
          </div>

          {/* Badge */}
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{
              display: 'inline-block',
              padding: '4px 14px', borderRadius: 20,
              fontSize: 9, fontWeight: 900, color: '#fff',
              backgroundColor: license.color,
              letterSpacing: '0.1em',
              boxShadow: `0 2px 8px ${license.color}40`,
            }}>
              LICENCIA OFICIAL
            </div>
          </div>

          {/* Title */}
          <h2 style={{
            textAlign: 'center', fontSize: 20, fontWeight: 900,
            color: '#1a1a1a', margin: '8px 0 2px',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}>
            {license.licenseTitle}
          </h2>
          <p style={{
            textAlign: 'center', fontSize: 11, fontWeight: 600,
            color: '#888', margin: 0,
          }}>
            {license.title}
          </p>

          {/* Certificate body */}
          <div style={{
            margin: '16px 0', padding: '16px 14px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(250,248,240,0.9))',
            borderRadius: 12,
            border: '1px solid #c8a83225',
            boxShadow: 'inset 0 0 12px rgba(200,168,50,0.04)',
          }}>
            <p style={{
              textAlign: 'center', fontSize: 9, color: '#aaa',
              fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', margin: '0 0 8px',
            }}>
              Se certifica que
            </p>
            <p style={{
              textAlign: 'center', fontSize: 16, fontWeight: 900,
              color: license.color, margin: '0 0 4px',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
            }}>
              {fullName}
            </p>
            {/* Decorative line under name */}
            <div style={{
              width: '65%', height: 1, margin: '4px auto 10px',
              background: `linear-gradient(90deg, transparent, ${license.color}50, transparent)`,
            }} />
            <p style={{
              textAlign: 'center', fontSize: 11, color: '#666',
              fontWeight: 500, lineHeight: 1.5, margin: 0,
            }}>
              {license.description}
            </p>

            {/* Signature / date area */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              marginTop: 14, paddingTop: 10,
              borderTop: '1px solid #e8e0c8',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 70, height: 1, background: '#999', marginBottom: 4 }} />
                <p style={{ fontSize: 7, color: '#aaa', fontWeight: 700, margin: 0, letterSpacing: '0.05em' }}>FECHA</p>
                <p style={{ fontSize: 8, color: '#666', fontWeight: 700, margin: '1px 0 0' }}>{getFormattedDate()}</p>
              </div>
              {/* Mini seal */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #c8a832, #dfc04a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(200,168,50,0.3)',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 8, fontWeight: 900, color: '#fff', fontFamily: 'Georgia, serif' }}>CT</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 70, height: 1, background: '#999', marginBottom: 4 }} />
                <p style={{ fontSize: 7, color: '#aaa', fontWeight: 700, margin: 0, letterSpacing: '0.05em' }}>DIRECTOR</p>
                <p style={{ fontSize: 7, color: '#666', fontWeight: 700, margin: '1px 0 0' }}>A. Navarro D.</p>
              </div>
            </div>
          </div>

          {/* Folio */}
          <p style={{
            textAlign: 'center', fontSize: 7, color: '#ccc',
            fontWeight: 600, margin: '0 0 14px',
            letterSpacing: '0.08em',
          }}>
            FOLIO: CT-{license.moduleId.toUpperCase().replace(/_/g, '')}-{Date.now().toString(36).toUpperCase().slice(-4)}
          </p>

          <button onClick={onClose} style={{
            width: '100%', padding: '12px 0',
            background: `linear-gradient(135deg, ${license.color}, ${license.color}dd)`,
            color: '#fff', fontWeight: 900, fontSize: 13,
            border: 'none', borderRadius: 12, cursor: 'pointer',
            borderBottom: `4px solid ${license.color}90`,
            letterSpacing: '0.03em',
            boxShadow: `0 4px 12px ${license.color}30`,
          }}>
            Cerrar
          </button>
        </div>
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
  doc.text('Por haber completado satisfactoriamente la totalidad de los 4 mundos', w / 2, descY, { align: 'center' });
  doc.text(`y ${completedCount} módulos del programa educativo CultivaTec, demostrando conocimientos`, w / 2, descY + 5.5, { align: 'center' });
  doc.text('y competencias destacadas en robótica, electrónica, programación e inteligencia artificial.', w / 2, descY + 11, { align: 'center' });

  // ═══════════════ COMPETENCY BADGES ═══════════════
  const badgeY = descY + 20;
  const skills = ['Robótica', 'Electrónica', 'Arduino', 'Python', 'C++', 'IA', 'Biorobótica', 'Espacial'];
  const bSpacing = Math.min(26, (w - 80) / skills.length);
  const bStartX = (w - skills.length * bSpacing) / 2;
  skills.forEach((skill, i) => {
    const bx = bStartX + i * bSpacing + bSpacing / 2;
    // Pill background
    doc.setFillColor(240, 245, 255);
    doc.roundedRect(bx - 12, badgeY - 3.5, 24, 9, 2.5, 2.5, 'F');
    // Pill border
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.2);
    doc.roundedRect(bx - 12, badgeY - 3.5, 24, 9, 2.5, 2.5, 'S');
    // Text
    doc.setFontSize(5.5);
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
  doc.text('Este documento certifica la finalización exitosa de los 4 mundos del programa educativo CultivaTec.', w / 2, h - 12, { align: 'center' });

  // ═══════════════ WATERMARK ═══════════════
  doc.setGState(new doc.GState({ opacity: 0.025 }));
  doc.setFontSize(65);
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.text('CultivaTec', w / 2, h / 2 + 5, { align: 'center', angle: 28 });
  doc.setGState(new doc.GState({ opacity: 1 }));

  // ═══════════════ SAVE ═══════════════
  doc.save(`Certificado_Oficial_CultivaTec_${fullName.replace(/\s+/g, '_')}.pdf`);
};

// ============================================================
// WORLD CERTIFICATES — Data & PDF Generator
// ============================================================
const WORLD_CERTIFICATES = [
  {
    worldId: 'world_1',
    worldName: 'El Taller del Inventor',
    emoji: '🔧',
    color: '#2563EB',
    colorDark: '#1D4ED8',
    colorRgb: [37, 99, 235],
    certificateTitle: 'Inventor Certificado',
    description: 'Ha dominado los fundamentos de la robótica, electrónica y programación, completando satisfactoriamente todos los módulos del Taller del Inventor.',
    skills: ['Fundamentos de Robótica', 'Electricidad Básica', 'Electrónica', 'Programación Básica', 'Mecánica', 'Arduino', 'Diseño Robótico'],
    moduleIds: [
      'mod_intro_robot', 'mod_partes_robot', 'mod_primer_proyecto', 'mod_electr',
      'mod_electon', 'mod_prog_gen', 'mod_mecanica', 'mod_arduino',
      'mod_cpp', 'mod_python', 'mod_robotica', 'mod_componentes',
      'mod_control', 'mod_prog_avanzada', 'mod_diseno', 'mod_primer_led',
    ],
  },
  {
    worldId: 'world_2',
    worldName: 'La Fábrica de Autómatas',
    emoji: '🏭',
    color: '#D97706',
    colorDark: '#B45309',
    colorRgb: [217, 119, 6],
    certificateTitle: 'Maestro de Autómatas',
    description: 'Ha completado la totalidad de los módulos de La Fábrica de Autómatas, demostrando habilidades avanzadas en construcción y automatización robótica.',
    skills: ['Sensores y Actuadores', 'Motores y Servos', 'Comunicación Serial', 'Automatización', 'Robótica Móvil', 'Integración de Sistemas', 'IA Básica'],
    moduleIds: [
      'w2_mod1_ultrasonico', 'w2_mod2_infrarrojo', 'w2_mod3_temp_hum', 'w2_mod4_luz_color',
      'w2_mod5_chasis', 'w2_mod6_motores_avanzado', 'w2_mod7_servo_garra', 'w2_mod8_evasion',
      'w2_mod9_serial', 'w2_mod10_display', 'w2_mod11_bluetooth', 'w2_mod12_sonido',
      'w2_mod13_maquina_estados', 'w2_mod14_energia', 'w2_mod15_integracion', 'w2_mod16_proyecto_final',
    ],
  },
  {
    worldId: 'world_3',
    worldName: 'La Selva Cibernética',
    emoji: '🌿',
    color: '#059669',
    colorDark: '#065F46',
    colorRgb: [5, 150, 105],
    certificateTitle: 'Explorador Cibernético',
    description: 'Ha completado todos los módulos de La Selva Cibernética, dominando la biorobótica y la intersección entre naturaleza y tecnología.',
    skills: ['Biorobótica', 'Biomimética', 'Robótica Blanda', 'Sensores Biológicos', 'Prótesis Robóticas', 'Enjambres IA', 'Robótica Ambiental'],
    moduleIds: [
      'w3_mod1_biomimetica', 'w3_mod2_locomocion', 'w3_mod3_musculos_artificiales', 'w3_mod4_sentidos_bio',
      'w3_mod5_protesis_intro', 'w3_mod6_exoesqueletos', 'w3_mod7_wearables', 'w3_mod8_interfaz_cerebro',
      'w3_mod9_robots_blandos', 'w3_mod10_bioimpresion', 'w3_mod11_ecosistemas', 'w3_mod12_enjambres',
      'w3_mod13_micro_robots', 'w3_mod14_bioetica', 'w3_mod15_diseno_bio', 'w3_mod16_proyecto_bio_final',
    ],
  },
  {
    worldId: 'world_4',
    worldName: 'La Estación Orbital',
    emoji: '🛸',
    color: '#6366F1',
    colorDark: '#4338CA',
    colorRgb: [99, 102, 241],
    certificateTitle: 'Comandante Orbital',
    description: 'Ha completado la totalidad de los módulos de La Estación Orbital, dominando la robótica espacial, rovers, satélites e inteligencia artificial avanzada.',
    skills: ['Robótica Espacial', 'Rovers Planetarios', 'Satélites', 'IA Avanzada', 'Misiones Interplanetarias', 'Impresión 3D', 'Colonización Espacial'],
    moduleIds: [
      'w4_mod1_robots_espacio', 'w4_mod2_gravedad_cero', 'w4_mod3_comunicacion', 'w4_mod4_energia_espacial',
      'w4_mod5_satelites', 'w4_mod6_estacion_espacial', 'w4_mod7_basura_espacial', 'w4_mod8_fabricacion_espacio',
      'w4_mod9_ia_espacial', 'w4_mod10_autonomia', 'w4_mod11_telescopios', 'w4_mod12_colonias',
      'w4_mod13_mision_luna', 'w4_mod14_mision_marte', 'w4_mod15_competencia_espacial', 'w4_mod16_proyecto_orbital_final',
    ],
  },
  {
    worldId: 'world_5',
    worldName: 'El Desierto de los Rovers',
    emoji: '🏜️',
    color: '#D97706',
    colorDark: '#92400E',
    colorRgb: [217, 119, 6],
    certificateTitle: 'Ingeniero de Rovers',
    description: 'Ha completado todos los módulos de El Desierto de los Rovers, dominando la robótica autónoma, navegación, IA, sistemas de energía y proyectos tipo NASA/SpaceX.',
    skills: ['Rovers Autónomos', 'Navegación Autónoma', 'Visión por Computadora', 'Machine Learning', 'Sistemas de Energía', 'Enjambres Robóticos', 'ISRU y Construcción'],
    moduleIds: [
      'w5_mod1_intro_rovers', 'w5_mod2_navegacion_autonoma', 'w5_mod3_percepcion_entorno', 'w5_mod4_toma_decisiones',
      'w5_mod5_chasis_movilidad', 'w5_mod6_sensores_rover', 'w5_mod7_energia_autonomia', 'w5_mod8_comunicacion_rover',
      'w5_mod9_planificacion_rutas', 'w5_mod10_ml_rovers', 'w5_mod11_sistemas_seguridad', 'w5_mod12_simulacion_testing',
      'w5_mod13_swarm_rovers', 'w5_mod14_construccion_isru', 'w5_mod15_competencias_rovers', 'w5_mod16_proyecto_rover_final',
    ],
  },
];

// ============================================================
// WORLD CERTIFICATE PDF GENERATOR (same premium design)
// ============================================================
const generateWorldCertificatePDF = async (fullName, worldCert) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const m = 8;

  const [logoData, firmaData] = await Promise.all([
    loadImageAsBase64('./logo-v2.png'),
    loadImageAsBase64('./firma.png'),
  ]);

  const [cr, cg, cb] = worldCert.colorRgb;

  // ═══════════════ BACKGROUND ═══════════════
  doc.setFillColor(253, 251, 244);
  doc.rect(0, 0, w, h, 'F');

  for (let i = 0; i < 12; i++) {
    doc.setGState(new doc.GState({ opacity: 0.006 + i * 0.002 }));
    doc.setFillColor(cr, cg, cb);
    doc.rect(m + i * 5, m + i * 4, w - m * 2 - i * 10, h - m * 2 - i * 8, 'F');
  }
  doc.setGState(new doc.GState({ opacity: 1 }));

  // ═══════════════ BORDER SYSTEM ═══════════════
  doc.setDrawColor(180, 148, 35);
  doc.setLineWidth(3);
  doc.rect(m, m, w - m * 2, h - m * 2);

  doc.setDrawColor(140, 115, 25);
  doc.setLineWidth(0.3);
  doc.rect(m + 2.5, m + 2.5, w - m * 2 - 5, h - m * 2 - 5);

  doc.setDrawColor(cr, cg, cb);
  doc.setLineWidth(1.2);
  doc.rect(m + 5, m + 5, w - m * 2 - 10, h - m * 2 - 10);

  doc.setDrawColor(cr, cg, cb);
  doc.setLineWidth(0.25);
  doc.rect(m + 7.5, m + 7.5, w - m * 2 - 15, h - m * 2 - 15);

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
  doc.setDrawColor(195, 160, 40);
  doc.setLineWidth(0.5);
  doc.line(40, topBandY, w / 2 - 35, topBandY);
  doc.line(w / 2 + 35, topBandY, w - 40, topBandY);
  drawGuillocheLine(doc, w / 2 - 34, w / 2 + 34, topBandY, [195, 160, 40]);
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

  doc.setFontSize(24);
  doc.setTextColor(cr, cg, cb);
  doc.setFont('helvetica', 'bold');
  doc.text('CultivaTec', w / 2, contentTop + 4, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Programa Educativo de Robótica, Electrónica y Programación', w / 2, contentTop + 9, { align: 'center' });

  // ═══════════════ CERTIFICATE TITLE ═══════════════
  const titleY = contentTop + 20;

  doc.setFontSize(8.5);
  doc.setTextColor(195, 160, 40);
  doc.setFont('helvetica', 'bold');
  doc.text(`— — —    CERTIFICADO DE MUNDO: ${worldCert.worldName.toUpperCase()}    — — —`, w / 2, titleY - 2, { align: 'center' });

  doc.setFontSize(26);
  doc.setTextColor(25, 25, 45);
  doc.setFont('times', 'bold');
  doc.text(worldCert.certificateTitle.toUpperCase(), w / 2, titleY + 8, { align: 'center' });

  // Decorative double lines
  const tlY = titleY + 12;
  doc.setDrawColor(195, 160, 40);
  doc.setLineWidth(0.6);
  doc.line(w / 2 - 80, tlY, w / 2 - 8, tlY);
  doc.line(w / 2 + 8, tlY, w / 2 + 80, tlY);
  doc.setLineWidth(0.2);
  doc.line(w / 2 - 75, tlY + 1.5, w / 2 - 12, tlY + 1.5);
  doc.line(w / 2 + 12, tlY + 1.5, w / 2 + 75, tlY + 1.5);
  doc.setFillColor(cr, cg, cb);
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

  const nw = doc.getTextWidth(fullName);
  doc.setDrawColor(cr, cg, cb);
  doc.setLineWidth(0.7);
  doc.line((w - nw) / 2 - 12, nameY + 3, (w + nw) / 2 + 12, nameY + 3);
  doc.setDrawColor(195, 160, 40);
  doc.setLineWidth(0.25);
  doc.line((w - nw) / 2 - 8, nameY + 5.5, (w + nw) / 2 + 8, nameY + 5.5);

  // ═══════════════ DESCRIPTION ═══════════════
  const descY = nameY + 14;
  doc.setFontSize(10);
  doc.setTextColor(75, 75, 75);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(worldCert.description, 200);
  descLines.forEach((line, i) => {
    doc.text(line, w / 2, descY + i * 5.5, { align: 'center' });
  });

  // ═══════════════ WORLD-SPECIFIC SKILL BADGES ═══════════════
  const badgeY = descY + descLines.length * 5.5 + 8;
  const skills = worldCert.skills;
  const bSpacing = Math.min(29, (w - 80) / skills.length);
  const bStartX = (w - skills.length * bSpacing) / 2;
  skills.forEach((skill, i) => {
    const bx = bStartX + i * bSpacing + bSpacing / 2;
    doc.setFillColor(cr, cg, cb);
    doc.setGState(new doc.GState({ opacity: 0.08 }));
    doc.roundedRect(bx - 13, badgeY - 3.5, 26, 9, 2.5, 2.5, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));
    doc.setDrawColor(cr, cg, cb);
    doc.setLineWidth(0.2);
    doc.roundedRect(bx - 13, badgeY - 3.5, 26, 9, 2.5, 2.5, 'S');
    doc.setFontSize(5.5);
    doc.setTextColor(cr, cg, cb);
    doc.setFont('helvetica', 'bold');
    doc.text(skill, bx, badgeY + 2, { align: 'center' });
  });

  // ═══════════════ SEPARATOR ═══════════════
  const sepY = badgeY + 14;
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.15);
  doc.line(50, sepY, w - 50, sepY);
  [w * 0.33, w * 0.5, w * 0.67].forEach(dx => {
    doc.setFillColor(195, 160, 40);
    doc.circle(dx, sepY, 0.6, 'F');
  });

  // ═══════════════ SIGNATURE & SEAL ═══════════════
  const sigBaseY = sepY + 4;
  const colDate = w * 0.2;
  const colSeal = w * 0.5;
  const colSign = w * 0.8;

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

  drawGoldSeal(doc, colSeal, sigBaseY + 14, 13);

  if (firmaData) {
    doc.addImage(firmaData, 'PNG', colSign - 27.5, sigBaseY + 1, 55, 22);
  }
  doc.setDrawColor(55, 55, 55);
  doc.setLineWidth(0.4);
  doc.line(colSign - 35, sigBaseY + 20, colSign + 35, sigBaseY + 20);
  doc.setFontSize(9.5);
  doc.setTextColor(25, 25, 25);
  doc.setFont('helvetica', 'bold');
  doc.text(DIRECTOR_NAME, colSign, sigBaseY + 25, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text('Director General de CultivaTec', colSign, sigBaseY + 29, { align: 'center' });

  // ═══════════════ BOTTOM BAND ═══════════════
  const botY = h - 20;
  doc.setDrawColor(195, 160, 40);
  doc.setLineWidth(0.5);
  doc.line(40, botY, w / 2 - 18, botY);
  doc.line(w / 2 + 18, botY, w - 40, botY);
  drawGuillocheLine(doc, w / 2 - 17, w / 2 + 17, botY, [195, 160, 40]);
  drawMiniDiamond(40, botY, 1.2);
  drawMiniDiamond(w - 40, botY, 1.2);

  const certId = `CT-${worldCert.worldId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  doc.setFontSize(6);
  doc.setTextColor(175, 175, 175);
  doc.setFont('helvetica', 'normal');
  doc.text(`Folio: ${certId}`, w / 2, h - 15, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text(`Certificado de finalización del mundo "${worldCert.worldName}" — Programa CultivaTec.`, w / 2, h - 12, { align: 'center' });

  // ═══════════════ WATERMARK ═══════════════
  doc.setGState(new doc.GState({ opacity: 0.025 }));
  doc.setFontSize(65);
  doc.setTextColor(cr, cg, cb);
  doc.setFont('helvetica', 'bold');
  doc.text('CultivaTec', w / 2, h / 2 + 5, { align: 'center', angle: 28 });
  doc.setGState(new doc.GState({ opacity: 1 }));

  doc.save(`Certificado_${worldCert.worldName.replace(/\s+/g, '_')}_${fullName.replace(/\s+/g, '_')}.pdf`);
};

// Main Licenses Screen
const LicensesScreen = ({ onBack, userScores, userProfile, completedModules }) => {
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [showCertConfirm, setShowCertConfirm] = useState(false);
  const [showWorldCertConfirm, setShowWorldCertConfirm] = useState(null); // worldCert object or null
  
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

  // Check world completion for world certificates
  const worldCertStatus = WORLD_CERTIFICATES.map(wc => {
    const completedInWorld = wc.moduleIds.filter(id => completedModuleIds.has(id)).length;
    const totalInWorld = wc.moduleIds.length;
    const isWorldComplete = completedInWorld >= totalInWorld;
    return { ...wc, completedInWorld, totalInWorld, isWorldComplete };
  });
  const completedWorlds = worldCertStatus.filter(w => w.isWorldComplete).length;

  // Official certificate: requires ALL worlds completed (all 64 modules)
  const allModuleIds = WORLD_CERTIFICATES.flatMap(wc => wc.moduleIds);
  const totalModulesAll = allModuleIds.length;
  const completedModulesAll = allModuleIds.filter(id => completedModuleIds.has(id)).length;
  const allWorldsComplete = completedWorlds >= WORLD_CERTIFICATES.length;
  const officialProgressPercent = Math.round((completedModulesAll / totalModulesAll) * 100);

  // World 1 license progress (for license cards section)
  const totalW1Licenses = MODULE_LICENSES.length;
  const completedW1Licenses = unlockedLicenses.length;
  
  const handleDownloadCertificate = async () => {
    await generateCertificatePDF(fullName, completedModulesAll, totalModulesAll);
    setShowCertConfirm(false);
  };

  const handleDownloadWorldCertificate = async (worldCert) => {
    await generateWorldCertificatePDF(fullName, worldCert);
    setShowWorldCertConfirm(null);
  };

  return (
    <div style={{ paddingBottom: 96, minHeight: '100%', width: '100%', background: 'linear-gradient(180deg, #faf8f0 0%, #f5f0e0 100%)' }}>
      {/* Header — premium parchment style */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '32px 24px 40px', textAlign: 'center',
      }}>
        {/* Subtle pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(45deg, #c8a832 0px, #c8a832 1px, transparent 1px, transparent 16px)',
        }} />
        {/* Gold border bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, transparent, #c8a832, #dfc04a, #c8a832, transparent)',
        }} />

        <button onClick={onBack} style={{
          position: 'absolute', top: 16, left: 16,
          color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(200,168,50,0.2)', borderRadius: 10, padding: 8,
          cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          <ArrowLeft size={18} />
        </button>

        {/* Gold ornament top */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginBottom: 12,
        }}>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #c8a832)' }} />
          <span style={{ fontSize: 7, color: '#c8a832', fontWeight: 800, letterSpacing: '0.2em' }}>CULTIVATEC</span>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, #c8a832, transparent)' }} />
        </div>

        <h1 style={{
          fontSize: 24, fontWeight: 900, color: '#fff', margin: '0 0 4px',
          fontFamily: 'Georgia, "Times New Roman", serif',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          letterSpacing: '0.04em',
        }}>
          Mis Certificaciones
        </h1>
        <p style={{
          fontSize: 11, color: '#c8a832', fontWeight: 700, margin: 0,
          letterSpacing: '0.08em',
        }}>
          ACREDITACIONES OFICIALES
        </p>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: 10, marginTop: 14,
        }}>
          <div style={{
            background: 'rgba(200,168,50,0.15)', border: '1px solid rgba(200,168,50,0.3)',
            borderRadius: 10, padding: '6px 14px',
          }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#c8a832' }}>
              {completedWorlds}/{WORLD_CERTIFICATES.length} Mundos
            </span>
          </div>
          <div style={{
            background: 'rgba(200,168,50,0.15)', border: '1px solid rgba(200,168,50,0.3)',
            borderRadius: 10, padding: '6px 14px',
          }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#c8a832' }}>
              {completedModulesAll}/{totalModulesAll} Módulos
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div style={{ padding: '0 16px', marginTop: -20, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', position: 'relative', zIndex: 10 }}>
        <div style={{
          background: 'linear-gradient(135deg, #fffef7, #faf6e8)',
          borderRadius: 14, border: '2px solid #c8a83230',
          padding: 16, marginBottom: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(200,168,50,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <p style={{ fontSize: 12, fontWeight: 900, color: '#2c2c2c', margin: 0, fontFamily: 'Georgia, serif' }}>
                  Progreso al Certificado General
                </p>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#c8a832' }}>
                  {completedWorlds}/{WORLD_CERTIFICATES.length} mundos
                </span>
              </div>
              <div style={{
                width: '100%', height: 14, background: '#e8e0c8', borderRadius: 7,
                overflow: 'hidden', border: '1px solid #d8d0b8',
              }}>
                <div style={{
                  height: '100%',
                  width: `${officialProgressPercent}%`,
                  background: 'linear-gradient(90deg, #c8a832, #dfc04a, #c8a832)',
                  borderRadius: 7,
                  transition: 'width 0.7s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  paddingRight: officialProgressPercent > 10 ? 8 : 0,
                }}>
                  {officialProgressPercent > 10 && (
                    <span style={{ fontSize: 8, fontWeight: 900, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                      {officialProgressPercent}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {allWorldsComplete ? (
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf0, #dcfce7)',
              borderRadius: 10, padding: 10, border: '1px solid #22c55e30', marginTop: 8,
            }}>
              <p style={{ fontSize: 12, fontWeight: 900, color: '#16a34a', textAlign: 'center', margin: 0 }}>
                Completaste TODOS los mundos
              </p>
              <p style={{ fontSize: 10, color: '#666', textAlign: 'center', fontWeight: 600, marginTop: 4, marginBottom: 0 }}>
                Ya puedes descargar tu certificado oficial
              </p>
            </div>
          ) : (
            <p style={{ fontSize: 10, color: '#aaa', fontWeight: 600, marginTop: 4, textAlign: 'center', marginBottom: 0 }}>
              Completa los 5 mundos ({totalModulesAll} módulos) para tu certificado oficial
            </p>
          )}
        </div>
      </div>
      
      {/* Certificate download section */}
      <div style={{ padding: '0 16px', maxWidth: 520, margin: '0 auto 16px' }}>
        <div style={{
          borderRadius: 14, border: allWorldsComplete ? '2px solid #c8a83250' : '2px solid #e0e0e0',
          padding: 16, position: 'relative', overflow: 'hidden',
          background: allWorldsComplete
            ? 'linear-gradient(135deg, #fffef7 0%, #fdf6e0 50%, #f8edc8 100%)'
            : '#f5f5f5',
          boxShadow: allWorldsComplete ? '0 8px 30px rgba(200,168,50,0.12)' : 'none',
        }}>
          {/* Gold corner ornaments for unlocked */}
          {allWorldsComplete && <>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '3px solid #c8a832', borderLeft: '3px solid #c8a832', borderRadius: '14px 0 0 0' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderTop: '3px solid #c8a832', borderRight: '3px solid #c8a832', borderRadius: '0 14px 0 0' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 20, height: 20, borderBottom: '3px solid #c8a832', borderLeft: '3px solid #c8a832', borderRadius: '0 0 0 14px' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '3px solid #c8a832', borderRight: '3px solid #c8a832', borderRadius: '0 0 14px 0' }} />
          </>}

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
              background: allWorldsComplete
                ? 'linear-gradient(135deg, #c8a832, #dfc04a)'
                : '#eee',
              boxShadow: allWorldsComplete ? '0 4px 12px rgba(200,168,50,0.25)' : 'none',
            }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: allWorldsComplete ? '#fff' : '#999', fontFamily: 'Georgia, serif' }}>{allWorldsComplete ? 'CT' : '—'}</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 13, fontWeight: 900, margin: '0 0 2px',
                color: allWorldsComplete ? '#8b6914' : '#aaa',
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}>
                Certificado General CultivaTec
              </p>
              <p style={{ fontSize: 10, fontWeight: 600, color: allWorldsComplete ? '#888' : '#ccc', margin: '0 0 2px' }}>
                {allWorldsComplete
                  ? `Avalado por ${DIRECTOR_NAME}`
                  : `Completa ${WORLD_CERTIFICATES.length - completedWorlds} mundo${WORLD_CERTIFICATES.length - completedWorlds !== 1 ? 's' : ''} más`}
              </p>
              <p style={{ fontSize: 8, fontWeight: 700, color: allWorldsComplete ? '#c8a832' : '#ddd', margin: 0 }}>
                A nombre de: {fullName}
              </p>
            </div>
          </div>

          {allWorldsComplete && (
            <button onClick={() => setShowCertConfirm(true)} style={{
              width: '100%', marginTop: 12, padding: '12px 0',
              background: 'linear-gradient(135deg, #c8a832, #a88a20)',
              color: '#fff', fontWeight: 900, fontSize: 12, letterSpacing: '0.04em',
              border: 'none', borderRadius: 10, cursor: 'pointer',
              borderBottom: '4px solid #8b6914',
              boxShadow: '0 4px 16px rgba(200,168,50,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Download size={16} /> Descargar Certificado PDF
            </button>
          )}
        </div>
      </div>

      {/* World Certificates Section */}
      <div style={{ padding: '0 16px', maxWidth: 520, margin: '0 auto 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #c8a83250)' }} />
          <h2 style={{
            fontSize: 12, fontWeight: 900, color: '#5a4a1a', margin: 0,
            fontFamily: 'Georgia, serif', letterSpacing: '0.06em',
          }}>
            Certificados por Mundo
          </h2>
          <span style={{ fontSize: 9, fontWeight: 800, color: '#c8a832' }}>
            {completedWorlds}/{WORLD_CERTIFICATES.length}
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #c8a83250, transparent)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {worldCertStatus.map(wc => (
            <div key={wc.worldId}
              onClick={wc.isWorldComplete ? () => setShowWorldCertConfirm(wc) : undefined}
              style={{
                borderRadius: 14, position: 'relative', overflow: 'hidden',
                border: wc.isWorldComplete ? `2px solid ${wc.color}40` : '2px solid #e0e0e0',
                padding: 16, cursor: wc.isWorldComplete ? 'pointer' : 'default',
                opacity: wc.isWorldComplete ? 1 : 0.5,
                background: wc.isWorldComplete
                  ? 'linear-gradient(135deg, #fffdf5 0%, #faf8f0 40%, #f5f0e0 100%)'
                  : '#f5f5f5',
                boxShadow: wc.isWorldComplete ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {/* Corner accents for unlocked */}
              {wc.isWorldComplete && <>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 18, height: 18, borderTop: `2px solid ${wc.color}60`, borderLeft: `2px solid ${wc.color}60`, borderRadius: '14px 0 0 0' }} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderTop: `2px solid ${wc.color}60`, borderRight: `2px solid ${wc.color}60`, borderRadius: '0 14px 0 0' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 18, height: 18, borderBottom: `2px solid ${wc.color}60`, borderLeft: `2px solid ${wc.color}60`, borderRadius: '0 0 0 14px' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderBottom: `2px solid ${wc.color}60`, borderRight: `2px solid ${wc.color}60`, borderRadius: '0 0 14px 0' }} />
              </>}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                  background: wc.isWorldComplete
                    ? `linear-gradient(135deg, ${wc.color}15, ${wc.color}30)`
                    : '#eee',
                  border: wc.isWorldComplete ? `2px solid ${wc.color}35` : '2px solid #ddd',
                  boxShadow: wc.isWorldComplete ? `0 2px 8px ${wc.color}15` : 'none',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: wc.isWorldComplete ? wc.color : '#bbb', fontFamily: 'Georgia, serif' }}>{wc.isWorldComplete ? 'CT' : '—'}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <p style={{
                      fontSize: 12, fontWeight: 900, margin: 0,
                      color: wc.isWorldComplete ? '#2c2c2c' : '#aaa',
                      fontFamily: 'Georgia, serif',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {wc.certificateTitle}
                    </p>
                    {wc.isWorldComplete && (
                      <span style={{
                        fontSize: 7, fontWeight: 900, color: '#fff',
                        padding: '2px 6px', borderRadius: 4,
                        backgroundColor: wc.color,
                        letterSpacing: '0.05em',
                        flexShrink: 0,
                      }}>
                        OTORGADO
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: 10, fontWeight: 600, margin: 0,
                    color: wc.isWorldComplete ? '#888' : '#ccc',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {wc.worldName}
                  </p>
                  {/* Progress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <div style={{
                      flex: 1, height: 6, background: '#e8e0c8', borderRadius: 3,
                      overflow: 'hidden', border: '1px solid #d8d0b8',
                    }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        width: `${Math.round((wc.completedInWorld / wc.totalInWorld) * 100)}%`,
                        background: wc.isWorldComplete
                          ? `linear-gradient(90deg, ${wc.color}, ${wc.color}cc)`
                          : '#ccc',
                        transition: 'width 0.5s',
                      }} />
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 900, flexShrink: 0,
                      color: wc.isWorldComplete ? wc.color : '#ccc',
                    }}>
                      {wc.completedInWorld}/{wc.totalInWorld}
                    </span>
                  </div>
                  {/* Skill tags */}
                  {wc.isWorldComplete && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                      {wc.skills.slice(0, 4).map((skill, i) => (
                        <span key={i} style={{
                          fontSize: 7, fontWeight: 700, padding: '2px 6px',
                          borderRadius: 4, color: wc.color,
                          background: `${wc.color}10`, border: `1px solid ${wc.color}20`,
                        }}>
                          {skill}
                        </span>
                      ))}
                      {wc.skills.length > 4 && (
                        <span style={{ fontSize: 7, fontWeight: 700, color: '#aaa', padding: '2px 4px' }}>
                          +{wc.skills.length - 4} más
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {wc.isWorldComplete && (
                  <Download size={16} color={wc.color} style={{ flexShrink: 0 }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Licenses grid */}
      <div style={{ padding: '0 16px', maxWidth: 520, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #c8a83250)' }} />
          <h2 style={{
            fontSize: 12, fontWeight: 900, color: '#5a4a1a', margin: 0,
            fontFamily: 'Georgia, serif', letterSpacing: '0.06em',
          }}>
            Licencias por Módulo
          </h2>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #c8a83250, transparent)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
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
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)', zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }} onClick={() => setShowCertConfirm(false)}>
          <div style={{
            background: 'linear-gradient(160deg, #fffef7, #faf6e8)',
            borderRadius: 20, maxWidth: 370, width: '100%', padding: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            position: 'relative', overflow: 'hidden',
          }} onClick={e => e.stopPropagation()}>
            {/* Corner ornaments */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '3px solid #c8a832', borderLeft: '3px solid #c8a832', borderRadius: '20px 0 0 0' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderTop: '3px solid #c8a832', borderRight: '3px solid #c8a832', borderRadius: '0 20px 0 0' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 20, height: 20, borderBottom: '3px solid #c8a832', borderLeft: '3px solid #c8a832', borderRadius: '0 0 0 20px' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '3px solid #c8a832', borderRight: '3px solid #c8a832', borderRadius: '0 0 20px 0' }} />

            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>
                ¿Descargar Certificado?
              </h2>
              <p style={{ fontSize: 11, color: '#888', fontWeight: 600, margin: 0 }}>
                Se generará un PDF oficial a nombre de:
              </p>
              <p style={{ fontSize: 14, fontWeight: 900, color: '#c8a832', marginTop: 8, fontFamily: 'Georgia, serif' }}>
                {fullName}
              </p>
            </div>

            <div style={{
              background: 'rgba(200,168,50,0.06)', borderRadius: 10,
              padding: 12, marginBottom: 16, border: '1px solid #c8a83220',
            }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 600, marginBottom: 4 }}>
                Avalado por: <b style={{ color: '#2c2c2c' }}>{DIRECTOR_NAME}</b>
              </div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 600, marginBottom: 4 }}>
                Fecha: <b style={{ color: '#2c2c2c' }}>{getFormattedDate()}</b>
              </div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>
                Mundos: <b style={{ color: '#2c2c2c' }}>{WORLD_CERTIFICATES.length}/{WORLD_CERTIFICATES.length} completados ({completedModulesAll} módulos)</b>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowCertConfirm(false)} style={{
                flex: 1, padding: '12px 0', background: '#f5f0e0',
                color: '#888', fontWeight: 900, fontSize: 12,
                border: '2px solid #e8e0c8', borderRadius: 10, cursor: 'pointer',
              }}>
                Cancelar
              </button>
              <button onClick={handleDownloadCertificate} style={{
                flex: 1, padding: '12px 0',
                background: 'linear-gradient(135deg, #c8a832, #a88a20)',
                color: '#fff', fontWeight: 900, fontSize: 12,
                border: 'none', borderRadius: 10, cursor: 'pointer',
                borderBottom: '4px solid #8b6914',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Download size={14} /> Descargar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* World Certificate download confirmation modal */}
      {showWorldCertConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)', zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }} onClick={() => setShowWorldCertConfirm(null)}>
          <div style={{
            background: 'linear-gradient(160deg, #fffef7, #faf6e8)',
            borderRadius: 20, maxWidth: 370, width: '100%', padding: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            position: 'relative', overflow: 'hidden',
          }} onClick={e => e.stopPropagation()}>
            {/* Corner ornaments in world color */}
            {[{t:0,l:0,r:'20px 0 0 0'},{t:0,r:0,ra:'0 20px 0 0'},{b:0,l:0,ra:'0 0 0 20px'},{b:0,r:0,ra:'0 0 20px 0'}].map((pos,i) => (
              <div key={i} style={{
                position:'absolute', width:20, height:20,
                ...(pos.t !== undefined ? {top:0} : {bottom:0}),
                ...(pos.l !== undefined ? {left:0} : {right:0}),
                borderTop: pos.t !== undefined ? `3px solid ${showWorldCertConfirm.color}` : 'none',
                borderBottom: pos.b !== undefined ? `3px solid ${showWorldCertConfirm.color}` : 'none',
                borderLeft: pos.l !== undefined ? `3px solid ${showWorldCertConfirm.color}` : 'none',
                borderRight: pos.r !== undefined ? `3px solid ${showWorldCertConfirm.color}` : 'none',
                borderTopLeftRadius: (pos.t !== undefined && pos.l !== undefined) ? 20 : 0,
                borderTopRightRadius: (pos.t !== undefined && pos.r !== undefined) ? 20 : 0,
                borderBottomLeftRadius: (pos.b !== undefined && pos.l !== undefined) ? 20 : 0,
                borderBottomRightRadius: (pos.b !== undefined && pos.r !== undefined) ? 20 : 0,
              }} />
            ))}

            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{
                display: 'inline-block', padding: '3px 12px', borderRadius: 16,
                fontSize: 8, fontWeight: 900, color: '#fff',
                backgroundColor: showWorldCertConfirm.color,
                letterSpacing: '0.1em', marginBottom: 6,
              }}>
                CERTIFICADO DE MUNDO
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a', margin: '6px 0 2px', fontFamily: 'Georgia, serif' }}>
                {showWorldCertConfirm.certificateTitle}
              </h2>
              <p style={{ fontSize: 11, color: '#888', fontWeight: 600, margin: 0 }}>
                {showWorldCertConfirm.worldName}
              </p>
              <p style={{ fontSize: 14, fontWeight: 900, marginTop: 8, fontFamily: 'Georgia, serif', color: showWorldCertConfirm.color }}>
                {fullName}
              </p>
            </div>

            <div style={{
              background: `${showWorldCertConfirm.color}06`, borderRadius: 10,
              padding: 10, marginBottom: 10, border: `1px solid ${showWorldCertConfirm.color}15`,
            }}>
              <p style={{ fontSize: 8, fontWeight: 800, color: '#aaa', margin: '0 0 6px', letterSpacing: '0.1em' }}>
                COMPETENCIAS ACREDITADAS
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {showWorldCertConfirm.skills.map((skill, i) => (
                  <span key={i} style={{
                    fontSize: 8, fontWeight: 700, padding: '3px 8px',
                    borderRadius: 6, color: showWorldCertConfirm.color,
                    background: `${showWorldCertConfirm.color}10`,
                    border: `1px solid ${showWorldCertConfirm.color}20`,
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(200,168,50,0.06)', borderRadius: 10,
              padding: 10, marginBottom: 16, border: '1px solid #c8a83215',
            }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 600, marginBottom: 4 }}>
                Avalado por: <b style={{ color: '#2c2c2c' }}>{DIRECTOR_NAME}</b>
              </div>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>
                Fecha: <b style={{ color: '#2c2c2c' }}>{getFormattedDate()}</b>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowWorldCertConfirm(null)} style={{
                flex: 1, padding: '12px 0', background: '#f5f0e0',
                color: '#888', fontWeight: 900, fontSize: 12,
                border: '2px solid #e8e0c8', borderRadius: 10, cursor: 'pointer',
              }}>
                Cancelar
              </button>
              <button onClick={() => handleDownloadWorldCertificate(showWorldCertConfirm)} style={{
                flex: 1, padding: '12px 0',
                background: `linear-gradient(135deg, ${showWorldCertConfirm.color}, ${showWorldCertConfirm.colorDark})`,
                color: '#fff', fontWeight: 900, fontSize: 12,
                border: 'none', borderRadius: 10, cursor: 'pointer',
                borderBottom: `4px solid ${showWorldCertConfirm.colorDark}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Download size={14} /> Descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicensesScreen;