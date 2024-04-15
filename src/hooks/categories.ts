import { CategoriesType, InputCategoriesType } from "@/consts/categories.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<CategoriesType>();

export async function readCategories(
  setDiaryCategories: Dispatch<SetStateAction<any>>
) {
  try {
    let { data, error, status } = await supabase.from("categories").select("*");
    // .order("created_at", { ascending: false })

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setDiaryCategories(data)
    }
  } catch (error) {
    alert("Error loading user category!");
  } finally {
  }
}

export async function createCategory(
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>,
  user: User | null,
  categoryName: string,
) {
  try {
    const { error } = await supabase.from("categories").insert({
      user_id: user?.id as string,
      category_name: categoryName,
    });
    if (error) throw error;
    setIsOpenSnackbar(true)
  } catch (error) {
    alert("投稿エラー");
  } finally {
  }
}
