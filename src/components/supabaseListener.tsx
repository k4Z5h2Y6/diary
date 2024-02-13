import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Navigation } from "./navigation/navigation"

export default async function SupabaseListener() {
  const supabase = createServerComponentClient({ cookies })

  const {
      data: { session },
  } = await supabase.auth.getSession()

  return <Navigation session={session} />
}