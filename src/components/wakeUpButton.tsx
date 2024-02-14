"use client";
import { SleepsType, UpdateWakeupType } from "@/consts/database.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { time } from "console";
import { string } from "prop-types";
import { use, useEffect, useState } from "react";

export default function WakeUpButton({
  user,
  isSleeping,
}: {
  user: User | null;
  isSleeping: boolean;
}) {
  const supabase = createClientComponentClient<SleepsType>();
  const [loading, setLoading] = useState<boolean>(false);

  async function updateWakeUp(newData: UpdateWakeupType, userId: string) {
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

  function handleWakeUpClick() {
    const currentDate = new Date().toISOString(); // 現在時刻をISO形式の文字列に変換
    const newData: UpdateWakeupType = {
      update_at: currentDate,
      wake_up_at: currentDate,
    };
    if (user) {
      updateWakeUp(newData, user.id);
    }
  }

  return (
    <>
      <div>
        <button disabled={!isSleeping || loading} onClick={handleWakeUpClick}>
          起床
        </button>
      </div>
    </>
  );
}
