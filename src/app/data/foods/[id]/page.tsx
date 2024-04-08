import FoodFetcher from "@/components/foods/foodFetcher";
import { Database } from "@/consts/database.types";
import { Container, Divider } from "@mui/material";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Page() {
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
        <Divider>食事詳細</Divider>
        <FoodFetcher user={user}/>
      </Container>
    </>
  );
}
