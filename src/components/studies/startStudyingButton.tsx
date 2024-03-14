"use client";
import { User } from "@supabase/auth-helpers-nextjs";
import { createStudy } from "@/hooks/studies";
import { Alert, Button, Snackbar } from "@mui/material";
import { useState } from "react";

export default function StartStudyingButton({
  user,
  isStudying,
} : {
  user: User | null
  isStudying: boolean
}) {
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);

  const handleClickStartStudying = () => {
    createStudy(user, setIsOpenSnackbar);
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
        disabled={isStudying}
        onClick={() => handleClickStartStudying()}
        sx={{width: "100%"}}
      >
        作業開始
      </Button>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity="success"
        >
          作業開始しました
        </Alert>
      </Snackbar>
    </>
  );
}