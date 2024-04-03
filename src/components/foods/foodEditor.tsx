"use client";

import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { createFood, readFood, uploadFoodImg } from "@/hooks/foods";
import { FoodDataType } from "@/consts/foods.types";
import { useParams } from "next/navigation";
import FoodForm from "./foodForm";
import { DiariesType } from "@/consts/diaries.types";
import Image from "next/image";

export default function FoodEditor({ user }: { user: User | null }) {
  const params = useParams();
  const [foodData, setFoodData] = useState<FoodDataType[] | null>(null);

  const supabase = createClientComponentClient<DiariesType>();
  const [foodImgUrl, setFoodImgUrl] = useState<string | null>(null);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("food_img")
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setFoodImgUrl(url);
      } catch (error) {
        console.log("Error downloading image");
      } finally {
      }
    }
    if (foodData) downloadImage(foodData[0].food_img_url!);
  }, [foodData, supabase]);

  useEffect(() => {
    if (params.id) {
      readFood(Number(params.id), setFoodData);
    }
  }, []);

  return (
    <>
      <FoodForm user={user} foodData={foodData} />

      {foodImgUrl ? (
        <Image
          src={foodImgUrl}
          alt=""
          width={100}
          height={100}
          // objectFit="contain"
          // layout="fill"
          unoptimized={true}
        />
      ) : (
        <></>
      )}
    </>
  );
}
