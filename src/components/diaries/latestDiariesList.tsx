"use client";

import { DiaryDataType } from "@/consts/diaries.types";
import {
  deleteDiaries,
  deleteDiaryImg,
  readLatestDiaries,
} from "@/hooks/diaries";
import { Box, Button, Card, Typography } from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import PreviewImg from "./previewImg";

export const LatestDiariesList = ({ user }: { user: User | null }) => {
  const [latestDiariesData, setLatestDiariesData] = useState<
    DiaryDataType[] | null
  >(null);

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
      case 1:
        return "禁煙日記";
      case 2:
        return "pombio";
      default:
        return "カテゴリーなし";
    }
  };

  const handleDelete = async (id: number, diaryImgUrl: string | null) => {
    if (diaryImgUrl) {
      await deleteDiaryImg(user, diaryImgUrl, () => {deleteDiaries(id, setLatestDiariesData)})
    } else {
      deleteDiaries(id, setLatestDiariesData)
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
                display: "flex",
              }}
            >
              <Box width={100} height={100}>
                <PreviewImg url={ldd.diary_img_url} bucket="diary_img"/>
              </Box>
              <Box>
                <Typography>
                  {formatDate(ldd.created_at!)} {formatTime(ldd.created_at!)}
                </Typography>
                <Typography>{ldd.diary_text}</Typography>
                <Typography>{formatCategory(ldd.diary_category!)}</Typography>
                <Button
                  // onClick={() => deleteDiaries(ldd.id, setLatestDiariesData)}
                  onClick={() => handleDelete(ldd.id, ldd.diary_img_url)}
                >
                  削除
                </Button>
              </Box>
            </Card>
          ))}
        </>
      ) : null}
    </>
  );
};
