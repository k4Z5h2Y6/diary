import {
  SleepDataType,
  SleepsType,
  UpdateSleepType,
  UpdateWakeupType,
} from "@/consts/sleeps.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<SleepsType>();

export async function createSleepOnset(
  user: User | null,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>,
  ) {
  try {
    const { error } = await supabase.from("sleeps").insert({
      user_id: user?.id as string,
    });
    if (error) throw error;
    setIsOpenSnackbar(true)
  } catch (error) {
    alert("入眠エラー");
  } finally {
  }
}

//単数用
export async function readLatestSleep(
  setIsSleeping: Dispatch<SetStateAction<boolean | null>>
) {
  // "sleeps" テーブルから作成日が最新の行を取得するクエリを定義します
  const { data, error } = await supabase
    .from("sleeps")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    console.error("Error fetching data:", error.message);
    return;
  }

  if (data[0].sleep_onset_at !== null && data[0].wake_up_at === null) {
    setIsSleeping(true);
  } else {
    setIsSleeping(false);
  }
}

//複数用
export async function readLatestSleeps(
  setLatestSleepsData: Dispatch<SetStateAction<SleepDataType[] | null>>
) {
  try {
    let { data, error, status } = await supabase
      .from("sleeps")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setLatestSleepsData(data);
    }
  } catch (error) {
    alert("Error loading user sleeps list!");
  } finally {
  }
}

export async function updateSleepWakeUp(
  userId: string,
  newData: UpdateWakeupType,
  setIsOpenSnackbar: Dispatch<SetStateAction<boolean>>,
) {
  try {
    const { data, error } = await supabase
      .from("sleeps")
      .update(newData)
      .eq("user_id", userId)
      .order("created_at", { ascending: false }) // 作成日が最新の行を指定
      .limit(1)
      .single();
    if (error) {
      throw error;
    }
    setIsOpenSnackbar(true)
  } catch (error) {
    alert("起床Error");
  } finally {
  }
}

export async function updateSleep(
  userId: string,
  id: number,
  newData: UpdateSleepType
) {
  try {
    const { data, error } = await supabase
      .from("sleeps")
      .update(newData)
      .eq("user_id", userId)
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
  } catch (error) {
    alert("Error updating sleep data");
  } finally {
    alert("終了");
  }
}

export async function deleteSleeps(
  id: number,
  setLatestSleepsData: Dispatch<SetStateAction<SleepDataType[] | null>>
) {
  try {
    const { error } = await supabase.from("sleeps").delete().eq("id", id);

    if (error) {
      throw error;
    }

    // 削除が成功したら、sleepsList からも該当する id のデータを削除します
    setLatestSleepsData((prevSleepsList) =>
      prevSleepsList!.filter((sl) => sl.id !== id)
    );
  } catch (error) {
    alert("睡眠削除エラー");
  } finally {
    console.log("完了");
  }
}
