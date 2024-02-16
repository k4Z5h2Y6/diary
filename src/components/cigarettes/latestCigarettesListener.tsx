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

export const LatestCigarettesListener = ({ user }: { user: User | null }) => {
  const supabase = createClientComponentClient<CigarettesType>();
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [cigarettesCounter, setCigarettesCounter] = useState<number>(0);

  useEffect(() => {
    // Realtimeクライアントを使用してsleepsテーブルを監視
    const subscription = supabase
      .channel("cigarettes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cigarettes",
        },
        (payload) => {
          // 変更後のデータに対しての処理を記載
          readLatestCigarettes(setCurrentId, setCigarettesCounter);
        }
      )
      .subscribe();

    // コンポーネントがアンマウントされたときにサブスクリプションを解除
    return () => {
      subscription.unsubscribe();
    };
  }, []); // 最初のマウント時にのみ実行

  useEffect(() => {
    readLatestCigarettes(setCurrentId, setCigarettesCounter);
  }, []);

  return (
    <>
      <div>
        <CountDownButton user={user} cigarettesCounter={cigarettesCounter} setCigarettesCounter={setCigarettesCounter} currentId={currentId}/>
        <div>{cigarettesCounter}</div>
        <CountUpButton user={user} cigarettesCounter={cigarettesCounter}/>
      </div>
    </>
  );
};
