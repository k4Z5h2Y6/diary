import { CigaretteCounter } from "@/components/cigarettes/cigaretteCounter";
import { LatestCigarettesList } from "@/components/cigarettes/latestCigarettesList";
import { LatestSleepsList } from "@/components/sleeps/latestSleepsList";
import { LatestSudiesList } from "@/components/studies/latestStudiesList";
// import { DiariesList } from "@/components/diaries/diariesList";
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
        <Divider>最新の睡眠</Divider>
        <LatestSleepsList user={user} />
        <Link href="">もっと見る</Link>
        <Divider>最新の作業</Divider>
        <LatestSudiesList user={user} />
        <Link href="">もっと見る</Link>
        <Divider>今日の喫煙</Divider>
        <LatestCigarettesList user={user} />
        <Link href="">もっと見る</Link>
        <Divider>今日の投稿</Divider>
        {/* <DiariesList user={user}/> */}
        <Link href="">投稿一覧へ</Link>
        <Divider>投稿カテゴリーを編集</Divider>
      </Container>
    </>
  );
}
