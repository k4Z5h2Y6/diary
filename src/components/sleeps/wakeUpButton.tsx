"use client";

import { UpdateWakeupType } from "@/consts/sleeps.types";
import { readLatestSleep, updateSleepWakeUp } from "@/hooks/sleeps";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction, useState } from "react";
import { Alert, Button, Snackbar } from "@mui/material";

export default function WakeUpButton({
  user,
  isSleeping,
  setIsSleeping,
}: {
  user: User | null;
  isSleeping: boolean;
  setIsSleeping: Dispatch<SetStateAction<boolean | null>>;
}) {
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);

  const handleClickWakeUp = async () => {
    const currentDate = new Date().toISOString(); // 現在時刻をISO形式の文字列に変換
    const newData: UpdateWakeupType = {
      update_at: currentDate,
      wake_up_at: currentDate,
    };
    await updateSleepWakeUp(user?.id!, newData, setIsOpenSnackbar);
    await readLatestSleep(user?.id!, setIsSleeping);
  };

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
        sx={{ width: "100%" }}
      >
        起床
      </Button>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success">起床しました</Alert>
      </Snackbar>
    </>
  );
}
