import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // During build time on Vercel, these might be missing.
    // Providing empty strings prevents the @supabase/ssr library from throwing a fatal error.
    return createBrowserClient("", "");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
