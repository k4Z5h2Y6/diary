"use client";
import { UpdateCigarettesType } from "@/consts/cigarettes.types";
import { createCigarettes, updateCigarettes } from "@/hooks/cigarettes";
import { Button } from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction, useState } from "react";

export default function CountUpButton({
  user,
  cigarettesCounter,
}: {
  user: User | null;
  cigarettesCounter: number;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const countUpBranch = (
    user: User, 
    setLoading: Dispatch<SetStateAction<boolean>>, 
    cigarettesCounter: number,
  ) => {
    if (cigarettesCounter > 0 ) {
      const currentDate = new Date().toISOString() // 現在時刻をISO形式の文字列に変換
      const newData: UpdateCigarettesType = {
        update_at: currentDate,
        cigarettes_counter: cigarettesCounter + 1
      }
      updateCigarettes(user.id, newData)
    } else {
      createCigarettes(user, setLoading)
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => countUpBranch(user!, setLoading, cigarettesCounter)}
        sx={{width: "100%"}}
      >
        ＋
      </Button>
    </>
  );
}
