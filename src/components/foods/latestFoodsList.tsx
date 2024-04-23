"use client";

import { FoodDataType } from "@/consts/foods.types";
import { deleteFoodImg, deleteFoods, readLatestFoods } from "@/hooks/foods";
import {
  Alert,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  Snackbar,
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import PreviewImg from "./previewImg";
import DeleteIcon from "@mui/icons-material/Delete";

export const LatestFoodsList = ({ user }: { user: User | null }) => {
  const [latestFoodsData, setLatestFoodsData] = useState<FoodDataType[] | null>(
    null
  );
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    readLatestFoods(user?.id!, setLatestFoodsData);
  }, []);

  const handleDelete = async (id: number, foodImgUrl: string[] | null) => {
    if (foodImgUrl && foodImgUrl.length > 0) {
      await deleteFoodImg(foodImgUrl);
      await deleteFoods(user?.id!, id, setLatestFoodsData, setIsOpenSnackbar);
    } else {
      deleteFoods(user?.id!, id, setLatestFoodsData, setIsOpenSnackbar);
    }
  };

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
      {latestFoodsData?.length! > 0 ? (
        <>
          <ImageList cols={3} rowHeight={280}>
            {latestFoodsData!.map((lfd) => (
              <ImageListItem key={lfd.id}>
                <Link
                  href={`/data/foods/${lfd.id}`}
                  color="inherit"
                  underline="none"
                >
                  {/* todo PreviewImg内で条件分岐が必要？ */}
                  {lfd.food_img_url && lfd.food_img_url[0] ? (
                    <PreviewImg url={lfd.food_img_url[0]} />
                  ) : (
                    <PreviewImg url={null} />
                  )}
                </Link>
                <ImageListItemBar
                  title={lfd.food_title}
                  subtitle={`${formatDate(lfd.created_at!)} ${formatTime(
                    lfd.created_at!
                  )}`}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                      aria-label={`info about ${lfd.food_title}`}
                      onClick={() => handleDelete(lfd.id, lfd.food_img_url!)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
          <Link href="/data/foods">記録一覧へ</Link>
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
