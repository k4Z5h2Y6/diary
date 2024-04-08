import { LatestCigarettesListener } from "@/components/cigarettes/latestCigarettesListener";
import { LatestSleepsListener } from "@/components/sleeps/latestSleepsListener";
import { Database } from "@/consts/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { LatestStudiesListener } from "@/components/studies/latestStudiesListener";
import DiariesForm from "@/components/diaries/diariesForm";
import { Container, Divider } from "@mui/material";
import FoodsForm from "@/components/foods/foodsForm";
import FoodForm from "@/components/foods/foodForm";

export default async function Home() {
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
        <Divider>睡眠時間</Divider>
        <LatestSleepsListener user={user} />
        <Divider>作業時間</Divider>
        <LatestStudiesListener user={user} />
        <Divider>喫煙本数</Divider>
        <LatestCigarettesListener user={user} />
        <Divider>記録</Divider>
        <DiariesForm user={user} />
        <Divider>食事</Divider>
        {/* <FoodsForm user={user} /> */}
        <FoodForm user={user} foodData={null} />
      </Container>
    </>
  );
}
