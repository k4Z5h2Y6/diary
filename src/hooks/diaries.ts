import { DiariesType } from "@/consts/diaries.types";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<DiariesType>();

export async function createDiary(
  user: User | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
  diary: string,
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("diaries").insert({
      user_id: user?.id as string,
      diary: diary,
    });
    if (error) throw error;
    alert("Diary posted!");
  } catch (error) {
    alert("Diary post error");
  } finally {
    setLoading(false);
  }
}