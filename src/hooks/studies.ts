import {
  StudiesType,
  StudyDataType,
  UpdateFinishStudyingType,
  UpdateStudyType,
} from "@/consts/studies.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<StudiesType>();

export async function createStudy(
  userId: string,
  studyCategory: number | null,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>
) {
  try {
    const { error } = await supabase.from("studies").insert({
      user_id: userId,
      study_category: studyCategory,
    });
    if (error) throw error;
    setIsOpenSnackbar(true);
  } catch (error) {
    alert("作業開始エラー");
  } finally {
  }
}

//finish_studyingがnullのstudy配列
// export async function readLatestStudying(
//   userId: string,
//   setIsStudying: Dispatch<SetStateAction<boolean | null>>
// ) {
//   // "studies" テーブルから作成日が最新の行を取得するクエリを定義します
//   try {
//     const { data, error } = await supabase
//       .from("studies")
//       .select("*")
//       .order("created_at", { ascending: false })
//       .eq("user_id", userId)
//       .eq("finish_studying", "null")
//     if (error) throw error;

//     setIsStudying(
//       data[0]?.start_studying !== null && data[0]?.finish_studying === null
//     );
//   } catch (error) {
//     // alert("作業読み込みエラー");
//   } finally {
//   }
// }

// finish_studyingがnullのstudy配列
export async function readLatestStudying(
  userId: string,
  setStudyingData: Dispatch<SetStateAction<StudyDataType[] | null>>
) {
  // "studies" テーブルから作成日が最新の行を取得するクエリを定義します
  try {
    const { data, error } = await supabase
      .from("studies")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", userId)
      .is("finish_studying", null) //nullの場合はis
    if (error) throw error;
    setStudyingData(data)
  } catch (error) {
    alert("作業読み込みエラー");
  } finally {
  }
}

export async function readLatestStudies(
  userId: string,
  setLatestStudiesData: Dispatch<SetStateAction<StudyDataType[] | null>>
) {
  try {
    let { data, error } = await supabase
      .from("studies")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", userId)
      .limit(5);
    if (error) throw error;
    setLatestStudiesData(data);
  } catch (error) {
    alert("作業読み込みエラー");
  } finally {
  }
}

export async function updateFinishStudying(
  userId: string,
  newData: UpdateFinishStudyingType,
  id: number,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>
) {
  try {
    const { error } = await supabase
      .from("studies")
      .update(newData)
      .eq("user_id", userId)
      .eq("id", id)
      .order("created_at", { ascending: false }) // 作成日が最新の行を指定
      .limit(1);
    if (error) throw error;
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
    const { error } = await supabase
      .from("studies")
      .update(newData)
      .eq("user_id", userId)
      .eq("id", id)
    if (error) throw error;
  } catch (error) {
    alert("作業更新エラー");
  } finally {
  }
}

export async function deleteStudies(
  userId: string,
  id: number,
  setLatestStudiesData: Dispatch<SetStateAction<StudyDataType[] | null>>
) {
  try {
    const { error } = await supabase
      .from("studies")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);

    if (error) throw error;

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
  userId: string,
  setAllStudiesCount: Dispatch<SetStateAction<number | null>>
) {
  try {
    const { count, error, status } = await supabase
      .from("studies")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) throw error;

    if (count) {
      setAllStudiesCount(count);
    }
  } catch (error) {
    alert("作業総数読み込みエラー");
  } finally {
  }
}

export async function readRangedStudies(
  userId: string,
  rangeStart: number,
  rangeEnd: number,
  setStudiesData: Dispatch<SetStateAction<StudyDataType[] | null>>
) {
  try {
    let { data, error } = await supabase
      .from("studies")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(rangeStart, rangeEnd); //

    if (error) throw error;

    if (data) {
      setStudiesData(data);
    }
  } catch (error) {
    alert("作業読み込みエラー");
  } finally {
  }
}
