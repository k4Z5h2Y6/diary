import {
  StudiesType,
  StudyDataType,
  UpdateFinishStudyingType,
  UpdateStudyType,
} from "@/consts/studies.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<StudiesType>();

export async function createStudy(
  user: User | null,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>
) {
  try {
    const { error } = await supabase.from("studies").insert({
      user_id: user?.id as string,
    });
    if (error) throw error;
    setIsOpenSnackbar(true);
  } catch (error) {
    alert("作業開始エラー");
  } finally {
  }
}

export async function readLatestStudy(
  setIsStudying: Dispatch<SetStateAction<boolean | null>>
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

export async function readLatestStudies(
  setLatestStudiesData: Dispatch<SetStateAction<StudyDataType[] | null>>
) {
  try {
    let { data, error, status } = await supabase
      .from("studies")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setLatestStudiesData(data);
    }
  } catch (error) {
    alert("Error loading user study list!");
  } finally {
  }
}

export async function updateFinishStudying(
  userId: string,
  newData: UpdateFinishStudyingType,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>
) {
  try {
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
    setIsOpenSnackbar(true);
  } catch (error) {
    alert("作業終了エラー");
  } finally {
  }
}

export async function updateStudy(
  userId: string,
  id: number,
  newData: UpdateStudyType
) {
  try {
    const { data, error } = await supabase
      .from("studies")
      .update(newData)
      .eq("user_id", userId)
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
  } catch (error) {
    alert("Error updating study data");
  } finally {
  }
}

export async function deleteStudies(
  id: number,
  setLatestStudiesData: Dispatch<SetStateAction<StudyDataType[] | null>>
) {
  try {
    const { error } = await supabase.from("studies").delete().eq("id", id);

    if (error) {
      throw error;
    }

    // 削除が成功したら、sleepsList からも該当する id のデータを削除します
    setLatestStudiesData((prevStudiesList) =>
      prevStudiesList!.filter((sl) => sl.id !== id)
    );
  } catch (error) {
    alert("作業削除エラー");
  } finally {
  }
}

export async function readStudiesCount(
  setAllStudiesCount: Dispatch<SetStateAction<number | null>>
) {
  try {
    const { count, error, status } = await supabase
      .from("studies")
      .select("*", { count: "exact", head: true });

    if (error && status !== 406) {
      throw error;
    }

    if (count) {
      setAllStudiesCount(count);
    }
  } catch (error) {
    alert("Error loading user sleeps list!");
  } finally {
  }
}

export async function readRangedStudies(
  rangeStart: number,
  rangeEnd: number,
  setStudiesData: Dispatch<SetStateAction<StudyDataType[] | null>>
) {
  try {
    let { data, error, status } = await supabase
      .from("studies")
      .select("*")
      .order("created_at", { ascending: false })
      .range(rangeStart, rangeEnd) //

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setStudiesData(data);
    }
  } catch (error) {
    alert("Error loading user Studies list!");
  } finally {
  }
}