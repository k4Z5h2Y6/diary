"use client";
import { User } from "@supabase/auth-helpers-nextjs";
import { createStudy, readLatestStudying } from "@/hooks/studies";
import { Alert, Button, Snackbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { StudyDataType } from "@/consts/studies.types";

export default function StartStudyingButton({
  user,
  isStudying,
  studyCategory,
  setStudyingData,
}: {
  user: User | null;
  isStudying: boolean;
  studyCategory: number | null;
  setStudyingData: Dispatch<SetStateAction<StudyDataType[] | null>>
}) {
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);

  const handleClickStartStudying = async () => {
    await createStudy(user?.id!, studyCategory, setIsOpenSnackbar);
    await readLatestStudying(user?.id!, setStudyingData);
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
