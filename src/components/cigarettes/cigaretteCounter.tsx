"use client";
import { CigarettesType } from "@/consts/cigarettes.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import CountUpButton from "./countUpButton";
import { readLatestCigarettes } from "@/hooks/cigarettes";
import CountDownButton from "./countDownButton";

export const CigaretteCounter = ({ user }: { user: User | null }) => {
  const supabase = createClientComponentClient<CigarettesType>();
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [cigarettesCounter, setCigarettesCounter] = useState<number>(0);

  useEffect(() => {
    readLatestCigarettes(setCurrentId, setCigarettesCounter);
  }, []);

  return (
    <>
      <p>今日の喫煙本数は</p>
      <p>{cigarettesCounter}本</p>
    </>
  );
};
