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
  History
} from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-sm font-medium">Home</span>
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
            <div className="rounded-xl bg-primary/5 p-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Upgrade to Pro</p>
              <p className="text-xs text-muted-foreground mb-3">Get access to all advanced mock tests and AI analysis.</p>
              <Button size="sm" className="w-full text-xs">Upgrade Now</Button>
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
            <span className="text-sm font-bold sm:text-base">{studentName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Overview</h1>
            <p className="text-muted-foreground text-lg">Here&apos;s a summary of your CA preparation progress.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tests Taken</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">+2 from last week</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Score</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground mt-1">+5% improvement</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Strong Subject</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Accounts</div>
                <p className="text-xs text-muted-foreground mt-1">Based on last 5 tests</p>
              </CardContent>
            </Card>
          </div>
          

          {/* Recent Activity */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest mock test attempts</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: 'Accounts Mock - Level 1', date: 'Apr 20, 2026', score: '85/100', color: 'text-green-600' },
                    { name: 'Law Part A Quiz', date: 'Apr 18, 2026', score: '72/100', color: 'text-blue-600' },
                    { name: 'Taxation Final Draft', date: 'Apr 15, 2026', score: '64/100', color: 'text-orange-600' },
                    { name: 'Audit Standards Test', date: 'Apr 12, 2026', score: '77/100', color: 'text-green-600' },
                  ].map((activity, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{activity.name}</TableCell>
                      <TableCell className="text-muted-foreground">{activity.date}</TableCell>
                      <TableCell className={activity.color}>{activity.score}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
