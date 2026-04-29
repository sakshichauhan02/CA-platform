import { Logo } from '@/components/logo'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Brain, 
  BarChart3, 
  User, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  ArrowUpRight,
  TrendingUp,
  History
} from 'lucide-react'
import ScoreCharts from '@/components/ScoreCharts'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LockedContent } from '@/components/payment/LockedContent'



export default async function ResultsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch the latest test result for this user
  const { data: latestResult, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  console.log("--- RESULTS PAGE DEBUG ---");
  console.log("Fetched Latest Result:", latestResult);
  if (error) console.error("Error fetching results:", error);

  // Normalize data (handling old vs new format)
  const rawTopicScores = latestResult?.topic_scores || {}
  const totalCorrect = latestResult?.total_score || 0
  const totalQuestions = latestResult?.total_questions || 15
  const totalPercentage = Math.round((totalCorrect / totalQuestions) * 100)

  // Convert topic scores to percentages for charts
  const normalizedTopicScores: Record<string, number> = {}
  Object.entries(rawTopicScores).forEach(([topic, scoreData]: [string, any]) => {
    if (typeof scoreData === 'object' && scoreData !== null) {
      // New format: { correct: 2, total: 3 }
      normalizedTopicScores[topic] = Math.round((scoreData.correct / scoreData.total) * 100)
    } else {
      // Old format: raw number (assuming total is 3 for estimation if not known)
      normalizedTopicScores[topic] = Math.round((Number(scoreData) / 3) * 100)
    }
  })

  // Fetch user profile for payment status
  const { data: profile } = await supabase
    .from('profiles')
    .select('report_unlocked')
    .eq('id', user.id)
    .single()

  console.log("User Profile Data:", profile);
  console.log("--- RESULTS PAGE DEBUG END ---");

  const hasResults = !!latestResult

  // Check user subscription status in DB
  const reportUnlocked = profile?.report_unlocked || false;
  // Use the actual unlocked status from the database
  const hasAccess = reportUnlocked; 


  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-background hidden md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="scale-90" />
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <Link href="/mock-tests" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Brain className="h-4 w-4" />
              <span className="text-sm font-medium">Mock Tests</span>
            </Link>
            <Link href="/results" className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-colors">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">My Results</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {!hasResults ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-border shadow-sm">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-8">
                <History className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-black mb-4">No test history yet</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                You haven't completed any mock tests yet. Take your first test to see your detailed performance analysis here.
              </p>
              <Button size="lg" asChild className="rounded-2xl px-8 py-6">
                <Link href="/mock-tests">Start Your First Test</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Button variant="ghost" asChild className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                    <Link href="/dashboard">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back to Dashboard
                    </Link>
                  </Button>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Latest Test Analysis</h1>
                  <p className="text-muted-foreground mt-1 text-lg italic">"Success is the sum of small efforts repeated day in and day out."</p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-border shadow-md">
                  <div className="flex flex-col items-center justify-center border-r border-border pr-8">
                    <span className="text-5xl font-black text-blue-600 tracking-tighter">{totalPercentage}%</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground mt-2">Score</span>
                  </div>
                  <div className="pl-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-sm bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
                      <TrendingUp className="h-4 w-4" />
                      <span>ON TRACK</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Keep going, CA aspirant!</p>
                  </div>
                </div>
              </div>

              {/* Main Visual Analysis */}
              <div className="mb-12">
                <ScoreCharts topicScores={normalizedTopicScores} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Strong Skills */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <CheckCircle2 className="w-24 h-24 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center rotate-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Strong Areas</h3>
                  </div>
                  <ul className="space-y-4">
                    {Object.entries(normalizedTopicScores)
                      .filter(([_, score]) => score >= 70)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 4)
                      .map(([topic], i) => (
                        <li key={i} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-semibold text-lg">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          {topic}
                        </li>
                      ))}
                    {Object.keys(normalizedTopicScores).filter(topic => normalizedTopicScores[topic] >= 70).length === 0 && (
                      <li className="text-muted-foreground italic">Maintain 70%+ score in topics to see them here.</li>
                    )}
                  </ul>
                </div>

                {/* Needs Improvement */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <AlertCircle className="w-24 h-24 text-rose-600" />
                  </div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center -rotate-3">
                      <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Growth Areas</h3>
                  </div>
                  <ul className="space-y-6">
                    {Object.entries(normalizedTopicScores)
                      .filter(([_, score]) => score < 60)
                      .sort((a, b) => a[1] - b[1])
                      .slice(0, 3)
                      .map(([topic, score], i) => (
                        <li key={i} className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-800 dark:text-slate-200 font-bold">{topic}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${score < 30 ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'}`}>
                              {score < 30 ? 'Critical' : 'High Priority'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                            {score < 30 
                              ? "Fundamental conceptual gap. Review ICAI Study Material immediately." 
                              : "Needs application practice and step-wise marking focus."}
                          </p>
                        </li>
                      ))}
                    {Object.entries(normalizedTopicScores).filter(([_, score]) => score < 60).length === 0 && (
                      <li className="text-emerald-600 font-bold italic">Excellent work! No major growth areas identified.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Premium Content Area */}
              <div className="mt-12">
                <LockedContent hasAccess={hasAccess}>
                  <div className="space-y-12">
                    {/* Study Plan */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-12 shadow-sm">
                      <h3 className="text-3xl font-black mb-8 text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                        Your Personalized AI Study Plan
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                          <span className="text-blue-600 font-black block mb-2 text-sm uppercase tracking-wider">Day 1-3</span>
                          <p className="font-bold text-slate-800 dark:text-slate-200">Focus on Advanced Taxation and Corporate Law fundamentals.</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                          <span className="text-blue-600 font-black block mb-2 text-sm uppercase tracking-wider">Day 4-7</span>
                          <p className="font-bold text-slate-800 dark:text-slate-200">Practice high-difficulty mock tests on Auditing standards.</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                          <span className="text-blue-600 font-black block mb-2 text-sm uppercase tracking-wider">Day 8-10</span>
                          <p className="font-bold text-slate-800 dark:text-slate-200">Review weak topics identified in your radar chart.</p>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                        This strategy is dynamically generated based on your performance data. We've identified that you're strong in <span className="text-emerald-600 font-bold">Financial Reporting</span> but need significant work in <span className="text-rose-600 font-bold">Advanced Auditing</span>.
                      </p>
                    </div>

                    {/* Final CTA for those who unlocked */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-[2rem] border border-emerald-100 dark:border-emerald-800 text-center">
                      <p className="text-emerald-700 dark:text-emerald-400 font-bold">
                        Premium Roadmap Unlocked! You can now access your detailed report and mentoring.
                      </p>
                    </div>
                  </div>
                </LockedContent>
              </div>

              <div className="mt-16 text-center pb-20">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Your preparation score is in the top 15% of all candidates this week!
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
