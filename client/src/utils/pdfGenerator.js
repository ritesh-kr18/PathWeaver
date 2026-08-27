import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generatePDFReport({ userProfile, startingStage, decisions, scores, exploredStages, achievements, totalScore }) {
  const doc = new jsPDF();
  const purple = [139, 92, 246];

  // ── Page 1: Title ──
  doc.setFillColor(...purple);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text('PATHWEAVER', 105, 22, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Weave Your Future, One Choice at a Time', 105, 32, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.text('Life Journey Report', 105, 60, { align: 'center' });
  doc.setFontSize(14);
  doc.text(userProfile?.name || 'Player', 105, 75, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Generated: ' + new Date().toLocaleDateString(), 105, 85, { align: 'center' });
  doc.text('Overall Score: ' + totalScore + '%', 105, 95, { align: 'center' });

  // ── Page 2: Scores ──
  doc.addPage();
  doc.setFontSize(18);
  doc.text('Final Scores', 14, 20);
  doc.setFontSize(12);

  const scoreEntries = Object.entries(scores);
  scoreEntries.forEach(([key, value], i) => {
    const y = 35 + i * 15;
    doc.setTextColor(100, 100, 100);
    doc.text(key.charAt(0).toUpperCase() + key.slice(1), 14, y);
    doc.setTextColor(0, 0, 0);
    doc.text(value + '%', 80, y);

    // Draw bar
    doc.setFillColor(220, 220, 220);
    doc.rect(95, y - 4, 100, 6, 'F');
    doc.setFillColor(...purple);
    doc.rect(95, y - 4, value, 6, 'F');
  });

  // ── Page 3: Decisions ──
  doc.addPage();
  doc.setFontSize(18);
  doc.text('Key Decisions', 14, 20);

  const tableData = decisions.map((d, i) => [
    i + 1,
    d.stage || '',
    d.choiceText || '',
    Object.entries(d.effects || {}).filter(([,v]) => v !== 0).map(([k,v]) => k + ': ' + (v > 0 ? '+' : '') + v).join(', ')
  ]);

  doc.autoTable({
    startY: 30,
    head: [['#', 'Stage', 'Decision', 'Effects']],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: purple },
  });

  // ── Page 4: Achievements ──
  if (achievements && achievements.length > 0) {
    doc.addPage();
    doc.setFontSize(18);
    doc.text('Achievements', 14, 20);
    doc.setFontSize(12);
    achievements.forEach((a, i) => {
      doc.text(a.title + ' — ' + a.desc, 14, 35 + i * 10);
    });
  }

  // Save
  doc.save('PathWeaver_Report_' + (userProfile?.name || 'Player') + '.pdf');
}