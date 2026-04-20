import { Logo } from '@/components/logo'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Brain, BarChart3, User, ChevronLeft } from 'lucide-react'

export default function ProfilePage() {
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
            <Link href="/results" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">My Results</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-colors">
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
          <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
        </div>
        
        <div className="max-w-2xl rounded-xl border border-border bg-background p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">CA Aspirant</h2>
              <p className="text-muted-foreground">Level: Foundation</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 py-3 border-b">
              <span className="text-muted-foreground">Email</span>
              <span className="col-span-2 font-medium italic text-muted-foreground">Loading from Supabase...</span>
            </div>
            <div className="grid grid-cols-3 py-3 border-b">
              <span className="text-muted-foreground">Member Since</span>
              <span className="col-span-2 font-medium">April 2026</span>
            </div>
          </div>
          
          <Button className="mt-8" variant="outline">Edit Profile</Button>
        </div>
      </main>
    </div>
  )
}
