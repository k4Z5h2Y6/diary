"use client";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import SleepOnsetButton from "./sleepOnsetButton";
import { useEffect, useState } from "react";
import WakeUpButton from "./wakeUpButton";
import { readLatestSleep } from "@/hooks/sleeps";
import { Grid, Skeleton } from "@mui/material";

export const LatestSleepsListener = ({ user }: { user: User | null }) => {
  
  const [isSleeping, setIsSleeping] = useState<boolean | null>(null);

  //リアルタイム通信用
  //const supabase = createClientComponentClient<SleepsType>();
  // useEffect(() => {
  //   // Realtimeクライアントを使用してsleepsテーブルを監視
  //   const subscription = supabase
  //     .channel("sleeps")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "sleeps",
  //       },
  //       (payload) => {
  //         // 変更後のデータに対しての処理を記載
  //         readLatestSleep(setIsSleeping);
  //       }
  //     )
  //     .subscribe();

  //   // コンポーネントがアンマウントされたときにサブスクリプションを解除
  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [supabase]);

  useEffect(() => {
    readLatestSleep(user?.id!, setIsSleeping);
  }, []);

  return (
    <>
      {isSleeping === null ? (
        <Skeleton variant="rounded" height={36.5} />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SleepOnsetButton user={user} isSleeping={isSleeping} setIsSleeping={setIsSleeping}/>
          </Grid>
          <Grid item xs={6}>
            <WakeUpButton user={user} isSleeping={isSleeping} setIsSleeping={setIsSleeping}/>
          </Grid>
        </Grid>
      )}
    </>
  );
};
