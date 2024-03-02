import { LatestCigarettesListener } from "@/components/cigarettes/latestCigarettesListener";
import { LatestSleepsListener } from "@/components/sleeps/latestSleepsListener";
import { Database } from "@/consts/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import styles from "./home.module.css";
import { LatestStudiesListener } from "@/components/studies/latestStudiesListener";
// import DiariesForm from "@/components/diaries/diariesForm";

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
        {/* <DiariesForm user={user} /> */}
      </div>
    </>
  );
}
