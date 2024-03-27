"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { updateFinishStudying } from "@/hooks/studies";
import { UpdateFinishStudyingType } from "@/consts/studies.types";
import { Alert, Button, Snackbar } from "@mui/material";

export default function FinishStudyingButton({
  user,
  isStudying,
}: {
  user: User | null;
  isStudying: boolean;
}) {
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);

  function handleClickFinishStudying() {
    const currentDate = new Date().toISOString(); // 現在時刻をISO形式の文字列に変換
    const newData: UpdateFinishStudyingType = {
      update_at: currentDate,
      finish_studying: currentDate,
    };
    if (user) {
      updateFinishStudying(user.id, newData, setIsOpenSnackbar);
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
        disabled={!isStudying}
        onClick={() => handleClickFinishStudying()}
        sx={{width: "100%"}}
      >
        作業終了
      </Button>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity="success"
        >
          作業終了しました
        </Alert>
      </Snackbar>
    </>
  );
}
