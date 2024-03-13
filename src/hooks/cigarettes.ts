import {
  CigaretteDataType,
  CigarettesType,
  UpdateCigaretteType,
} from "@/consts/cigarettes.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<CigarettesType>();

export async function createCigarette(
  user: User | null,
  setCigarettesCounter: Dispatch<SetStateAction<number | null>>,
) {
  try {
    const { error } = await supabase.from("cigarettes").insert({
      user_id: user?.id as string,
    });
    if (error) throw error;
    alert("Cigarettes Onset Created!");
    setCigarettesCounter(1)
  } catch (error) {
    alert("Error");
  } finally {
    console.log("終了");
  }
}

//単数
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

//複数
export async function readLatestCigarettes(
  setLatestCigaretteData: Dispatch<SetStateAction<CigaretteDataType[] | null>>,
) {
  // "cigarettes" テーブルから作成日が最新の行を取得するクエリを定義します
  const { data, error } = await supabase
    .from("cigarettes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(7);
  if (error) {
    console.error("Error fetching data:", error.message);
    return;
  }
  if (data) {
    setLatestCigaretteData(data)
  }
}

export async function updateCigarette(
  userId: string,
  id: number,
  newData: UpdateCigaretteType,
  setCigarettesCounter: Dispatch<SetStateAction<number | null>>,
) {
  try {
    const { data, error } = await supabase
      .from("cigarettes")
      .update(newData)
      .eq("user_id", userId)
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
    alert("更新完了");
    setCigarettesCounter(newData.cigarettes_counter)
  } catch (error) {
    alert("Error updating sleep data");
  } finally {
    console.log("終了");
  }
}

//ホーム用
export async function deleteCigarette(
  id: number,
  setCigarettesCounter: Dispatch<SetStateAction<number | null>>,
) {
  try {
    const { error } = await supabase.from("cigarettes").delete().eq("id", id);
    if (error) {
      throw error;
    }
    alert("Cigarettes row deleted!");
    setCigarettesCounter(0)
  } catch (error) {
    console.error("Error deleting cigarettes");
    alert("Error deleting cigarettes!");
  } finally {
    console.log('完了')
  }
}

//履歴用
export async function deleteCigarettes(
  id: number,
  setLatestCigaretteData: Dispatch<SetStateAction<CigaretteDataType[] | null>>,
) {
  try {
    const { error } = await supabase.from("cigarettes").delete().eq("id", id);
    if (error) {
      throw error;
    }

    // 削除が成功したら、sleepsList からも該当する id のデータを削除します
    setLatestCigaretteData((prevCigarettesList) =>
      prevCigarettesList!.filter((cl) => cl.id !== id)
    );
  } catch (error) {
    console.error("Error deleting cigarettes");
    alert("Error deleting cigarettes!");
  } finally {
    console.log('完了')
  }
}
