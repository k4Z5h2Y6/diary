import { DiariesType, DiaryDataType } from "@/consts/diaries.types";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<DiariesType>();

export async function uploadDiaryImg(
  user: User | null,
  diaryImgUrl: string | null,
  diaryImgFile: File | null,
  callback: () => void
) {
  try {
    if (diaryImgUrl === null || diaryImgFile === null ) {
      throw new Error('You must select an image to upload.')
    }
    const { error: uploadError } = await supabase.storage.from('diary_img').upload(diaryImgUrl, diaryImgFile)

    if (uploadError) {
      throw uploadError
    }
    alert("画像アップロード完了")
    callback();
  } catch (error) {
    alert('Error uploading diary_img!')
  } finally {
  }
}

export async function deleteDiaryImg(
  user: User | null,
  diaryImgUrl: string,
  callback: () => void
) {
  try {
    const { error: uploadError } = await supabase.storage.from('diary_img').remove([diaryImgUrl])

    if (uploadError) {
      throw uploadError
    }
    alert('写真削除完了')
    callback();
  } catch (error) {
    alert('Error delete diary_img!')
  } finally {
  }
}

export async function createDiary(
  user: User | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
  diaryText: string,
  diaryImgUrl: string | null,
  diaryCategory: number | null,
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("diaries").insert({
      user_id: user?.id as string,
      diary_text: diaryText,
      diary_img_url: diaryImgUrl,
      diary_category: diaryCategory,
    });
    if (error) throw error;
  } catch (error) {
    alert("投稿エラー");
  } finally {
    setLoading(false);
    alert("投稿完了")
  }
}

export async function readLatestDiaries(
  setLatestDiariesList: Dispatch<SetStateAction<DiaryDataType[] | null>>,
) {
  try {
    let { data, error, status } = await supabase
    .from("diaries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(7);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setLatestDiariesList(data);
    }
  } catch (error) {
    alert("記録読み込みエラー");
  } finally {
  }
}

export async function deleteDiaries(
  id: number,
  setLatestDiariesData: Dispatch<SetStateAction<DiaryDataType[] | null>>
) {
  try {
    const { error } = await supabase.from("diaries").delete().eq("id", id);

    if (error) {
      throw error;
    }

    // 削除が成功したら、sleepsList からも該当する id のデータを削除します
    setLatestDiariesData((prevDiariesList) =>
      prevDiariesList!.filter((dl) => dl.id !== id)
    );
    alert("記録削除完了");
  } catch (error) {
    alert("記録削除エラー");
  } finally {
  }
}