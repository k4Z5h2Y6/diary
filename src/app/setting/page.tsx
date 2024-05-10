import { UserNameForm } from "@/components/userNameForm";
import { Database } from "@/consts/database.types";
import { Button, Container, Divider } from "@mui/material";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Setting() {

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
        <Divider>設定</Divider>
        <UserNameForm user={user}/>
        <form action="/auth/signout" method="post">
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ marginBottom: "16px" }}
          >
            サインアウト
          </Button>
        </form>
      </Container>
    </>
  );
}
