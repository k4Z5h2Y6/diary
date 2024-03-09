import { CigaretteCounter } from "@/components/cigarettes/cigaretteCounter";
// import { LatestSleepsRow } from "@/components/sleeps/latestSleepsRow";
// import { DiariesList } from "@/components/diaries/diariesList";
import { LatestSudiesRow } from "@/components/studies/latestStudiesRow";
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
        {/* <LatestSleepsRow user={user} /> */}
        <Link href="">もっと見る</Link>
        <Divider>最新の作業</Divider>
        <LatestSudiesRow user={user} />
        <Link href="">もっと見る</Link>
        <Divider>今日の喫煙</Divider>
        <CigaretteCounter />
        <Link href="">もっと見る</Link>
        <Divider>今日の投稿</Divider>
        {/* <DiariesList user={user}/> */}
        <Link href="">投稿一覧へ</Link>
        <Divider>投稿カテゴリーを編集</Divider>
      </Container>
    </>
  );
}
