"use client";
import { User } from "@supabase/auth-helpers-nextjs";
import { Alert, Button, Snackbar } from "@mui/material";
import { createSleepOnset, readLatestSleep } from "@/hooks/sleeps";
import { Dispatch, SetStateAction, useState } from "react";

export default function SleepOnsetButton({
  user,
  isSleeping,
  setIsSleeping,
}: {
  user: User | null;
  isSleeping: boolean;
  setIsSleeping: Dispatch<SetStateAction<boolean | null>>;
}) {
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

  const handleClickSleepOnset = async () => {
    await createSleepOnset(user, setIsOpenSnackbar);
    await readLatestSleep(setIsSleeping);
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
        disabled={isSleeping}
        onClick={() => handleClickSleepOnset()}
        sx={{ width: "100%" }}
      >
        入眠
      </Button>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity="success"
        >
          入眠しました
        </Alert>
      </Snackbar>
    </>
  );
}
