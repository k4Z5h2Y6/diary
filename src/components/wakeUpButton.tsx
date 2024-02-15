"use client";
import { UpdateWakeupType } from "@/consts/database.types";
import { updateWakeUp } from "@/hooks/sleeps";
import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export default function WakeUpButton({
  user,
  isSleeping,
}: {
  user: User | null;
  isSleeping: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  function handleWakeUpClick() {
    const currentDate = new Date().toISOString(); // 現在時刻をISO形式の文字列に変換
    const newData: UpdateWakeupType = {
      update_at: currentDate,
      wake_up_at: currentDate,
    };
    if (user) {
      updateWakeUp(newData, user.id, setLoading);
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
