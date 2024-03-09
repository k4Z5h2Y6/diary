"use client";
import { CigaretteDataType, CigarettesType } from "@/consts/cigarettes.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import CountUpButton from "./countUpButton";
import { readLatestCigarette } from "@/hooks/cigarettes";
import CountDownButton from "./countDownButton";
import { Box, Grid, Skeleton, Typography } from "@mui/material";

export const LatestCigarettesListener = ({ user }: { user: User | null }) => {
  const supabase = createClientComponentClient<CigarettesType>();
  const [latestCigaretteData, setLatestCigaretteData] =
    useState<CigaretteDataType | null>(null);

  const [currentId, setCurrentId] = useState<number | null>(null);
  const [cigarettesCounter, setCigarettesCounter] = useState<number | null>(
    null
  );
  const [noCigaretteYear, setNoCigaretteYear] = useState<number | null>(null);
  const [noCigaretteMonth, setNoCigaretteMonth] = useState<number | null>(null);
  const [noCigaretteDay, setNoCigaretteDay] = useState<number | null>(null);
  const [noCigaretteHour, setNoCigaretteHour] = useState<number | null>(null);
  const [noCigaretteMinute, setNoCigaretteMinute] = useState<number | null>(
    null
  );
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
          console.log("Realtime?--");
          readLatestCigarette(setLatestCigaretteData);
        }
      )
      .subscribe();

    // コンポーネントがアンマウントされたときにサブスクリプションを解除
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]); // 最初のマウント時にのみ実行

  useEffect(() => {
    readLatestCigarette(setLatestCigaretteData);
  }, []);

  useEffect(() => {
    if (latestCigaretteData) {
      const today = new Date();
      const date = new Date(latestCigaretteData.update_at);
      if (
        today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate()
      ) {
        setCurrentId(latestCigaretteData.id);
        setCigarettesCounter(latestCigaretteData.cigarettes_counter);
        const years = today.getFullYear() - date.getFullYear();
        setNoCigaretteYear(years)
        setNoCigaretteMonth(today.getMonth() - date.getMonth() + 12 * years);
        const diffInMilliseconds = Math.abs(today.getTime() - date.getTime());
        setNoCigaretteDay(Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)))
        setNoCigaretteHour(Math.floor(
          (diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ))
        setNoCigaretteMinute(Math.floor(
          (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
        ))
      } else {
        setCigarettesCounter(0);
      }
    }
  }, [latestCigaretteData]);

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
            <Typography sx={{ textAlign: "center" }}>
              {cigarettesCounter}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <CountUpButton user={user} cigarettesCounter={cigarettesCounter} />
          </Grid>
        </Grid>
      )}
      <Typography sx={{ textAlign: "center" }}>{noCigaretteYear}年{noCigaretteMonth}月{noCigaretteDay}日{noCigaretteHour}時間{noCigaretteMinute}分前に喫煙</Typography>
    </>
  );
};
