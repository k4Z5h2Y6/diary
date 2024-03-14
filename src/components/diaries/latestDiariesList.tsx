"use client";

import { DiaryDataType } from "@/consts/diaries.types";
import { deleteDiaries, readLatestDiaries } from "@/hooks/diaries";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export const LatestDiariesList = ({ user }: { user: User | null }) => {
  const [latestDiariesData, setLatestDiariesData] = useState<
    DiaryDataType[] | null
  >(null);

  useEffect(() => {
    readLatestDiaries(setLatestDiariesData);
  }, []);

  useEffect(() => {
    readLatestDiaries(setLatestDiariesData);
  }, []);

  const formatDate = (ts: string) => {
    const date = new Date(ts);
    const jpDate = new Date(
      date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    );
    const month = (jpDate.getMonth() + 1).toString().padStart(2, "0");
    const day = jpDate.getDate().toString().padStart(2, "0");
    return `${month}/${day}`;
  };

  const formatTime = (ts: string) => {
    if (ts) {
      const date = new Date(ts);
      const jpOffset = 9; // Japan's timezone offset from UTC in hours
      const jpHours = (date.getUTCHours() + jpOffset)
        .toString()
        .padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      return `${jpHours}:${minutes}`;
    } else {
      return null;
    }
  };

  const formatCategory = (n: number) => {
    switch (n) {
      case 1: return "禁煙日記"
      case 2: return "pombio"
      default : return "カテゴリーなし"
    }
  };

  return (
    <>
      {latestDiariesData ? (
        <>
          {latestDiariesData.map((ldd) => (
            <Card
              key={ldd.id}
              sx={{
                minWidth: 275,
                marginBottom: "16px",
              }}
            >
              <CardContent>
                <Typography>
                  {formatDate(ldd.created_at!)} {formatTime(ldd.created_at!)}
                </Typography>
                <Typography>{ldd.diary_text}</Typography>
                <Typography>{formatCategory(ldd.diary_category!)}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => deleteDiaries(ldd.id, setLatestDiariesData)}
                >
                  削除
                </Button>
              </CardActions>
            </Card>
          ))}
        </>
      ) : null}
    </>
  );
};
