"use client";
import {
  CigaretteDataType,
  UpdateCigaretteType,
} from "@/consts/cigarettes.types";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import {
  createCigarette,
  deleteCigarette,
  readLatestCigarette,
  updateCigarette,
} from "@/hooks/cigarettes";
import {
  Button,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";

export const CigarettesForm = ({
  user,
  cigarettesData,
}: {
  user: User | null;
  cigarettesData: CigaretteDataType | null;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [latestCigaretteData, setLatestCigaretteData] =
    useState<CigaretteDataType | null>(null);
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
    if (cigarettesData) {
      setLatestCigaretteData(cigarettesData);
    } else {
      //サインアップ後のエラーアラート防止でif (user)
      if (user) readLatestCigarette(user.id, setLatestCigaretteData, setLoading);
    }
  }, [cigarettesData]);

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

  //latestCigaretteDataが昨日か今日か判定
  const DoseResetCounter = (date: Date) => {
    const today = new Date();
    if (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    ) {
      //最新喫煙データが今日である場合
      setCigarettesCounter(latestCigaretteData!.cigarettes_counter);
    } else if (cigarettesData) {
      //最新喫煙データが今日ではない、かつcigarettesDataを受け取っている場合
      setCigarettesCounter(cigarettesData.cigarettes_counter);
    } else {
      //最新喫煙データが今日ではない、かつcigarettesDataを受け取ってない場合
      setCigarettesCounter(0)
    }
  };

  //喫煙間隔時間の参照がupdate_atかcreated_atか判定
  useEffect(() => {
    if (latestCigaretteData) {
      if (latestCigaretteData.update_at) {
        //最新喫煙データに更新日付があった場合
        const createdDate = new Date(latestCigaretteData.created_at);
        const updateDate = new Date(latestCigaretteData.update_at);
        DoseResetCounter(createdDate); //updateDateに設定するとdata画面で編集した際にエラー発生
        calculateNoSmokingTime(updateDate);
      } else {
        //最新喫煙データに更新日付がなかった場合
        const createdDate = new Date(latestCigaretteData.created_at);
        DoseResetCounter(createdDate);
        calculateNoSmokingTime(createdDate);
      }
    } else {
      setCigarettesCounter(0)
    }
  }, [latestCigaretteData]);

  const countDownBranch = async () => {
    if (cigarettesCounter === 0) {
      return;
    } else if (cigarettesCounter === 1) {
      await deleteCigarette(user?.id!, latestCigaretteData!.id);
      await readLatestCigarette(user?.id!, setLatestCigaretteData, setLoading);
    } else {
      const currentDate = new Date().toISOString();
      const newData: UpdateCigaretteType = {
        update_at: currentDate,
        cigarettes_counter: cigarettesCounter! - 1,
      };
      await updateCigarette(user!.id, latestCigaretteData!.id, newData);
      await readLatestCigarette(user?.id!, setLatestCigaretteData, setLoading);
    }
  };

  const countUpBranch = async () => {
    if (cigarettesCounter! > 0) {
      const currentDate = new Date().toISOString();
      const newData: UpdateCigaretteType = {
        update_at: currentDate,
        cigarettes_counter: cigarettesCounter! + 1,
      };
      await updateCigarette(user!.id, latestCigaretteData!.id, newData);
      await readLatestCigarette(user?.id!, setLatestCigaretteData, setLoading);
    } 
    if (cigarettesCounter === 0) {
      await createCigarette(user?.id!);
      await readLatestCigarette(user?.id!, setLatestCigaretteData, setLoading);
    }
  };

  return (
    <>
      {cigarettesCounter !== null ? (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              disabled={cigarettesCounter === 0}
              onClick={() => countDownBranch()}
              sx={{ width: "100%" }}
            >
              ー
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ textAlign: "center" }}>
              {loading ? <CircularProgress size={24} /> : cigarettesCounter}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              onClick={() => countUpBranch()}
              sx={{ width: "100%" }}
            >
              ＋
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Skeleton variant="rounded" height={36.5} />
      )}
      {cigarettesData ? (
        <></>
      ) : (
        <Typography sx={{ textAlign: "center" }}>
          {noCigaretteYear}年{noCigaretteMonth}月{noCigaretteDay}日
          {noCigaretteHour}時間{noCigaretteMinute}分前に喫煙
        </Typography>
      )}
    </>
  );
};
