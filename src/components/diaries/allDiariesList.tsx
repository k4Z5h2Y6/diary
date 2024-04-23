"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  Link,
  Snackbar,
  Typography,
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { PaginationDiary } from "../common/pagenationDiary";
import { DiaryDataType } from "@/consts/diaries.types";
import {
  deleteDiaries,
  deleteDiaryImg,
  readDiariesCount,
  readRangedDiaries,
} from "@/hooks/diaries";
import { readCategories } from "@/hooks/categories";
import ImgFetcher from "../common/imgFetcher";
import { CategoryType } from "@/consts/categories.types";

const parPage = 20;

export const AllDiariesList = ({ user }: { user: User | null }) => {
  const [diariesData, setDiariesData] = useState<DiaryDataType[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rangeStart, setRangeStart] = useState<number>(0);
  const [allDiariesCount, setAllDiariesCount] = useState<number | null>(null);
  const [diaryCategories, setDiaryCategories] = useState<CategoryType[]>([]);

  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

  const pageCount = (allDiariesCount: number | null, parPage: number) => {
    if (allDiariesCount! % parPage === 0) {
      return allDiariesCount! / parPage;
    } else {
      return Math.floor(allDiariesCount! / parPage) + 1;
    }
  };

  useEffect(() => {
    readDiariesCount(user?.id!, setAllDiariesCount);
    readRangedDiaries(user?.id!, 0, parPage - 1, setDiariesData);
    readCategories(user?.id!, setDiaryCategories);
  }, []);

  useEffect(() => {
    if (currentPage === 1) {
      setRangeStart(0);
    } else {
      setRangeStart(parPage * (currentPage - 1)); // currentPageが1の場合、rangeStartは0
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 1) {
      readRangedDiaries(user?.id!, 0, parPage - 1, setDiariesData);
    } else {
      readRangedDiaries(
        user?.id!,
        rangeStart,
        rangeStart + parPage - 1,
        setDiariesData
      );
    }
  }, [rangeStart]);

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

  const formatDate = (ts: string | null) => {
    if (ts) {
      const date = new Date(ts);
      const jpDate = new Date(
        date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
      );
      const month = (jpDate.getMonth() + 1).toString().padStart(2, "0");
      const day = jpDate.getDate().toString().padStart(2, "0");
      return `${month}/${day}`;
    } else {
      return null;
    }
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

  const handleDelete = async (id: number, diaryImgUrl: string[] | null) => {
    if (diaryImgUrl && diaryImgUrl.length > 0) {
      await deleteDiaryImg(diaryImgUrl);
      await deleteDiaries(user?.id!, id, setDiariesData, setIsOpenSnackbar);
    } else {
      deleteDiaries(user?.id!, id, setDiariesData, setIsOpenSnackbar);
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
      {diariesData ? (
        <>
          {diariesData.map((dd) => (
            <Card
              key={dd.id}
              sx={{
                height: 100,
                minWidth: 275,
                marginBottom: "16px",
                display: "flex",
                position: "relative",
              }}
            >
              <Link
                href={`/data/diaries/${dd.id}`}
                color="inherit"
                underline="none"
                sx={{
                  width: "calc(100% - 64px)",
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
                  {dd.diary_img_url && dd.diary_img_url[0] ? (
                    <ImgFetcher url={dd.diary_img_url[0]} bucket="diary_img" />
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
                    {formatDate(dd.created_at!)} {formatTime(dd.created_at!)}
                    {formatCategory(dd.diary_category)}
                  </Typography>
                  <Typography
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {dd.diary_text}
                  </Typography>
                </Box>
              </Link>

              <Box
                sx={{
                  width: 64,
                  height: 100,
                  display: "flex",
                  position: "absolute",
                  right: 0,
                }}
              >
                <Button onClick={() => handleDelete(dd.id, dd.diary_img_url)}>
                  削除
                </Button>
              </Box>
            </Card>
          ))}
          <PaginationDiary
            pageCount={pageCount(allDiariesCount, parPage)}
            setCurrentPage={setCurrentPage}
          />
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
