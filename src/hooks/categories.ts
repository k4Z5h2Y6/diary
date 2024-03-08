import { CategoriesType, InputCategoriesType } from "@/consts/categories.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<CategoriesType>();

export async function readCategories(
  setLoading: Dispatch<SetStateAction<boolean>>,
  setDiaryCategories: Dispatch<SetStateAction<any[]>>
) {
  try {
    setLoading(true);
    let { data, error, status } = await supabase.from("categories").select("*");
    // .order("created_at", { ascending: false })

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      const transformCategories = (categories: InputCategoriesType[]): { id: number, label: string }[] =>
        categories.map(category => ({ id: category.id, label: category.category_name }));

      const outputCategories = transformCategories(data);
      setDiaryCategories(outputCategories);
    }
  } catch (error) {
    alert("Error loading user category!");
  } finally {
    setLoading(false);
  }
}
