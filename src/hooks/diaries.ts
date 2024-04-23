import {
  DiariesType,
  DiaryDataType,
  UpdateDiaryType,
} from "@/consts/diaries.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<DiariesType>();

export async function createDiary(
  userId: string,
  diaryText: string,
  diaryCategory: number | null,
  diaryImgUrls: string[] | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>> //todo
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("diaries").insert({
      user_id: userId,
      diary_text: diaryText,
      diary_img_url: diaryImgUrls,
      diary_category: diaryCategory,
    });
    if (error) throw error;
    alert("投稿完了");
  } catch (error) {
    alert("投稿エラー");
  } finally {
    setLoading(false);
  }
}

//詳細ページ用
export async function readDiary(
  userId: string,
  id: number,
  setDiaryData: Dispatch<SetStateAction<DiaryDataType[] | null>>
) {
  try {
    const { data, error, status } = await supabase
      .from("diaries")
      .select("*")
      .eq("user_id", userId)
      .eq("id", id)
      .limit(1);
    if (error) throw error;
    setDiaryData(data);
  } catch (error) {
    alert("記録読み込みエラー");
  } finally {
  }
}

export async function readLatestDiaries(
  userId: string,
  setLatestDiariesList: Dispatch<SetStateAction<DiaryDataType[] | null>>
) {
  try {
    let { data, error } = await supabase
      .from("diaries")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", userId)
      .limit(5);

    if (error) throw error;
    setLatestDiariesList(data);
  } catch (error) {
    alert("記録読み込みエラー");
  } finally {
  }
}

export async function readDiariesCount(
  userId: string,
  setAllDiariesCount: Dispatch<SetStateAction<number | null>>
) {
  try {
    const { count, error, status } = await supabase
      .from("diaries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) throw error;

    if (count) {
      setAllDiariesCount(count);
    }
  } catch (error) {
    alert("Error loading user Diaries list!");
  } finally {
  }
}

export async function readRangedDiaries(
  userId: string,
  rangeStart: number,
  rangeEnd: number,
  setDiariesData: Dispatch<SetStateAction<DiaryDataType[] | null>>
) {
  try {
    let { data, error, status } = await supabase
      .from("diaries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(rangeStart, rangeEnd); //

    if (error) throw error;

    if (data) {
      setDiariesData(data);
    }
  } catch (error) {
    alert("Error loading user Diaries list!");
  } finally {
  }
}

export async function updateDiary(
  userId: string,
  id: number,
  newData: UpdateDiaryType,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>
) {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from("diaries")
      .update(newData)
      .eq("user_id", userId)
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
    setIsOpenSnackbar(true);
  } catch (error) {
    alert("記録更新エラー");
  } finally {
    setLoading(false);
  }
}

//todo user関係
export async function deleteDiaryImg(
  diaryImgUrl: string[],
  callback: () => void
) {
  try {
    const { error: uploadError } = await supabase.storage
      .from("diary_img")
      .remove(diaryImgUrl);

    if (uploadError) {
      throw uploadError;
    }
    alert("写真削除完了");
    callback();
  } catch (error) {
    alert("Error delete diary_img!");
  } finally {
  }
}


export async function deleteDiaries(
  userId: string,
  id: number,
  setLatestDiariesData: Dispatch<SetStateAction<DiaryDataType[] | null>>
) {
  try {
    const { error } = await supabase
      .from("diaries")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);

    if (error) throw error;

    // 削除が成功したら、DiariesList からも該当する id のデータを削除します
    setLatestDiariesData((prevDiariesList) =>
      prevDiariesList!.filter((dl) => dl.id !== id)
    );
    alert("記録削除完了");
  } catch (error) {
    alert("記録削除エラー");
  } finally {
  }
}

export async function uploadDiaryImgs(
  user: User | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
  diaryImgUrls: string[] | null,
  diaryImgFiles: File[] | null
) {
  try {
    setLoading(true);
    if (
      !diaryImgUrls ||
      !diaryImgFiles ||
      diaryImgUrls.length !== diaryImgFiles.length
    ) {
      throw new Error("You must provide matching image URLs and files.");
    }
    const uploadPromises = diaryImgUrls.map(async (diaryImgUrl, index) => {
      const diaryImgFile = diaryImgFiles[index];
      const { error: uploadError } = await supabase.storage
        .from("diary_img")
        .upload(diaryImgUrl, diaryImgFile);

      if (uploadError) {
        throw uploadError;
      }
    });

    await Promise.all(uploadPromises);
  } catch (error) {
    alert("Error uploading diary_img!");
  } finally {
    setLoading(false);
  }
}
