"use client";
import { UpdateCigarettesType } from "@/consts/cigarettes.types";
import { createCigarettes, deleteCigarettes, updateCigarettes } from "@/hooks/cigarettes";
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
  setCigarettesCounter: Dispatch<SetStateAction<number>>;
  currentId: number | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const countUpBranch = (
    user: User, 
    setLoading: Dispatch<SetStateAction<boolean>>, 
    cigarettesCounter: number,
  ) => {

    if (cigarettesCounter === 0 ) {
      return
    } else if (cigarettesCounter === 1 ) {
      deleteCigarettes(`${currentId!}`, setLoading, setCigarettesCounter)
    } else {
      const newData: UpdateCigarettesType = {cigarettes_counter: cigarettesCounter - 1}
      updateCigarettes(user.id, setLoading, newData)
    }
  }

  return (
    <>
      <div>
        <button
          onClick={() => countUpBranch(user!, setLoading, cigarettesCounter)}
        >
        ー
        </button>
      </div>
    </>
  );
}
