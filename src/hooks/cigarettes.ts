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

export async function createCigarette(userId: string) {
  try {
    const { error } = await supabase.from("cigarettes").insert({
      user_id: userId,
    });
    if (error) throw error;
  } catch (error) {
    alert("喫煙作成エラー");
  } finally {
  }
}

//単数
export async function readLatestCigarette(
  userId: string,
  setLatestCigaretteData: Dispatch<SetStateAction<CigaretteDataType | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from("cigarettes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw error;
    setLatestCigaretteData(data[0]);
  } catch (error) {
    alert("喫煙読み込みエラー");
  } finally {
    setLoading(false);
  }
}

//複数
export async function readLatestCigarettes(
  userId: string,
  setLatestCigarettesData: Dispatch<SetStateAction<CigaretteDataType[] | null>>
) {
  try {
    const { data, error } = await supabase
      .from("cigarettes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);
    if (error) throw error;
    setLatestCigarettesData(data);
  } catch (error) {
    alert("喫煙読み込みエラー");
  } finally {
  }
}

export async function updateCigarette(
  userId: string,
  id: number,
  newData: UpdateCigaretteType
) {
  try {
    const { error } = await supabase
      .from("cigarettes")
      .update(newData)
      .eq("user_id", userId)
      .eq("id", id)
      .single();
    if (error) throw error;
  } catch (error) {
    alert("喫煙更新エラー");
  } finally {
  }
}

//ホーム用
export async function deleteCigarette(userId: string, id: number) {
  try {
    const { error } = await supabase
      .from("cigarettes")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);
    if (error) throw error;
  } catch (error) {
    alert("喫煙削除エラー");
  } finally {
  }
}

//履歴用
export async function deleteCigarettes(
  userId: string,
  id: number,
  setLatestCigarettesData: Dispatch<SetStateAction<CigaretteDataType[] | null>>
) {
  try {
    const { error } = await supabase
      .from("cigarettes")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);
    if (error) throw error;

    // 削除が成功したら、sleepsList からも該当する id のデータを削除します
    setLatestCigarettesData((prevCigarettesList) =>
      prevCigarettesList!.filter((cl) => cl.id !== id)
    );
  } catch (error) {
    alert("喫煙削除エラー");
  } finally {
  }
}

export async function readCigarettesCount(
  userId: string,
  setAllCigarettesCount: Dispatch<SetStateAction<number | null>>
) {
  try {
    const { count, error } = await supabase
      .from("cigarettes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) throw error;

    if (count) {
      setAllCigarettesCount(count);
    }
  } catch (error) {
    alert("喫煙総数読み込みエラー");
  } finally {
  }
}

export async function readRangedCigarettes(
  userId: string,
  rangeStart: number,
  rangeEnd: number,
  setCigarettesData: Dispatch<SetStateAction<CigaretteDataType[] | null>>
) {
  try {
    let { data, error } = await supabase
      .from("cigarettes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(rangeStart, rangeEnd);

    if (error) throw error;

    if (data) {
      setCigarettesData(data);
    }
  } catch (error) {
    alert("喫煙読み込みエラー");
  } finally {
  }
}
