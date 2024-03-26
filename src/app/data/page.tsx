import { LatestCigarettesList } from "@/components/cigarettes/latestCigarettesList";
import { LatestDiariesList } from "@/components/diaries/latestDiariesList";
import { LatestFoodsList } from "@/components/foods/latestFoodsList";
import { LatestSleepsList } from "@/components/sleeps/latestSleepsList";
import { LatestSudiesList } from "@/components/studies/latestStudiesList";
import { Database } from "@/consts/database.types";
import { Container, Divider, Link } from "@mui/material";
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
        <Link href="/data/sleeps">もっと見る</Link>
        <Divider>作業履歴</Divider>
        <LatestSudiesList user={user} />
        <Link href="">もっと見る</Link>
        <Divider>喫煙履歴</Divider>
        <LatestCigarettesList user={user} />
        <Link href="">もっと見る</Link>
        <Divider>投稿履歴</Divider>
        <LatestDiariesList user={user}/>
        <Link href="">投稿一覧へ</Link>
        <Divider>食事履歴</Divider>
        <LatestFoodsList user={user}/>
        <Link href="">食事一覧へ</Link>
      </Container>
    </>
  );
}
