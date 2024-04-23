"use client";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import StartStudyingButton from "./startStudyingButton";
import FinishStudyingButton from "./finishStudyingButton";
import { readLatestStudy } from "@/hooks/studies";
import { StudiesType } from "@/consts/studies.types";
import { Grid, Skeleton } from "@mui/material";

export const LatestStudiesListener = ({ user }: { user: User | null }) => {
  
  const [isStudying, setIsStudying] = useState<boolean | null>(null);

  // const supabase = createClientComponentClient<StudiesType>();
  // useEffect(() => {
  //   // Realtimeクライアントを使用してsleepsテーブルを監視
  //   const subscription = supabase
  //     .channel("studies")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "studies",
  //       },
  //       (payload) => {
  //         // 変更後のデータに対しての処理を記載
  //         readLatestStudy(setIsStudying);
  //       }
  //     )
  //     .subscribe();

  //   // コンポーネントがアンマウントされたときにサブスクリプションを解除
  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [supabase]);

  useEffect(() => {
    //サインアップ後のエラーアラート防止でif (user)
    if (user) readLatestStudy(user?.id!, setIsStudying);
  }, []);

  return (
    <>
      {isStudying === null ? (
        <Skeleton variant="rounded" height={36.5} />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <StartStudyingButton user={user} isStudying={isStudying} setIsStudying={setIsStudying}/>
          </Grid>
          <Grid item xs={6}>
            <FinishStudyingButton user={user} isStudying={isStudying} setIsStudying={setIsStudying}/>
          </Grid>
        </Grid>
      )}
    </>
  );
};
