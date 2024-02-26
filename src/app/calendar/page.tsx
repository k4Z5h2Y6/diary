import { CigaretteCounter } from "@/components/cigarettes/cigaretteCounter";
import { DiariesList } from "@/components/diaries/diariesList";
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
      <p>最近の睡眠</p>
      <SleepsList user={user}/>
      <a href="">もっと見る</a>
      <hr />
      <CigaretteCounter user={user}/>
      <hr />
      <DiariesList user={user}/>
      <hr />
    </>
  );
}
