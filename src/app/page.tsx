import { LatestCigarettesListener } from "@/components/cigarettes/latestCigarettesListener";
import { LatestSleepsListener } from "@/components/sleeps/latestSleepsListener";
import { Database } from "@/consts/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Home() {

  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <LatestSleepsListener user={user} />
      <LatestCigarettesListener user={user} />
    </>
  );
}
