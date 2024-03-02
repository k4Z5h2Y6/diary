import { DiariesType } from "@/consts/diaries.types";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<DiariesType>();

export async function createDiary(
  user: User | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
  diaryText: string,
  diaryImgUrl: string | null
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("diaries").insert({
      user_id: user?.id as string,
      diary_text: diaryText,
      diary_img_url: diaryImgUrl,
    });
    if (error) throw error;
    alert("Diary posted!");
  } catch (error) {
    alert("Diary post error");
  } finally {
    setLoading(false);
  }
}

export async function readDiariesList(
  setLoading: Dispatch<SetStateAction<boolean>>,
  setDiariesList: Dispatch<SetStateAction<any[]>>,
) {
  try {
    setLoading(true);
    let { data, error, status } = await supabase
    .from("diaries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      console.log(data);
      setDiariesList(data);
    }
  } catch (error) {
    alert("Error loading user diaries list!");
  } finally {
    setLoading(false);
  }
}

// export async function deleteDiaries(
//   id: string,
//   setLoading: Dispatch<SetStateAction<boolean>>,
//   setDiariesList: Dispatch<SetStateAction<any[]>>,
// ) {
//   try {
//     setLoading(true);
//     const { error } = await supabase.from("diaries").delete().eq("id", id);

//     if (error) {
//       throw error;
//     }

//     // 削除が成功したら、sleepsList からも該当する id のデータを削除します
//     setDiariesList((prevSleepsList) =>
//       prevSleepsList.filter((sl) => sl.id !== id)
//     );
//   } catch (error) {
//     console.error("Error deleting diaries");
//     alert("Error deleting diaries!");
//   } finally {
//     setLoading(false);
//   }
// }