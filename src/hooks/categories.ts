import { CategoriesType } from "@/consts/categories.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<CategoriesType>();

export async function readCategories(
  userId: string,
  setDiaryCategories: Dispatch<SetStateAction<any>>
) {
  try {
    let { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId);
    // .order("created_at", { ascending: false })

    if (error) {
      throw error;
    }
    setDiaryCategories(data);
  } catch (error) {
    alert("カテゴリー読み込みエラー");
  } finally {
  }
}

export async function createCategory(
  userId: string,
  categoryName: string,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>,
) {
  try {
    const { error } = await supabase.from("categories").insert({
      user_id: userId,
      category_name: categoryName,
    });
    if (error) throw error;
    setIsOpenSnackbar(true);
  } catch (error) {
    alert("カテゴリー追加エラー");
  } finally {
  }
}
