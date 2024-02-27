import { LatestCigarettesListener } from "@/components/cigarettes/latestCigarettesListener";
import Diaries from "@/components/diaries/diaries";
import { LatestSleepsListener } from "@/components/sleeps/latestSleepsListener";
import { Database } from "@/consts/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import styles from "./home.module.css";
import { LatestStudiesListener } from "@/components/studies/latestStudiesListener";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <div className={styles.homeO}>
        <LatestSleepsListener user={user} />
        <hr />
        <LatestStudiesListener user={user} />
        <hr />
        <LatestCigarettesListener user={user} />
        <hr />
        <Diaries user={user} />
      </div>
    </>
  );
}
