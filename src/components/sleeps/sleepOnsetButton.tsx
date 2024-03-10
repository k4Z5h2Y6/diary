"use client";
import { User } from "@supabase/auth-helpers-nextjs";
import { Button } from "@mui/material";
import { createSleepOnset } from "@/hooks/sleeps";

export default function SleepOnsetButton({
  user,
  isSleeping,
}: {
  user: User | null;
  isSleeping: boolean;
}) {

  return (
    <>
      <Button
        variant="outlined"
        disabled={isSleeping}
        onClick={() => createSleepOnset(user)}
        sx={{width: "100%"}}
      >
        入眠
      </Button>
    </>
  );
}
