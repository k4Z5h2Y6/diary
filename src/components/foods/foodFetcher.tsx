"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { readFood } from "@/hooks/foods";
import { FoodDataType } from "@/consts/foods.types";
import { useParams } from "next/navigation";
import FoodForm from "./foodForm";

export default function FoodFetcher({ user }: { user: User | null }) {
  const params = useParams();
  const [foodData, setFoodData] = useState<FoodDataType[] | null>(null);

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
