'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PRICING_PLANS, PlanType } from '@/lib/pricing';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportTemplate } from '@/components/ReportTemplate';
import { Loader2 } from 'lucide-react';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan') as PlanType;
  const plan = PRICING_PLANS[planId] || PRICING_PLANS['report'];
  
  const [userData, setUserData] = useState<any>(null);
  const [latestResult, setLatestResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData(user);
        
        const { data: result } = await supabase
          .from('test_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (result) {
          setLatestResult(result);
        }

        // Update profile to mark report as unlocked
        await supabase
          .from('profiles')
          .update({ report_unlocked: true })
          .eq('id', user.id);
      }
    };
    fetchData();
  }, []);

  const handleWhatsAppAction = async () => {
    if (!userData || !latestResult) {
      console.error('Data not ready for PDF generation');
      return;
    }

    // 1. Open WhatsApp in new tab (Do this first to avoid popup blockers)
    const message = planId === 'report' 
      ? `Hi! I just unlocked my detailed PDF report (₹199). My email is ${userData.email}. Please verify my access.`
      : `Hi! I just unlocked my PDF report + 1:1 mentoring (₹299). My email is ${userData.email}. Please verify my access.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919999999999?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    setIsGenerating(true);

    // 2. Generate and Download PDF
    try {
      if (reportRef.current) {
        const element = reportRef.current;
        element.style.position = 'fixed';
        element.style.left = '0';
        element.style.top = '0';
        element.style.visibility = 'visible';
        element.style.zIndex = '9999';

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 794,
        });

        element.style.position = 'fixed';
        element.style.left = '-9999px';
        element.style.visibility = 'hidden';

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const imgWidth = 210; 
        const pageHeight = 297; 
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
        
        const studentName = userData.user_metadata?.full_name || userData.email || 'CA Student';
        const safeName = studentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        pdf.save(`CA_Report_Full_Audit_${safeName}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }

    // 3. Redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  // Detailed analysis for the premium report
  const rawTopicScores = latestResult?.topic_scores || {};
  const totalCorrect = latestResult?.total_score || 0;
  const totalQuestions = latestResult?.total_questions || 15;
  const totalPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const normalizedTopicScores: Record<string, number> = {};
  Object.entries(rawTopicScores).forEach(([topic, scoreData]: [string, any]) => {
    if (typeof scoreData === 'object' && scoreData !== null) {
      normalizedTopicScores[topic] = Math.round((scoreData.correct / scoreData.total) * 100);
    } else {
      normalizedTopicScores[topic] = Math.round((Number(scoreData) / 3) * 100);
    }
  });

  const sortedTopics = Object.entries(normalizedTopicScores).sort((a, b) => b[1] - a[1]);
  
  const strengths = sortedTopics
    .filter(([_, score]) => score >= 70)
    .map(([topic]) => topic);

  const weakAreas = sortedTopics
    .filter(([_, score]) => score < 50)
    .map(([topic, score]) => ({
      topic,
      score,
      priority: score < 30 ? 'Critical' : 'High' as any,
      guide: score < 30 
        ? "Fundamental conceptual gap detected. Immediate review of ICAI Study Material is required." 
        : "Moderate understanding but lacks application skills. Practice past year papers."
    }));

  const studyPlan = [
    { phase: "Phase 1: Concept Cleanup", duration: "3-5 Days", focus: weakAreas.slice(0, 2).map(w => w.topic).join(", ") || "Foundational Topics" },
    { phase: "Phase 2: Intensive Practice", duration: "1 Week", focus: "Standard ICAI problems and MTPs" },
    { phase: "Phase 3: Final Simulation", duration: "2 Days", focus: "Full-length timed mock tests" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
      
      <div className="max-w-md w-full relative">
        <div className="bg-white rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] p-10 pt-16 text-center border border-slate-100 relative overflow-hidden">
          
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Access Granted!</h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-8">Verification Successful</p>
          
          <div className="inline-block px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black mb-10 border border-emerald-100 uppercase tracking-wider">
            {planId === 'report' ? "PDF Report Unlocked" : "PDF + 1:1 Mentoring Unlocked"}
          </div>

          <div className="space-y-8 text-left mb-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 font-black text-slate-900 border border-slate-100 text-sm">
                1
              </div>
              <div className="space-y-0.5">
                <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-wider">CONNECT WITH US</h4>
                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">Click the button below to start a chat on WhatsApp.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 font-black text-slate-900 border border-slate-100 text-sm">
                2
              </div>
              <div className="space-y-0.5">
                <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-wider">GET YOUR REPORT</h4>
                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">Our team will manually verify and send your PDF instantly.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <button
              onClick={handleWhatsAppAction}
              disabled={isGenerating}
              className="w-full bg-[#25D366] text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 relative group disabled:opacity-70"
            >
              {isGenerating ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              )}
              {isGenerating ? "Generating Report..." : "Continue to WhatsApp"}
            </button>
            
            <Link 
              href="/dashboard"
              className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] hover:text-blue-600 transition-colors"
            >
              SKIP TO DASHBOARD
            </Link>
          </div>
        </div>
      </div>

      {/* Hidden template for PDF generation */}
      {userData && latestResult && (
        <div style={{ position: 'fixed', top: '0', left: '-9999px', pointerEvents: 'none', zIndex: -1 }}>
          <ReportTemplate 
            ref={reportRef} 
            studentName={userData.user_metadata?.full_name || userData.email || 'CA Student'}
            date={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            testTitle={latestResult?.test_title || 'CA Mock Test'}
            totalScore={totalPercentage}
            topicScores={normalizedTopicScores}
            strengths={strengths}
            weakAreas={weakAreas}
            studyPlan={studyPlan}
          />
        </div>
      )}
    </div>
  );
};

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

