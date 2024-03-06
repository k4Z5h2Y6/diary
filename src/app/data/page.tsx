import { CigaretteCounter } from "@/components/cigarettes/cigaretteCounter";
// import { DiariesList } from "@/components/diaries/diariesList";
import { LatestSleepsRow } from "@/components/sleeps/LatestSleepsRow";
import { LatestSudiesRow } from "@/components/studies/latestStudiesRow";
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
      <p>最新の睡眠</p>
      <LatestSleepsRow user={user}/>
      <a href="">もっと見る</a>
      <hr />
      <p>最新の勉強</p>
      <LatestSudiesRow user={user}/>
      <a href="">もっと見る</a>
      <hr />
      <CigaretteCounter user={user}/>
      <hr />
      最新の投稿
      {/* <DiariesList user={user}/> */}
    </>
  );
}
