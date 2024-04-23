"use client";

import { DiaryDataType } from "@/consts/diaries.types";
import {
  deleteDiaries,
  deleteDiaryImg,
  readLatestDiaries,
} from "@/hooks/diaries";
import {
  Alert,
  Box,
  Button,
  Card,
  Link,
  Snackbar,
  Typography,
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import ImgFetcher from "../common/imgFetcher";
import { readCategories } from "@/hooks/categories";
import { CategoryType } from "@/consts/categories.types";

export const LatestDiariesList = ({ user }: { user: User | null }) => {
  const [latestDiariesData, setLatestDiariesData] = useState<
    DiaryDataType[] | null
  >(null);
  const [diaryCategories, setDiaryCategories] = useState<CategoryType[]>([]);

  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    readCategories(user?.id!, setDiaryCategories);
    readLatestDiaries(user?.id!, setLatestDiariesData);
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

  const formatCategory = (categoryId: number | null) => {
    if (categoryId) {
      for (let i = 0; i < diaryCategories.length; i++) {
        if (categoryId === diaryCategories[i].id) {
          return diaryCategories[i].category_name;
        }
      }
    } else {
      return "カテゴリーなし";
    }
  };

  const handleDelete = async (id: number, diaryImgUrl: string[] | null) => {
    if (diaryImgUrl && diaryImgUrl.length > 0) {
      await deleteDiaryImg(diaryImgUrl);
      await deleteDiaries(
        user?.id!,
        id,
        setLatestDiariesData,
        setIsOpenSnackbar
      );
    } else {
      deleteDiaries(user?.id!, id, setLatestDiariesData, setIsOpenSnackbar);
    }
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpenSnackbar(false);
  };

  return (
    <>
      {latestDiariesData?.length! > 0 ? (
        <>
          {latestDiariesData!.map((ldd) => (
            <Card
              key={ldd.id}
              sx={{
                height: 100,
                minWidth: 275,
                marginBottom: "16px",
                display: "flex",
                position: "relative",
              }}
            >
              <Link
                href={`/data/diaries/${ldd.id}`}
                color="inherit"
                underline="none"
                sx={{
                  width: "calc(100% - 64px)", //
                  height: 100,
                  display: "flex",
                  position: "absolute",
                  left: 0,
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                  }}
                >
                  {ldd.diary_img_url && ldd.diary_img_url[0] ? (
                    <ImgFetcher url={ldd.diary_img_url[0]} bucket="diary_img" />
                  ) : (
                    <ImgFetcher url={null} bucket="diary_img" />
                  )}
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    overflow: "hidden",
                  }}
                >
                  <Typography>
                    {formatDate(ldd.created_at!)} {formatTime(ldd.created_at!)}{" "}
                    {formatCategory(ldd.diary_category)}
                  </Typography>
                  <Typography
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ldd.diary_text}
                  </Typography>
                </Box>
              </Link>
              <Box
                sx={{
                  width: 64, //
                  height: 100,
                  display: "flex",
                  position: "absolute",
                  right: 0,
                }}
              >
                <Button onClick={() => handleDelete(ldd.id, ldd.diary_img_url)}>
                  削除
                </Button>
              </Box>
            </Card>
          ))}
          <Link href="/data/diaries">記録一覧へ</Link>
        </>
      ) : (
        <>まだデータがありません</>
      )}
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success">完了しました</Alert>
      </Snackbar>
    </>
  );
};
