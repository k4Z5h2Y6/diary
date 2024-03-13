"use client";
import { UpdateCigarettesType } from "@/consts/cigarettes.types";
import {
  deleteCigarette,
  deleteCigarettes,
  updateCigarettes,
} from "@/hooks/cigarettes";
import { Button } from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction, useState } from "react";

export default function CountDownButton({
  user,
  cigarettesCounter,
  setCigarettesCounter,
  currentId,
}: {
  user: User | null;
  cigarettesCounter: number;
  setCigarettesCounter: Dispatch<SetStateAction<number | null>>;
  currentId: number | null;
}) {

  const countDownBranch = (
    user: User,
    cigarettesCounter: number
  ) => {
    if (cigarettesCounter === 0) {
      return;
    } else if (cigarettesCounter === 1) {
      deleteCigarette(currentId!);
      setCigarettesCounter(0)
    } else {
      const currentDate = new Date().toISOString() // 現在時刻をISO形式の文字列に変換
      const newData: UpdateCigarettesType = {
        update_at: currentDate,
        cigarettes_counter: cigarettesCounter - 1,
      };
      updateCigarettes(user.id, newData);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        disabled={cigarettesCounter === 0}
        onClick={() => countDownBranch(user!, cigarettesCounter)}
        sx={{ width: "100%" }}
      >
        ー
      </Button>
    </>
  );
}
