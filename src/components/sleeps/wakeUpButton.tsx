"use client";

import { UpdateWakeupType } from "@/consts/sleeps.types";
import { updateSleepWakeUp } from "@/hooks/sleeps";
import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { Button } from "@mui/material";

export default function WakeUpButton({
  user,
  isSleeping,
}: {
  user: User | null;
  isSleeping: boolean;
}) {

  function handleWakeUpClick() {
    const currentDate = new Date().toISOString(); // 現在時刻をISO形式の文字列に変換
    const newData: UpdateWakeupType = {
      update_at: currentDate,
      wake_up_at: currentDate,
    };
    if (user) {
      updateSleepWakeUp(user.id, newData);
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        disabled={!isSleeping}
        onClick={handleWakeUpClick}
        sx={{width: "100%"}}
      >
        起床
      </Button>
    </>
  );
}
