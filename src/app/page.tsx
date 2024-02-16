import { LatestSleepsListener } from "@/components/latestSleepsListener";
import { Database } from "@/consts/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Home() {

  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  //喫煙本数/日ベースのDBを作成
  //Listenerは必要なし
  //cigarette counter
  //

  return (
    <>
      <LatestSleepsListener user={user} />
    </>
  );
}
