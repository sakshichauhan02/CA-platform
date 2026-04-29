import { Logo } from '@/components/logo'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Brain, BarChart3, User, LogOut, ChevronLeft } from 'lucide-react'

export default function MockTestsPage() {
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
            <Link href="/mock-tests" className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-colors">
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
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Mock Tests</h1>
          <p className="text-muted-foreground">Select a test to begin your practice session.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Accounting Standards Mock {i}</h3>
              <p className="mt-2 text-sm text-muted-foreground">Comprehensive test covering AS 1-15. 50 Questions | 60 Mins.</p>
              <Button className="mt-6 w-full" variant="outline" asChild>
                <Link href="/mock-tests/take">Start Test</Link>
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
