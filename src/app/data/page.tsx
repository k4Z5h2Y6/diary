import { LatestCigarettesList } from "@/components/cigarettes/latestCigarettesList";
import { LatestDiariesList } from "@/components/diaries/latestDiariesList";
import { LatestFoodsList } from "@/components/foods/latestFoodsList";
import { LatestSleepsList } from "@/components/sleeps/latestSleepsList";
import { LatestSudiesList } from "@/components/studies/latestStudiesList";
import { Database } from "@/consts/database.types";
import { Container, Divider } from "@mui/material";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Calendar() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();


  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Divider>睡眠履歴</Divider>
        <LatestSleepsList user={user} />
        <Divider>作業履歴</Divider>
        <LatestSudiesList user={user} />
        <Divider>喫煙履歴</Divider>
        <LatestCigarettesList user={user} />
        <Divider>記録履歴</Divider>
        <LatestDiariesList user={user}/>
        <Divider>食事履歴</Divider>
        <LatestFoodsList user={user}/>
      </Container>
    </>
  );
}
