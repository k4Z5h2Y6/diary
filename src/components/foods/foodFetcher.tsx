"use client";

import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { createFood, readFood } from "@/hooks/foods";
import { FoodDataType } from "@/consts/foods.types";
import { useParams } from "next/navigation";
import FoodForm from "./foodForm";
import { DiariesType } from "@/consts/diaries.types";
import Image from "next/image";

export default function FoodFetcher({ user }: { user: User | null }) {
  const params = useParams();
  const [foodData, setFoodData] = useState<FoodDataType[] | null>(null);

  // const supabase = createClientComponentClient<DiariesType>();
  // const [foodImgUrl, setFoodImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      readFood(Number(params.id), setFoodData);
    }
  }, []);

  return (
    <>
      <FoodForm user={user} foodData={foodData} />
    </>
  );
}
