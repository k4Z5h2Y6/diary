"use client";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import SleepOnsetButton from "./sleepOnsetButton";
import { useEffect, useState } from "react";
import WakeUpButton from "./wakeUpButton";
import { readLatestSleep } from "@/hooks/sleeps";
import { SleepsType } from "@/consts/sleeps.types";

export const LatestSleepsListener = ({ user }: { user: User | null }) => {
  const supabase = createClientComponentClient<SleepsType>();
  const [isSleeping, setIsSleeping] = useState<boolean>(false);

  useEffect(() => {
    // Realtimeクライアントを使用してsleepsテーブルを監視
    const subscription = supabase
      .channel("sleeps")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sleeps",
        },
        (payload) => {
          // 変更後のデータに対しての処理を記載
          readLatestSleep(setIsSleeping);
        }
      )
      .subscribe();

    // コンポーネントがアンマウントされたときにサブスクリプションを解除
    return () => {
      subscription.unsubscribe();
    };
  }, []); // 最初のマウント時にのみ実行

  useEffect(() => {
    readLatestSleep(setIsSleeping);
  }, []);

  return (
    <>
      <SleepOnsetButton user={user} isSleeping={isSleeping} />
      <WakeUpButton user={user} isSleeping={isSleeping} />
    </>
  );
};

