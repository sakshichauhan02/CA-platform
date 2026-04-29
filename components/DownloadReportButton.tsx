'use client';

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from './ui/button';
import { Download, Loader2 } from 'lucide-react';
import { ReportTemplate } from './ReportTemplate';

interface DownloadReportButtonProps {
  studentName: string;
  date: string;
  testTitle: string;
  totalScore: number;
  topicScores: Record<string, number>;
}

export const DownloadReportButton = (props: DownloadReportButtonProps) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Detailed analysis logic
  const topicEntries = Object.entries(props.topicScores);
  const sortedTopics = [...topicEntries].sort((a, b) => (b[1] as number) - (a[1] as number));
  
  const strengths = sortedTopics
    .filter(([_, score]) => (score as number) >= 70)
    .map(([topic]) => topic);

  const weakAreas = sortedTopics
    .filter(([_, score]) => (score as number) < 50)
    .map(([topic, score]) => ({
      topic,
      score: score as number,
      priority: (score as number) < 30 ? 'Critical' : 'High',
      guide: (score as number) < 30 
        ? "Fundamental conceptual gap detected. Immediate review of ICAI Study Material is required. Focus on basic definitions and core principles before attempting more practice." 
        : "Moderate understanding but lacks application skills. Practice past year papers and focus on step-wise marking schemes."
    }));

  const studyPlan = [
    { phase: "Phase 1: Concept Cleanup", duration: "3-5 Days", focus: weakAreas.slice(0, 2).map(w => w.topic).join(", ") || "Foundational Topics" },
    { phase: "Phase 2: Intensive Practice", duration: "1 Week", focus: "Standard ICAI problems and past 3 attempts RPTs/MTPs" },
    { phase: "Phase 3: Final Simulation", duration: "2 Days", focus: "Full-length timed mock tests to improve speed and accuracy" }
  ];

  const generatePDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      const element = reportRef.current;
      // Temporarily move to a visible but off-screen area to ensure proper rendering
      element.style.left = '0';
      element.style.position = 'relative';
      element.style.zIndex = '100';

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality for print
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, // Standard A4 width in px at 96 DPI
      });

      // Reset styles
      element.style.left = '-9999px';
      element.style.position = 'absolute';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Subsequent pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const safeName = props.studentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const dateStr = new Date().toISOString().split('T')[0];
      pdf.save(`CA_Report_Full_Audit_${safeName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button 
        onClick={generatePDF}
        disabled={isGenerating}
        className="rounded-2xl px-10 py-8 bg-blue-600 hover:bg-blue-700 text-white font-black shadow-2xl shadow-blue-500/20 flex items-center gap-4 text-xl group transition-all hover:scale-105 active:scale-95"
      >
        {isGenerating ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
        )}
        {isGenerating ? 'Generating Report...' : 'Download Detailed PDF Report'}
      </Button>
      
      {/* Hidden template for PDF generation */}
      <div style={{ position: 'fixed', top: '0', left: '-9999px', pointerEvents: 'none', zIndex: -1 }}>
        <ReportTemplate 
          ref={reportRef} 
          {...props} 
          strengths={strengths}
          weakAreas={weakAreas}
          studyPlan={studyPlan}
        />
      </div>
    </>
  );
};
