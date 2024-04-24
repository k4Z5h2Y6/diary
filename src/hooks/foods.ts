import { FoodDataType, FoodsType, UpdateFoodType } from "@/consts/foods.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<FoodsType>();

export async function createFood(
  userId: string,
  foodText: string | null,
  ingredient: string | null,
  foodMemo: string | null,
  foodImgUrls: string[] | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>,
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("foods").insert({
      user_id: userId,
      food_title: foodText,
      ingredient: ingredient,
      food_memo: foodMemo,
      food_img_url: foodImgUrls,
    });
    if (error) throw error;
    setIsOpenSnackbar(true)
  } catch (error) {
    alert("食事投稿エラー");
  } finally {
    setLoading(false);
  }
}
//詳細ページ用
export async function readFood(
  userId: string,
  id: number,
  setFoodData: Dispatch<SetStateAction<FoodDataType[] | null>>
) {
  try {
    const { data, error, status } = await supabase
      .from("foods")
      .select("*")
      .eq("user_id", userId)
      .eq("id", id)
      .limit(1);

    if (error) throw error;

    if (data) {
      setFoodData(data);
    }
  } catch (error) {
    alert("食事読み込みエラー");
  } finally {
  }
}

export async function readLatestFoods(
  userId: string,
  setLatestFoodsList: Dispatch<SetStateAction<FoodDataType[] | null>>
) {
  try {
    let { data, error } = await supabase
      .from("foods")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", userId)
      .limit(15);

    if (error) throw error;
    setLatestFoodsList(data);
  } catch (error) {
    alert("食事読み込みエラー");
  } finally {
  }
}

export async function readFoodsCount(
  userId: string,
  setAllFoodsCount: Dispatch<SetStateAction<number | null>>
) {
  try {
    const { count, error } = await supabase
      .from("foods")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) throw error;

    if (count) {
      setAllFoodsCount(count);
    }
  } catch (error) {
    alert("食事総数読み込みエラー");
  } finally {
  }
}

export async function readRangedFoods(
  userId: string,
  rangeStart: number,
  rangeEnd: number,
  setFoodsData: Dispatch<SetStateAction<FoodDataType[] | null>>
) {
  try {
    let { data, error, status } = await supabase
      .from("foods")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(rangeStart, rangeEnd); //

    if (error) throw error;

    if (data) {
      setFoodsData(data);
    }
  } catch (error) {
    alert("食事読み込みエラー");
  } finally {
  }
}

export async function updateFood(
  userId: string,
  id: number,
  newData: UpdateFoodType,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>
) {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from("foods")
      .update(newData)
      .eq("user_id", userId)
      .eq("id", id)
      .single();
    if (error) throw error;
    setIsOpenSnackbar(true);
  } catch (error) {
    alert("食事更新エラー");
  } finally {
    setLoading(false);
  }
}

export async function deleteFoodImg(
  foodImgUrl: string[],
) {
  try {
    const { error: uploadError } = await supabase.storage
      .from("food_img")
      .remove(foodImgUrl);
    if (uploadError) throw uploadError;
  } catch (error) {
    alert("食事写真削除エラー");
  } finally {
  }
}

export async function deleteFoods(
  userId: string,
  id: number,
  setLatestDiariesData: Dispatch<SetStateAction<FoodDataType[] | null>>,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>
) {
  try {
    const { error } = await supabase
      .from("foods")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);

    if (error) throw error;
    // 削除が成功したら、foodsList からも該当する id のデータを削除します
    setLatestDiariesData((prevDiariesList) =>
      prevDiariesList!.filter((dl) => dl.id !== id)
    );
    setIsOpenSnackbar(true);
  } catch (error) {
    alert("食事削除エラー");
  } finally {
  }
}

export async function uploadFoodImgs(
  setLoading: Dispatch<SetStateAction<boolean>>,
  foodImgUrls: string[] | null,
  foodImgFiles: File[] | null
) {
  try {
    setLoading(true);
    if (
      !foodImgUrls ||
      !foodImgFiles ||
      foodImgUrls.length !== foodImgFiles.length
    ) {
      throw new Error("食事写真アップロードエラー");
    }

    const uploadPromises = foodImgUrls.map(async (foodImgUrl, index) => {
      const foodImgFile = foodImgFiles[index];
      const { error: uploadError } = await supabase.storage
        .from("food_img")
        .upload(foodImgUrl, foodImgFile);

      if (uploadError) {
        throw uploadError;
      }
    });

    await Promise.all(uploadPromises);
  } catch (error) {
    alert("食事写真アップロードエラー");
  } finally {
    setLoading(false);
  }
}
