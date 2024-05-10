import { ProfilesType, UpdateUserNameType } from "@/consts/profile.types";
import {
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<ProfilesType>();

//ユーザーネームのみ読み込み
export async function readUserName(
  userId: string,
  setUserName: Dispatch<SetStateAction<string | null>>
) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_name")
      .eq("id", userId)
      .limit(1);
    if (error) throw error;
    setUserName(data[0].user_name);
  } catch (error) {
    alert("ユーザーネーム読み込みエラー");
  } finally {
  }
}

//ユーザーネーム更新
export async function updateUserName(
  userId: string,
  newData: UpdateUserNameType,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>,
) {
  try {
    const { error } = await supabase
      .from("profiles")
      .update(newData)
      .eq("id", userId)
      .single();
    if (error) throw error;
    setIsOpenSnackbar(true);
  } catch (error) {
    alert("ユーザーネーム更新エラー");
  } finally {
  }
}
