"use client";
import { UpdateCigaretteType } from "@/consts/cigarettes.types";
import {
  deleteCigarette,
  updateCigarette,
} from "@/hooks/cigarettes";
import { Button } from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

export default function CountDownButton({
  user,
  currentId,
  cigarettesCounter,
  setCigarettesCounter,
}: {
  user: User | null;
  currentId: number | null;
  cigarettesCounter: number;
  setCigarettesCounter: Dispatch<SetStateAction<number | null>>;
}) {

  const countDownBranch = () => {
    if (cigarettesCounter === 0) {
      return;
    } else if (cigarettesCounter === 1) {
      deleteCigarette(currentId!, setCigarettesCounter);
    } else {
      const currentDate = new Date().toISOString() // 現在時刻をISO形式の文字列に変換
      const newData: UpdateCigaretteType = {
        update_at: currentDate,
        cigarettes_counter: cigarettesCounter - 1,
      };
      updateCigarette(user!.id, currentId!, newData, setCigarettesCounter);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        disabled={cigarettesCounter === 0}
        onClick={() => countDownBranch()}
        sx={{ width: "100%" }}
      >
        ー
      </Button>
    </>
  );
}
