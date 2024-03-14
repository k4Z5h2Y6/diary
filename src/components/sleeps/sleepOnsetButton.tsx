"use client";
import { User } from "@supabase/auth-helpers-nextjs";
import { Alert, Button, Snackbar } from "@mui/material";
import { createSleepOnset } from "@/hooks/sleeps";
import { useState } from "react";

export default function SleepOnsetButton({
  user,
  isSleeping,
}: {
  user: User | null;
  isSleeping: boolean;
}) {
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);

  const handleClickSleepOnset = () => {
    createSleepOnset(user, setIsOpenSnackbar);
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
