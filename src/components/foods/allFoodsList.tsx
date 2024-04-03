"use client";

import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { PaginationDiary } from "../common/pagenationDiary";
import PreviewImg from "./previewImg";
import DeleteIcon from "@mui/icons-material/Delete";
import { FoodDataType } from "@/consts/foods.types";
import {
  deleteFoodImg,
  deleteFoods,
  readFoodsCount,
  readRangedFoods,
} from "@/hooks/foods";

const parPage = 15;

export const AllFoodsList = ({ user }: { user: User | null }) => {
  const [foodsData, setFoodsData] = useState<FoodDataType[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rangeStart, setRangeStart] = useState<number>(0);
  const [allFoodsCount, setAllFoodsCount] = useState<number | null>(null);
  const pageCount = (allFoodsCount: number | null, parPage: number) => {
    if (allFoodsCount! % parPage === 0) {
      return allFoodsCount! / parPage;
    } else {
      return Math.floor(allFoodsCount! / parPage) + 1;
    }
  };

  useEffect(() => {
    readFoodsCount(setAllFoodsCount);
    readRangedFoods(0, parPage - 1, setFoodsData);
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
      readRangedFoods(0, parPage - 1, setFoodsData);
    } else {
      readRangedFoods(rangeStart, rangeStart + parPage - 1, setFoodsData);
    }
  }, [rangeStart]);

  const handleDelete = async (id: number, foodImgUrl: string | null) => {
    if (foodImgUrl) {
      await deleteFoodImg(user, foodImgUrl, () => {
        deleteFoods(id, setFoodsData);
      });
    } else {
      deleteFoods(id, setFoodsData);
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

  return (
    <>
      {foodsData ? (
        <>
          <ImageList cols={3} rowHeight={284}>
            {foodsData.map((lfd) => (
              <ImageListItem key={lfd.id}>
                <Link
                  href={`/data/foods/${lfd.id}`}
                  color="inherit"
                  underline="none"
                >
                  <PreviewImg url={lfd.food_img_url!} bucket="food_img" />
                </Link>
                <ImageListItemBar
                  title={lfd.food_text}
                  subtitle={`${formatDate(lfd.created_at!)} ${formatTime(
                    lfd.created_at!
                  )}`}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                      aria-label={`info about ${lfd.food_text}`}
                      onClick={() => handleDelete(lfd.id, lfd.food_img_url!)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
          <PaginationDiary
            pageCount={pageCount(allFoodsCount, parPage)}
            setCurrentPage={setCurrentPage}
          />
        </>
      ) : null}
    </>
  );
};
