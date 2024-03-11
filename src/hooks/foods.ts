import { FoodsType } from "@/consts/foods.types";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
    if (foodImgUrl === null || foodImgFile === null ) {
      throw new Error('You must select an image to upload.')
    }
    const { error: uploadError } = await supabase.storage.from('food_img').upload(foodImgUrl, foodImgFile)

    if (uploadError) {
      throw uploadError
    }

  } catch (error) {
    alert('Error uploading diary_img!')
  } finally {
    setImgUploading(false);
    alert("画像アップロード完了")
    callback();
  }
}

export async function createFood(
  user: User | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
  foodText: string,
  foodImgUrl: string | null,
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("foods").insert({
      user_id: user?.id as string,
      food_text: foodText,
      food_img_url: foodImgUrl,
    });
    if (error) throw error;
  } catch (error) {
    alert("投稿エラー");
  } finally {
    setLoading(false);
    alert("投稿完了")
  }
}