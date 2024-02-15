"use client";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import SleepOnsetButton from "./sleepOnsetButton";
import { SleepsType } from "@/consts/database.types";
import { useEffect, useState } from "react";
import WakeUpButton from "./wakeUpButton";

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
          fetchLatestSleep();
        }
      )
      .subscribe();

    // コンポーネントがアンマウントされたときにサブスクリプションを解除
    return () => {
      subscription.unsubscribe();
    };
  }, []); // 最初のマウント時にのみ実行

  async function fetchLatestSleep() {
    // "sleeps" テーブルから作成日が最新の行を取得するクエリを定義します
    const { data, error } = await supabase
      .from("sleeps")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }

    if (data[0].sleep_onset_at !== null && data[0].wake_up_at === null) {
      setIsSleeping(true);
    } else {
      setIsSleeping(false);
    }
  }

  useEffect(() => {
    fetchLatestSleep();
  }, []);

  return (
    <>
      <SleepOnsetButton user={user} isSleeping={isSleeping} />
      <WakeUpButton user={user} isSleeping={isSleeping} />
    </>
  );
};
