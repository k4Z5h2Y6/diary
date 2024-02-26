"use client";

import { UpdateWakeupType } from "@/consts/sleeps.types";
import { updateWakeUp } from "@/hooks/sleeps";
import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import styles from "./sleeps.module.css";

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
      updateWakeUp(user.id, setLoading, newData);
    }
  }

  return (
    <>
      <div className={styles.buttonO}>
        <button disabled={!isSleeping || loading} onClick={handleWakeUpClick}>
          　起床　
        </button>
      </div>
    </>
  );
}
