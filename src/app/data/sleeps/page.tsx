import { AllSleepsList } from "@/components/sleeps/allSleepsList";
import { Database } from "@/consts/database.types";
import { readSleepsCount } from "@/hooks/sleeps";
import { Container, Divider } from "@mui/material";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { useEffect, useState } from "react";

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
        <Divider>全睡眠履歴</Divider>
        <AllSleepsList user={user} />
      </Container>
    </>
  );
}
