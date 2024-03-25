"use client";

import { FoodDataType } from "@/consts/foods.types";
import { deleteFoodImg, deleteFoods, readLatestFoods } from "@/hooks/foods";
import {
  Box,
  Button,
  Card,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import PreviewImg from "./previewImg";
import DeleteIcon from '@mui/icons-material/Delete';

export const LatestFoodsList = ({ user }: { user: User | null }) => {
  const [latestFoodsData, setLatestFoodsData] = useState<FoodDataType[] | null>(
    null
  );

  useEffect(() => {
    readLatestFoods(setLatestFoodsData);
    console.log(latestFoodsData);
  }, []);

  const handleDelete = async (id: number, foodImgUrl: string | null) => {
    if (foodImgUrl) {
      await deleteFoodImg(user, foodImgUrl, () => {deleteFoods(id, setLatestFoodsData)})
    } else {
      deleteFoods(id, setLatestFoodsData)
    }
  };

  return (
    <>
      {latestFoodsData ? (
        <ImageList cols={3} rowHeight={284}>
          {latestFoodsData.map((lfd) => (
            <ImageListItem key={lfd.id}>
              <PreviewImg url={lfd.food_img_url!} bucket="food_img" />
              <ImageListItemBar
                title={lfd.food_text}
                subtitle={lfd.created_at}
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
      ) : null}
    </>
  );
};
