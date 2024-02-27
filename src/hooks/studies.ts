import { StudiesType, UpdateFinishStudyingType } from "@/consts/studies.types";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<StudiesType>();

export async function createStudy(
  user: User | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("studies").insert({
      user_id: user?.id as string,
    });
    if (error) throw error;
    alert("start study!");
  } catch (error) {
    alert("Error");
  } finally {
    setLoading(false);
  }
}

export async function readLatestStudy(
  setIsStudying: Dispatch<SetStateAction<boolean>>
) {
  // "sleeps" テーブルから作成日が最新の行を取得するクエリを定義します
  const { data, error } = await supabase
    .from("studies")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    console.error("Error fetching data:", error.message);
    return;
  }

  if (data[0].start_studying !== null && data[0].finish_studying === null) {
    setIsStudying(true);
  } else {
    setIsStudying(false);
  }
}

export async function updateFinishStudying(
  userId: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  newData: UpdateFinishStudyingType,
  ) {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from("studies")
      .update(newData)
      .eq("user_id", userId)
      .order("created_at", { ascending: false }) // 作成日が最新の行を指定
      .limit(1)
      .single();
    if (error) {
      throw error;
    }
    console.log("Updated study data:", data);
  } catch (error) {
    console.error("Error updating study data:");
    alert("Error updating study data");
  } finally {
    setLoading(false);
  }
}