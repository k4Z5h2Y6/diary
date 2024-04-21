"use client";
import { User } from "@supabase/auth-helpers-nextjs";
import { createStudy, readLatestStudy } from "@/hooks/studies";
import { Alert, Button, Snackbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

export default function StartStudyingButton({
  user,
  isStudying,
  setIsStudying,
}: {
  user: User | null;
  isStudying: boolean;
  setIsStudying: Dispatch<SetStateAction<boolean | null>>;
}) {
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);

  const handleClickStartStudying = async () => {
    await createStudy(user, setIsOpenSnackbar);
    await readLatestStudy(setIsStudying);
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
        sx={{ width: "100%" }}
      >
        作業開始
      </Button>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success">作業開始しました</Alert>
      </Snackbar>
    </>
  );
}
