"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { updateFinishStudying } from "@/hooks/studies";
import { UpdateFinishStudyingType } from "@/consts/studies.types";
import { Button } from "@mui/material";

export default function FinishStudyingButton({
  user,
  isStudying,
}: {
  user: User | null;
  isStudying: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  function handleClick() {
    const currentDate = new Date().toISOString(); // 現在時刻をISO形式の文字列に変換
    const newData: UpdateFinishStudyingType = {
      update_at: currentDate,
      finish_studying: currentDate,
    };
    if (user) {
      updateFinishStudying(user.id, setLoading, newData);
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        disabled={!isStudying || loading}
        onClick={handleClick}
        sx={{width: "100%"}}
      >
        作業終了
      </Button>
    </>
  );
}
