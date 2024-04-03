import { FoodDataType, FoodsType } from "@/consts/foods.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<FoodsType>();

export async function uploadFoodImg(
  user: User | null,
  setImgUploading: Dispatch<SetStateAction<boolean>>,
  foodImgUrl: string | null,
  foodImgFile: File | null,
  callback: () => void
) {
  try {
    if (foodImgUrl === null || foodImgFile === null) {
      throw new Error("You must select an image to upload.");
    }
    const { error: uploadError } = await supabase.storage
      .from("food_img")
      .upload(foodImgUrl, foodImgFile);

    if (uploadError) {
      throw uploadError;
    }
  } catch (error) {
    alert("Error uploading diary_img!");
  } finally {
    setImgUploading(false);
    alert("画像アップロード完了");
    callback();
  }
}

export async function deleteFoodImg(
  user: User | null,
  foodImgUrl: string,
  callback: () => void
) {
  try {
    const { error: uploadError } = await supabase.storage
      .from("food_img")
      .remove([foodImgUrl]);

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

export async function createFood(
  user: User | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
  foodText: string,
  ingredient: string,
  foodImgUrl: string | null
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("foods").insert({
      user_id: user?.id as string,
      food_text: foodText,
      ingredient: ingredient,
      food_img_url: foodImgUrl,
    });
    if (error) throw error;
  } catch (error) {
    alert("投稿エラー");
  } finally {
    setLoading(false);
    alert("投稿完了");
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
