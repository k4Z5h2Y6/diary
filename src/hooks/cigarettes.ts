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
) {
  try {
    const { error } = await supabase.from("cigarettes").insert({
      user_id: user?.id as string,
    });
    if (error) throw error;
  } catch (error) {
    alert("喫煙カウントアップエラー");
  } finally {
  }
}

//単数
export async function readLatestCigarette(
  setLoading: Dispatch<SetStateAction<boolean>>,
  setLatestCigaretteData: Dispatch<SetStateAction<CigaretteDataType | null>>,
) {
  try {
    setLoading(true)
    const { data, error, status } = await supabase
    .from("cigarettes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

    if (error && status !== 406) {
      throw error;
    }
    
    if (data) {
      setLatestCigaretteData(data[0])
    }
  } catch (error) {
    console.error("Error fetching ciga");
  } finally {
    setLoading(false);
  }
}

// todo tryに
//複数
export async function readLatestCigarettes(
  setLatestCigarettesData: Dispatch<SetStateAction<CigaretteDataType[] | null>>,
) {
  // "cigarettes" テーブルから作成日が最新の行を取得するクエリを定義します
  const { data, error } = await supabase
    .from("cigarettes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) {
    console.error("Error fetching data:", error.message);
    return;
  }
  if (data) {
    setLatestCigarettesData(data)
  }
}

export async function updateCigarette(
  userId: string,
  id: number,
  newData: UpdateCigaretteType,
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
  } catch (error) {
    alert("喫煙更新エラー");
  } finally {
  }
}

//ホーム用
export async function deleteCigarette(
  id: number,
) {
  try {
    const { error } = await supabase.from("cigarettes").delete().eq("id", id);
    if (error) {
      throw error;
    }
  } catch (error) {
    alert("喫煙削除エラー");
  } finally {
  }
}

//履歴用
export async function deleteCigarettes(
  id: number,
  setLatestCigarettesData: Dispatch<SetStateAction<CigaretteDataType[] | null>>,
) {
  try {
    const { error } = await supabase.from("cigarettes").delete().eq("id", id);
    if (error) {
      throw error;
    }

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
  setAllCigarettesCount: Dispatch<SetStateAction<number | null>>
) {
  try {
    const { count, error, status } = await supabase
      .from("cigarettes")
      .select("*", { count: "exact", head: true });

    if (error && status !== 406) {
      throw error;
    }

    if (count) {
      setAllCigarettesCount(count);
    }
  } catch (error) {
    alert("Error loading cigarette");
  } finally {
  }
}

export async function readRangedCigarettes(
  rangeStart: number,
  rangeEnd: number,
  setCigarettesData: Dispatch<SetStateAction<CigaretteDataType[] | null>>
) {
  try {
    let { data, error, status } = await supabase
      .from("cigarettes")
      .select("*")
      .order("created_at", { ascending: false })
      .range(rangeStart, rangeEnd) //

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setCigarettesData(data);
    }
  } catch (error) {
    alert("Error loading cigarette");
  } finally {
  }
}