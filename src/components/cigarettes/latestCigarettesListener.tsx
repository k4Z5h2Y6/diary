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
import { Grid, Skeleton, Typography } from "@mui/material";

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
          readLatestCigarette(setLatestCigaretteData);
        }
      )
      .subscribe();

    // コンポーネントがアンマウントされたときにサブスクリプションを解除
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    readLatestCigarette(setLatestCigaretteData);
  }, []);

  const calculateNoSmokingTime = (date: Date) => {
    const today = new Date();
    const years = today.getFullYear() - date.getFullYear();
    setNoCigaretteYear(years);
    setNoCigaretteMonth(today.getMonth() - date.getMonth() + 12 * years);
    const diffInMilliseconds = Math.abs(today.getTime() - date.getTime());
    setNoCigaretteDay(Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)));
    setNoCigaretteHour(
      Math.floor(
        (diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
    );
    setNoCigaretteMinute(
      Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60))
    );
  };

  const DoseResetCounter = (date: Date) => {
    setCurrentId(latestCigaretteData!.id);
    const today = new Date();
    if (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    ) {
      //最新喫煙データが今日である場合
      setCigarettesCounter(latestCigaretteData!.cigarettes_counter);
    } else {
      //最新喫煙データが今日ではない場合
      setCigarettesCounter(0);
    }
  };

  useEffect(() => {
    if (latestCigaretteData) {
      if (latestCigaretteData.update_at) {
        //最新喫煙データに更新日付があった場合
        const date = new Date(latestCigaretteData.update_at);
        DoseResetCounter(date);
        calculateNoSmokingTime(date);
      } else {
        //最新喫煙データに更新日付がなかった場合
        const date = new Date(latestCigaretteData.created_at);
        DoseResetCounter(date);
        calculateNoSmokingTime(date);
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
              currentId={currentId}
              cigarettesCounter={cigarettesCounter}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ textAlign: "center" }}>
              {cigarettesCounter}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <CountUpButton
              user={user}
              currentId={currentId}
              cigarettesCounter={cigarettesCounter}
            />
          </Grid>
        </Grid>
      )}
      <Typography sx={{ textAlign: "center" }}>
        {noCigaretteYear}年{noCigaretteMonth}月{noCigaretteDay}日
        {noCigaretteHour}時間{noCigaretteMinute}分前に喫煙
      </Typography>
    </>
  );
};
