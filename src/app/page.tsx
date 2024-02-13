import SleepOnsetButton from "@/components/sleepOnsetButton";
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
      <SleepOnsetButton user={user} />
      <div>
        <button>起床</button>
      </div>
    </>
  );
}
