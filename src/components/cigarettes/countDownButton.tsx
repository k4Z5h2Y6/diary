"use client";
import { UpdateCigarettesType } from "@/consts/cigarettes.types";
import {
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
  const [loading, setLoading] = useState<boolean>(false);

  const countDownBranch = (
    user: User,
    setLoading: Dispatch<SetStateAction<boolean>>,
    cigarettesCounter: number
  ) => {
    if (cigarettesCounter === 0) {
      return;
    } else if (cigarettesCounter === 1) {
      deleteCigarettes(`${currentId!}`, setLoading, setCigarettesCounter);
    } else {
      const newData: UpdateCigarettesType = {
        cigarettes_counter: cigarettesCounter - 1,
      };
      updateCigarettes(user.id, setLoading, newData);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        // disabled={isSleeping}
        onClick={() => countDownBranch(user!, setLoading, cigarettesCounter)}
        sx={{ width: "100%" }}
      >
        ー
      </Button>
    </>
  );
}
