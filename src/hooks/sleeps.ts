import {
  SleepDataType,
  SleepsType,
  UpdateSleepType,
  UpdateWakeupType,
} from "@/consts/sleeps.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<SleepsType>();

export async function createSleepOnset(
  userId: string,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>
) {
  try {
    const { error } = await supabase.from("sleeps").insert({
      user_id: userId,
    });
    if (error) throw error;
    setIsOpenSnackbar(true);
  } catch (error) {
    alert("入眠エラー");
  } finally {
  }
}

//単数用
export async function readLatestSleep(
  userId: string,
  setIsSleeping: Dispatch<SetStateAction<boolean | null>>
) {
  // "sleeps" テーブルから作成日が最新の行を取得するクエリを定義します
  try {
    const { data, error } = await supabase
      .from("sleeps")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", userId)
      .limit(1);
    if (error) throw error;
    setIsSleeping(
      data[0]?.sleep_onset_at !== null && data[0]?.wake_up_at === null
    );
  } catch (error) {
    alert("睡眠読み込みエラー");
  } finally {
  }
}

//複数用
export async function readLatestSleeps(
  userId: string,
  setLatestSleepsData: Dispatch<SetStateAction<SleepDataType[] | null>>
) {
  try {
    let { data, error } = await supabase
      .from("sleeps")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", userId)
      .limit(5);
    if (error) throw error;
    setLatestSleepsData(data);
  } catch (error) {
    alert("睡眠読み込みエラー");
  } finally {
  }
}

export async function updateSleepWakeUp(
  userId: string,
  newData: UpdateWakeupType,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>
) {
  try {
    const { data, error } = await supabase
      .from("sleeps")
      .update(newData)
      .eq("user_id", userId)
      .order("created_at", { ascending: false }) // 作成日が最新の行を指定
      .limit(1);
    if (error) throw error;
    setIsOpenSnackbar(true);
  } catch (error) {
    alert("起床エラー");
  } finally {
  }
}

export async function updateSleep(
  userId: string,
  id: number,
  newData: UpdateSleepType
) {
  try {
    const { error } = await supabase
      .from("sleeps")
      .update(newData)
      .eq("user_id", userId)
      .eq("id", id);
    if (error) throw error;
  } catch (error) {
    alert("睡眠更新エラー");
  } finally {
  }
}

export async function deleteSleeps(
  userId: string,
  id: number,
  setLatestSleepsData: Dispatch<SetStateAction<SleepDataType[] | null>>
) {
  try {
    const { error } = await supabase
      .from("sleeps")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);

    if (error) throw error;

    // 削除が成功したら、sleepsList からも該当する id のデータを削除します
    setLatestSleepsData((prevSleepsList) =>
      prevSleepsList!.filter((sl) => sl.id !== id)
    );
  } catch (error) {
    alert("睡眠削除エラー");
  } finally {
  }
}

export async function readSleepsCount(
  userId: string,
  setAllSleepsCount: Dispatch<SetStateAction<number | null>>
) {
  try {
    const { count, error } = await supabase
      .from("sleeps")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) throw error;

    if (count) {
      setAllSleepsCount(count);
    }
  } catch (error) {
    alert("睡眠総数読み込みエラー");
  } finally {
  }
}

export async function readRangedSleeps(
  userId: string,
  rangeStart: number,
  rangeEnd: number,
  setSleepsData: Dispatch<SetStateAction<SleepDataType[] | null>>
) {
  try {
    let { data, error } = await supabase
      .from("sleeps")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(rangeStart, rangeEnd); //

    if (error) throw error;

    if (data) {
      setSleepsData(data);
    }
  } catch (error) {
    alert("睡眠読み込みエラー");
  } finally {
  }
}
