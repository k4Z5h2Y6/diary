import { SleepsList } from "@/components/sleeps/sleepsList";
import { Database } from "@/consts/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Calendar() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  return (
    <>
      <SleepsList user={user}/>
    </>
  );
}
