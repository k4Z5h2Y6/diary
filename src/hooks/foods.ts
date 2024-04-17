import { FoodDataType, FoodsType, UpdateFoodType } from "@/consts/foods.types";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<FoodsType>();

export async function createFood(
  user: User | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
  foodText: string | null,
  ingredient: string | null,
  foodMemo: string | null,
  foodImgUrls: string[] | null
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("foods").insert({
      user_id: user?.id as string,
      food_title: foodText,
      ingredient: ingredient,
      food_memo: foodMemo,
      food_img_url: foodImgUrls,
    });
    if (error) throw error;
    alert("投稿完了");
  } catch (error) {
    alert("投稿エラー");
  } finally {
    setLoading(false);
  }
}
//詳細ページ用
export async function readFood(
  id: number,
  setFoodData: Dispatch<SetStateAction<FoodDataType[] | null>>
) {
  try {
    const { data, error, status } = await supabase
      .from("foods")
      .select("*")
      .eq("id", id)
      .limit(1);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setFoodData(data);
    }
  } catch (error) {
    alert("食事読み込みエラー");
  } finally {
  }
}

export async function readLatestFoods(
  setLatestFoodsList: Dispatch<SetStateAction<FoodDataType[] | null>>
) {
  try {
    let { data, error, status } = await supabase
      .from("foods")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(15);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setLatestFoodsList(data);
    }
  } catch (error) {
    alert("記録読み込みエラー");
  } finally {
  }
}

export async function readFoodsCount(
  setAllFoodsCount: Dispatch<SetStateAction<number | null>>
) {
  try {
    const { count, error, status } = await supabase
      .from("foods")
      .select("*", { count: "exact", head: true });

    if (error && status !== 406) {
      throw error;
    }

    if (count) {
      setAllFoodsCount(count);
    }
  } catch (error) {
    alert("Error loading user Foods list!");
  } finally {
  }
}

export async function readRangedFoods(
  rangeStart: number,
  rangeEnd: number,
  setFoodsData: Dispatch<SetStateAction<FoodDataType[] | null>>
) {
  try {
    let { data, error, status } = await supabase
      .from("foods")
      .select("*")
      .order("created_at", { ascending: false })
      .range(rangeStart, rangeEnd); //

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setFoodsData(data);
    }
  } catch (error) {
    alert("Error loading user Foods list!");
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
    setLoading(true)
    const { data, error } = await supabase
      .from("foods")
      .update(newData)
      .eq("user_id", userId)
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
    setIsOpenSnackbar(true)
  } catch (error) {
    alert("記録更新エラー");
  } finally {
    setLoading(false)
  }
}

export async function deleteFoodImg(
  user: User | null,
  foodImgUrl: string[],
  callback: () => void
) {
  try {
    const { error: uploadError } = await supabase.storage
      .from("food_img")
      .remove(foodImgUrl);

    if (uploadError) {
      throw uploadError;
    }
    alert("写真削除完了");
    callback();
  } catch (error) {
    alert("Error delete food_img!");
  } finally {
  }
}

export async function deleteFoods(
  id: number,
  setLatestDiariesData: Dispatch<SetStateAction<FoodDataType[] | null>>
) {
  try {
    const { error } = await supabase.from("foods").delete().eq("id", id);

    if (error) {
      throw error;
    }

    // 削除が成功したら、foodsList からも該当する id のデータを削除します
    setLatestDiariesData((prevDiariesList) =>
      prevDiariesList!.filter((dl) => dl.id !== id)
    );
    alert("食事削除完了");
  } catch (error) {
    alert("食事削除エラー");
  } finally {
  }
}

export async function uploadFoodImgs(
  user: User | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
  foodImgUrls: string[] | null,
  foodImgFiles: File[] | null,
) {
  try {
    setLoading(true);
    if (
      !foodImgUrls ||
      !foodImgFiles ||
      foodImgUrls.length !== foodImgFiles.length
    ) {
      throw new Error("You must provide matching image URLs and files.");
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
    console.log("画像完了");
  } catch (error) {
    alert("Error uploading food images!");
  } finally {
    setLoading(false);
  }
}
