import { SleepDataType, SleepsType, UpdateSleepType, UpdateWakeupType } from "@/consts/sleeps.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

const supabase = createClientComponentClient<SleepsType>();

export async function createSleepOnset(
  user: User | null,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  try {
    setLoading(true);
    const { error } = await supabase.from("sleeps").insert({
      user_id: user?.id as string,
    });
    if (error) throw error;
    alert("Sleep Onset Created!");
  } catch (error) {
    alert("Error");
  } finally {
    setLoading(false);
  }
}

//home,単数用
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

//data,複数用
export async function readLatestSleeps(
  setLatestSleepsData: Dispatch<SetStateAction<SleepDataType[]>>
) {
  try {
    let { data, error, status } = await supabase
      .from("sleeps")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(7);
    
    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setLatestSleepsData(data);
    }
  } catch (error) {
    alert("Error loading user sleeps list!");
  } finally {
    console.log("読み込み完了")
  }
}

export async function updateSleepWakeUp(
  userId: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  newData: UpdateWakeupType
) {
  try {
    setLoading(true);
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
    console.log("Updated sleep data:", data);
  } catch (error) {
    console.error("Error updating sleep data:");
    alert("Error updating sleep data");
  } finally {
    setLoading(false);
  }
}

export async function updateSleep(
  userId: string,
  id: number,
  newData: UpdateSleepType,
) {
  try {
    const { data, error } = await supabase
      .from("sleeps")
      .update(newData)
      .eq("user_id", userId)
      .eq('id', id)
      .single();
    if (error) {
      throw error;
    }
    console.log("Updated sleep data:", data);
  } catch (error) {
    console.error("Error updating sleep data:");
    alert("Error updating sleep data");
  } finally {
    alert("更新完了");
  }
}

export async function deleteSleeps(
  id: number,
  setLatestSleepsData: Dispatch<SetStateAction<SleepDataType[]>>
) {
  try {
    const { error } = await supabase.from("sleeps").delete().eq("id", id);

    if (error) {
      throw error;
    }

    // 削除が成功したら、sleepsList からも該当する id のデータを削除します
    setLatestSleepsData((prevSleepsList) =>
      prevSleepsList.filter((sl) => sl.id !== id)
    );
  } catch (error) {
    console.error("Error deleting sleep:");
    alert("Error deleting sleep!");
  } finally {
    console.error("finish delete");
  }
}

export async function readSleepsRow(
  setLoading: Dispatch<SetStateAction<boolean>>,
  setSleepsRow: Dispatch<SetStateAction<any[]>>
) {
  try {
    setLoading(true);
    let { data, error, status } = await supabase
      .from("sleeps")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setSleepsRow(data);
    }
  } catch (error) {
    alert("Error loading user sleeps list!");
  } finally {
    setLoading(false);
  }
}
