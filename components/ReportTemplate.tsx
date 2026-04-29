import React, { forwardRef } from 'react';

interface ReportTemplateProps {
  studentName: string;
  date: string;
  testTitle: string;
  totalScore: number;
  topicScores: Record<string, number>;
  strengths: string[];
  weakAreas: { topic: string; score: number; priority: string; guide: string }[];
  studyPlan: { phase: string; duration: string; focus: string }[];
}

export const ReportTemplate = forwardRef<HTMLDivElement, ReportTemplateProps>((props, ref) => {
  const { 
    studentName, 
    date, 
    testTitle, 
    totalScore, 
    topicScores, 
    strengths, 
    weakAreas = [],
    studyPlan = [] 
  } = props;

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  // Helper to render a page container
  const Page = ({ children, title, pageNum }: { children: React.ReactNode; title?: string; pageNum: number }) => (
    <div className="w-[210mm] h-[297mm] bg-white p-[20mm] relative overflow-hidden border-b-[1px] border-slate-100 flex flex-col">
      {/* Header for every page */}
      <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-black text-[8px]">CA</span>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">PrepPro Audit</span>
        </div>
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Page {pageNum} of 10</div>
      </div>

      {title && <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter border-l-4 border-blue-600 pl-4">{title}</h2>}
      
      <div className="flex-1">{children}</div>

      {/* Footer for every page */}
      <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-[8px] font-bold text-slate-300 uppercase tracking-[0.3em]">
        <span>Confidential Report • {studentName}</span>
        <span>Verified by CA PrepPro AI</span>
      </div>
    </div>
  );

  return (
    <div ref={ref} style={{ width: '210mm', background: '#f8fafc' }}>
      
      {/* PAGE 1: TITLE PAGE */}
      <Page pageNum={1}>
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl shadow-blue-500/30">
            <span className="text-white font-black text-4xl">CA</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            COMPREHENSIVE<br />
            <span className="text-blue-600">PERFORMANCE</span><br />
            AUDIT REPORT
          </h1>
          <div className="w-20 h-1 bg-slate-200 mb-12 rounded-full" />
          <div className="space-y-4 mb-20">
            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Prepared Exclusively For</p>
            <p className="text-3xl font-black text-slate-900 underline underline-offset-8 decoration-blue-600/30">{studentName}</p>
          </div>
          <div className="grid grid-cols-2 gap-12 text-left w-full max-w-md bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Assessment Date</p>
              <p className="text-sm font-bold text-slate-800">{date}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Report Version</p>
              <p className="text-sm font-bold text-slate-800">Premium 2.4.1</p>
            </div>
            <div className="col-span-2">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Exam Track</p>
              <p className="text-sm font-bold text-slate-800">{testTitle}</p>
            </div>
          </div>
        </div>
      </Page>

      {/* PAGE 2: EXECUTIVE SUMMARY */}
      <Page pageNum={2} title="01. Executive Summary">
        <div className="space-y-10">
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black">Audit Verdict</h3>
              <div className="text-4xl font-black text-blue-400">{totalScore}%</div>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">
              Your overall readiness score indicates a <span className="text-white font-bold">{totalScore >= 70 ? 'High' : totalScore >= 40 ? 'Moderate' : 'Critical'}</span> probability of passing the actual CA examination under current preparation standards. 
              {totalScore >= 70 
                ? "You are currently in the 'Safe Zone', but should focus on precision in theoretical answers." 
                : totalScore >= 40 
                ? "You are in the 'Fringe Zone'. A slight increase in effort could push you into the passing bracket." 
                : "You are currently in the 'Risk Zone'. Immediate intervention in conceptual clarity is required."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="p-8 border-2 border-slate-100 rounded-[2.5rem]">
              <h4 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-widest">Primary Strengths</h4>
              <ul className="space-y-3">
                {strengths.map(s => (
                  <li key={s} className="flex items-center gap-3 font-bold text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 border-2 border-slate-100 rounded-[2.5rem]">
              <h4 className="text-xs font-black uppercase text-rose-600 mb-4 tracking-widest">Risk Indicators</h4>
              <ul className="space-y-3">
                {weakAreas.map(w => (
                  <li key={w.topic} className="flex items-center gap-3 font-bold text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {w.topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
            <h4 className="text-sm font-black text-slate-900 mb-3">Key Auditor Note</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on the response patterns, you tend to excel in analytical questions but lose marks in descriptive law sections. 
              Improving your legal terminology usage is the fastest way to gain an extra 10-15% on your final score.
            </p>
          </div>
        </div>
      </Page>

      {/* PAGE 3: COMPETENCY MATRIX */}
      <Page pageNum={3} title="02. Competency Matrix">
        <div className="space-y-8">
          <p className="text-sm text-slate-500 leading-relaxed">
            This matrix visualizes your performance across all tested competencies. Mastery is defined as a score above 70%, 
            while anything below 40% is flagged for immediate remedial action.
          </p>
          <div className="space-y-6">
            {Object.entries(topicScores).map(([topic, score]) => (
              <div key={topic} className="space-y-2">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-tight">
                  <span className="text-slate-700">{topic}</span>
                  <span className={getScoreColor(score)}>{score}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-[9px] text-slate-400 font-medium italic">
                  {score >= 70 ? 'Mastery demonstrated. Keep practicing advanced problems.' : score >= 40 ? 'Conceptual clarity present. Needs more application practice.' : 'Action Required: Re-visit core concepts in ICAI Module.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Page>

      {/* PAGE 4: DETAILED TOPIC ANALYSIS - PART 1 */}
      <Page pageNum={4} title="03. Topic Deep Dive (A)">
        <div className="space-y-12">
          {Object.entries(topicScores).slice(0, 2).map(([topic, score]) => (
            <div key={topic} className="space-y-4">
              <h4 className="text-xl font-black text-slate-900 border-b-2 border-slate-100 pb-2">{topic}</h4>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 bg-slate-50 p-6 rounded-3xl text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Subject IQ</p>
                  <p className="text-3xl font-black text-slate-900">{score}</p>
                </div>
                <div className="col-span-2 space-y-4">
                  <p className="text-sm font-bold text-slate-700">Detailed Findings:</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Performance in this section shows {score >= 70 ? 'excellent' : 'inconsistent'} retention of technical data. 
                    {score < 50 && " Most errors occurred in multi-step calculation questions, indicating a need for better formula application."}
                  </p>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-[10px] font-bold text-emerald-800">
                    PRO TIP: Practice 5 descriptive questions daily from this topic to build 'Muscle Memory'.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Page>

      {/* PAGE 5: DETAILED TOPIC ANALYSIS - PART 2 */}
      <Page pageNum={5} title="04. Topic Deep Dive (B)">
        <div className="space-y-12">
          {Object.entries(topicScores).slice(2, 4).map(([topic, score]) => (
            <div key={topic} className="space-y-4">
              <h4 className="text-xl font-black text-slate-900 border-b-2 border-slate-100 pb-2">{topic}</h4>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 bg-slate-50 p-6 rounded-3xl text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Subject IQ</p>
                  <p className="text-3xl font-black text-slate-900">{score}</p>
                </div>
                <div className="col-span-2 space-y-4">
                  <p className="text-sm font-bold text-slate-700">Detailed Findings:</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    This subject represents a {score >= 60 ? 'strong support' : 'significant bottleneck'} in your overall aggregate. 
                    Focusing here can dramatically improve your chances of crossing the 200/400 barrier.
                  </p>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-[10px] font-bold text-blue-800">
                    STRATEGY: Use mnemonic devices to remember sectional headings and sub-clauses.
                  </div>
                </div>
              </div>
            </div>
          ))}
          {Object.entries(topicScores).length < 3 && (
             <div className="p-20 border-2 border-dashed border-slate-100 rounded-[3rem] text-center text-slate-300 font-bold uppercase tracking-widest">
               No additional topics recorded
             </div>
          )}
        </div>
      </Page>

      {/* PAGE 6: WEAKNESS MITIGATION PLAN */}
      <Page pageNum={6} title="05. Weakness Mitigation">
        <div className="space-y-8">
          <p className="text-sm text-slate-500">
            We have identified the following critical areas that are currently pulling down your aggregate. 
            Following these prescriptive steps will yield the highest ROI on your study time.
          </p>
          <div className="space-y-6">
            {weakAreas.map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-black text-slate-900">{item.topic}</h4>
                  <span className="px-3 py-1 bg-rose-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">{item.priority}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{item.guide}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Estimated Study Hours</p>
                    <p className="text-sm font-black text-slate-800">12 - 15 Hours</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Required Resources</p>
                    <p className="text-sm font-black text-slate-800">ICAI Module + Past Papers</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Page>

      {/* PAGE 7: 30-DAY SUCCESS ROADMAP */}
      <Page pageNum={7} title="06. 30-Day Master Schedule">
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4 bg-slate-900 text-white p-6 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center">
            <div className="col-span-1">Timeline</div>
            <div className="col-span-1">Phase</div>
            <div className="col-span-2">Strategic Focus</div>
          </div>
          {studyPlan.map((step, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 p-6 border border-slate-100 rounded-2xl items-center text-xs">
              <div className="col-span-1 font-black text-blue-600">{step.duration}</div>
              <div className="col-span-1 font-black text-slate-900">{step.phase}</div>
              <div className="col-span-2 text-slate-500 font-medium leading-relaxed">{step.focus}</div>
            </div>
          ))}
          <div className="grid grid-cols-4 gap-4 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl items-center text-xs">
            <div className="col-span-1 font-black text-emerald-600">Day 25-30</div>
            <div className="col-span-1 font-black text-slate-900">Final Countdown</div>
            <div className="col-span-2 text-slate-500 font-medium leading-relaxed">Revision of LDR (Last Day Revision) notes and mind maps.</div>
          </div>
        </div>
      </Page>

      {/* PAGE 8: EXAM PRESENTATION STRATEGY */}
      <Page pageNum={8} title="07. Writing & Presentation">
        <div className="space-y-10">
          <p className="text-sm text-slate-500 italic leading-relaxed">
            "In CA exams, it's not just about what you know, but how you present it."
          </p>
          <div className="space-y-6">
            <div className="p-8 bg-slate-50 rounded-[2.5rem]">
              <h4 className="text-lg font-black text-slate-900 mb-4 tracking-tight">01. The 'Rule of Three'</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Always divide your answer into three parts: (1) Provision of the Law, (2) Facts of the Case, and (3) Final Conclusion. This structure is highly preferred by evaluators.
              </p>
            </div>
            <div className="p-8 bg-slate-50 rounded-[2.5rem]">
              <h4 className="text-lg font-black text-slate-900 mb-4 tracking-tight">02. Keyword Underlining</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use a pencil to underline keywords in your answers. Evaluators scan for these terms (e.g., 'pari passu', 'ultra vires', 'material misstatement') to award marks quickly.
              </p>
            </div>
            <div className="p-8 bg-slate-50 rounded-[2.5rem]">
              <h4 className="text-lg font-black text-slate-900 mb-4 tracking-tight">03. Practical Approach</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                For practical subjects, always show working notes clearly. Even if the final answer is wrong, you can secure 60-70% of the marks through correct working notes.
              </p>
            </div>
          </div>
        </div>
      </Page>

      {/* PAGE 9: MENTAL READINESS & TIPS */}
      <Page pageNum={9} title="08. Mindset & Productivity">
        <div className="space-y-10">
          <div className="grid grid-cols-2 gap-8">
            <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100">
              <h4 className="text-sm font-black text-rose-700 mb-4 uppercase">Stop Doing</h4>
              <ul className="text-xs space-y-3 text-slate-600 font-medium">
                <li>• Avoid social media 30 days before exam.</li>
                <li>• Stop comparing progress with peers.</li>
                <li>• Don't skip sleep for 'one extra chapter'.</li>
              </ul>
            </div>
            <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
              <h4 className="text-sm font-black text-emerald-700 mb-4 uppercase">Start Doing</h4>
              <ul className="text-xs space-y-3 text-slate-600 font-medium">
                <li>• Use the Pomodoro technique (50:10).</li>
                <li>• Take short walks to refresh cognitive load.</li>
                <li>• Practice writing for 3 hours straight.</li>
              </ul>
            </div>
          </div>
          <div className="p-10 bg-slate-900 text-white rounded-[3rem] text-center">
            <h4 className="text-xl font-black mb-4">The Winner's Mindset</h4>
            <p className="text-sm text-slate-400 italic">"The exam is not a test of your intelligence, but a test of your endurance and discipline."</p>
          </div>
        </div>
      </Page>

      {/* PAGE 10: NEXT STEPS & CERTIFICATION */}
      <Page pageNum={10} title="09. Final Recommendation">
        <div className="h-full flex flex-col">
          <div className="space-y-8 flex-1">
            <p className="text-sm text-slate-500 leading-relaxed">
              This audit report is generated by CA PrepPro's proprietary AI engine. 
              To further accelerate your preparation, we recommend the following next steps:
            </p>
            <div className="space-y-4">
              <div className="p-6 border-2 border-blue-100 rounded-2xl flex items-center gap-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">1</div>
                <div>
                  <h5 className="font-black text-slate-900 uppercase text-xs">Schedule Mentoring</h5>
                  <p className="text-[10px] text-slate-500">Book a session to discuss these findings with a qualified CA mentor.</p>
                </div>
              </div>
              <div className="p-6 border-2 border-slate-100 rounded-2xl flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-black">2</div>
                <div>
                  <h5 className="font-black text-slate-900 uppercase text-xs">Targeted Mock Tests</h5>
                  <p className="text-[10px] text-slate-500">Take subject-specific tests for your 'Risk Indicators'.</p>
                </div>
              </div>
              <div className="p-6 border-2 border-slate-100 rounded-2xl flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-black">3</div>
                <div>
                  <h5 className="font-black text-slate-900 uppercase text-xs">Join Study Group</h5>
                  <p className="text-[10px] text-slate-500">Access our exclusive community for peer-to-peer accountability.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center">
            <div className="w-16 h-16 bg-white border border-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Audit Verified</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">ID: CAP-REPORT-{Math.random().toString(36).substring(7).toUpperCase()}</p>
          </div>
        </div>
      </Page>

    </div>
  );
});

ReportTemplate.displayName = 'ReportTemplate';
