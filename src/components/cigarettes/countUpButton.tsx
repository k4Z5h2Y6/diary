"use client";
import { UpdateCigarettesType } from "@/consts/cigarettes.types";
import { createCigarettes, updateCigarettes } from "@/hooks/cigarettes";
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
      const newData: UpdateCigarettesType = {cigarettes_counter: cigarettesCounter + 1}
      updateCigarettes(user.id, setLoading, newData)
    } else {
      createCigarettes(user, setLoading)
    }
  }

  return (
    <>
      <div>
        <button
          onClick={() => countUpBranch(user!, setLoading, cigarettesCounter)}
        >
          ＋
        </button>
      </div>
    </>
  );
}
