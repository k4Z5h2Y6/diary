"use client";
import { Database } from "@/consts/database.types";
import { Button } from "@mui/material";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    router.push("/login")
  };

  return (
    <>
      <Button
        onClick={(e) => handleLogout()}
      >
        ログアウト
      </Button>
    </>
  );
}
