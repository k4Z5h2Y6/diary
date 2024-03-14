"use client";

import { UpdateWakeupType } from "@/consts/sleeps.types";
import { updateSleepWakeUp } from "@/hooks/sleeps";
import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { Alert, Button, Snackbar } from "@mui/material";

export default function WakeUpButton({
  user,
  isSleeping,
}: {
  user: User | null;
  isSleeping: boolean;
}) {
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);

  const handleClickWakeUp = () => {
    const currentDate = new Date().toISOString(); // 現在時刻をISO形式の文字列に変換
    const newData: UpdateWakeupType = {
      update_at: currentDate,
      wake_up_at: currentDate,
    };
    if (user) {
      updateSleepWakeUp(user.id, newData, setIsOpenSnackbar);
    }
  }

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpenSnackbar(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        disabled={!isSleeping}
        onClick={() => handleClickWakeUp()}
        sx={{width: "100%"}}
      >
        起床
      </Button>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity="success"
        >
          起床しました
        </Alert>
      </Snackbar>
    </>
  );
}
