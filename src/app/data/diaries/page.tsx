import { AllDiariesList } from "@/components/diaries/allDiariesList";
import { AllSleepsList } from "@/components/sleeps/allSleepsList";
import { Database } from "@/consts/database.types";
import { Container, Divider } from "@mui/material";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Sleeps() {
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
        <Divider>全記録履歴</Divider>
        <AllDiariesList user={user} />
      </Container>
    </>
  );
}
