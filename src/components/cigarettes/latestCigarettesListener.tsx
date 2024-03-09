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
import { Box, Grid, Skeleton, Typography } from "@mui/material";

export const LatestCigarettesListener = ({ user }: { user: User | null }) => {
  const supabase = createClientComponentClient<CigarettesType>();
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [cigarettesCounter, setCigarettesCounter] = useState<number | null>(null);
  // const [key, setKey] = useState<number>(1); //レンダリングさせるため

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
  }, [supabase]); // 最初のマウント時にのみ実行

  useEffect(() => {
    readLatestCigarettes(setCurrentId, setCigarettesCounter);
  }, []);

  return (
    <>
      {cigarettesCounter === null ? (
        <Skeleton variant="rounded" />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={4}>
          <CountDownButton
            user={user}
            cigarettesCounter={cigarettesCounter}
            setCigarettesCounter={setCigarettesCounter}
            currentId={currentId}
          />
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{textAlign: "center"}}>{cigarettesCounter}</Typography>
          </Grid>
          <Grid item xs={4}>
          <CountUpButton user={user} cigarettesCounter={cigarettesCounter} />
          </Grid>
        </Grid>
      )}
    </>
  );
};
