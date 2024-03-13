"use client";
import { UpdateCigaretteType } from "@/consts/cigarettes.types";
import { createCigarette, updateCigarette } from "@/hooks/cigarettes";
import { Button } from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

export default function CountUpButton({
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

  const countUpBranch = () => {
    if (cigarettesCounter > 0 ) {
      const currentDate = new Date().toISOString() // 現在時刻をISO形式の文字列に変換
      const newData: UpdateCigaretteType = {
        update_at: currentDate,
        cigarettes_counter: cigarettesCounter + 1
      }
      updateCigarette(user!.id, currentId!, newData, setCigarettesCounter)
    } else {
      createCigarette(user, setCigarettesCounter)
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => countUpBranch()}
        sx={{width: "100%"}}
      >
        ＋
      </Button>
    </>
  );
}
