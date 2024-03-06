"use client";
import { CigarettesType } from "@/consts/cigarettes.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { readLatestCigarettes } from "@/hooks/cigarettes";

export const CigaretteCounter = ({ user }: { user: User | null }) => {
  const supabase = createClientComponentClient<CigarettesType>();
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [cigarettesCounter, setCigarettesCounter] = useState<number | null>(null);

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
