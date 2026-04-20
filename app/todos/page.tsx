import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default async function TodosPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-muted/30">
      <div className="w-full max-w-md">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Landing Page
          </Link>
        </Button>
        <h1 className="text-4xl font-bold mb-8 tracking-tight">Supabase Todos</h1>
        <ul className="space-y-3">
          {todos?.map((todo) => (
            <li key={todo.id} className="p-4 bg-background border border-border/50 rounded-xl shadow-sm transition-all hover:shadow-md">
              <span className="font-medium">{todo.name}</span>
            </li>
          ))}
          {(!todos || todos.length === 0) && (
            <div className="p-8 text-center bg-background border border-dashed border-border rounded-xl">
              <p className="text-muted-foreground italic">No todos found.</p>
              <p className="text-xs text-muted-foreground/60 mt-2">Try adding some rows to the &quot;todos&quot; table in your Supabase dashboard.</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}
