"use client";
import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { createStudy } from "@/hooks/studies";
import { Button } from "@mui/material";

export default function StartStudyingButton({
  user,
  isStudying,
} : {
  user: User | null
  isStudying: boolean
}) {
  return (
    <>
      <Button
        variant="outlined"
        disabled={isStudying}
        onClick={() => createStudy(user)}
        sx={{width: "100%"}}
      >
        作業開始
      </Button>
    </>
  );
}