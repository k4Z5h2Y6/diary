"use client";
import { createSleepOnset } from "@/hooks/sleeps";
import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { Button } from "@mui/material";

export default function SleepOnsetButton({
  user,
  isSleeping,
}: {
  user: User | null;
  isSleeping: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="outlined"
        disabled={isSleeping}
        onClick={() => createSleepOnset(user, setLoading)}
        sx={{width: "100%"}}
      >
        入眠
      </Button>
    </>
  );
}
