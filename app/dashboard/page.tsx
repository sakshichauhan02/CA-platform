'use client'

import { useEffect, useState } from 'react'
import { Logo } from '@/components/logo'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  User,
  LogOut,
  Loader2,
  Trophy,
  Target,
  Brain,
  History,
  ArrowRight
} from 'lucide-react'
import { format } from 'date-fns'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTests: 0,
    avgScore: 0,
    strongSubject: 'N/A'
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setUser(user)

        // Fetch test results
        const { data: resultsData, error } = await supabase
          .from('test_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        console.log("Dashboard - Results Data:", resultsData)
        if (error) throw error

        if (resultsData && resultsData.length > 0) {
          setResults(resultsData)
          
          // Calculate stats
          const total = resultsData.length
          const avg = Math.round(resultsData.reduce((acc, curr) => acc + (curr.total_score || 0), 0) / total * 10) / 10
          
          // Calculate strongest subject from all topic_scores
          const allTopicScores: Record<string, number> = {}
          resultsData.forEach(r => {
            if (r.topic_scores) {
              Object.entries(r.topic_scores).forEach(([topic, score]) => {
                allTopicScores[topic] = (allTopicScores[topic] || 0) + (score as number)
              })
            }
          })
          
          const strongest = Object.entries(allTopicScores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
          
          setStats({
            totalTests: total,
            avgScore: avg,
            strongSubject: strongest
          })
        }
      } catch (err) {
        console.error("Dashboard - Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const studentName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-background hidden md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="scale-90" />
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-colors font-bold shadow-sm">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-sm">Home</span>
            </Link>
            <Link href="/mock-tests" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Brain className="h-4 w-4" />
              <span className="text-sm font-medium">Mock Tests</span>
            </Link>
            <Link href="/results" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">My Results</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
          </nav>
          <div className="border-t p-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg shadow-blue-500/20">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Upgrade to Pro</p>
              <p className="text-xs text-blue-50 mb-4 opacity-90 leading-relaxed font-medium">Get access to all advanced mock tests and AI analysis.</p>
              <Button size="sm" className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl border-none">Upgrade Now</Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium text-muted-foreground hidden sm:block">Welcome back,</h2>
            <span className="text-sm font-black sm:text-lg tracking-tight">{studentName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive font-bold rounded-xl">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 text-slate-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-muted-foreground text-lg font-medium">Here&apos;s your current status in CA preparation.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tests Taken</CardTitle>
                <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center rotate-3 transition-transform group-hover:rotate-0">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-slate-900 dark:text-white">{stats.totalTests}</div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Completed mock attempts</p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Average Score</CardTitle>
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center -rotate-3 transition-transform group-hover:rotate-0">
                  <Trophy className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-slate-900 dark:text-white">{stats.avgScore}</div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Cumulative performance</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Strong Subject</CardTitle>
                <div className="h-10 w-10 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center rotate-3 transition-transform group-hover:rotate-0">
                  <Target className="h-5 w-5 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 truncate">{stats.strongSubject}</div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Best performing topic</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-slate-50 dark:border-slate-800">
              <div>
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <History className="h-5 w-5 text-slate-400" />
                  </div>
                  Recent Test Activity
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">Detailed breakdown of your latest attempts</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="rounded-xl font-bold">
                <Link href="/results">View All Results</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-none">
                    <TableHead className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject / Test</TableHead>
                    <TableHead className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</TableHead>
                    <TableHead className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Score</TableHead>
                    <TableHead className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.length > 0 ? (
                    results.slice(0, 5).map((activity, i) => (
                      <TableRow key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-slate-50 dark:border-slate-800">
                        <TableCell className="px-8 py-5 font-bold text-slate-700 dark:text-slate-300">
                          {activity.test_name || 'CA Mock Test'}
                        </TableCell>
                        <TableCell className="px-8 py-5 text-sm font-medium text-slate-400">
                          {format(new Date(activity.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="px-8 py-5 text-center">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-black text-sm border border-emerald-100 dark:border-emerald-800">
                            {activity.total_score}
                          </span>
                        </TableCell>
                        <TableCell className="px-8 py-5 text-right">
                          <Button variant="ghost" size="sm" asChild className="rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all font-bold">
                            <Link href="/results" className="flex items-center gap-1">
                              Details
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-medium italic">
                        No recent activity found. Start a mock test to see your results!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
