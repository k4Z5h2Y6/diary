import {
  CigaretteDataType,
  CigarettesType,
  UpdateCigarettesType,
} from "@/consts/cigarettes.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<CigarettesType>();

export async function createCigarettes(
  user: User | null,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("cigarettes").insert({
      user_id: user?.id as string,
    });
    if (error) throw error;
    alert("Cigarettes Onset Created!");
  } catch (error) {
    alert("Error");
  } finally {
    setLoading(false);
  }
}

export async function readLatestCigarette(
  setLatestCigaretteData: Dispatch<SetStateAction<CigaretteDataType | null>>,
) {
  // "cigarettes" テーブルから作成日が最新の行を取得するクエリを定義します
  const { data, error } = await supabase
    .from("cigarettes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    console.error("Error fetching data:", error.message);
    return;
  }
  if (data[0]) {
    setLatestCigaretteData(data[0])
  }
}

export async function updateCigarettes(
  userId: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  newData: UpdateCigarettesType
) {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from("cigarettes")
      .update(newData)
      .eq("user_id", userId)
      .order("created_at", { ascending: false }) // 作成日が最新の行を指定
      .limit(1)
      .single();
    if (error) {
      throw error;
    }
    console.log("Updated cigarettes data:", data);
  } catch (error) {
    console.error("Error updating cigarettes data:");
    alert("Error updating cigarettes data");
  } finally {
    setLoading(false);
  }
}

export async function deleteCigarettes(
  id: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setCigarettesCounter: Dispatch<SetStateAction<number | null>>
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("cigarettes").delete().eq("id", id);
    if (error) {
      throw error;
    }
    setCigarettesCounter(0)
    alert("Cigarettes deleted!");
  } catch (error) {
    console.error("Error deleting cigarettes");
    alert("Error deleting cigarettes!");
  } finally {
    setLoading(false);
  }
}
