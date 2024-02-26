"use client";
import { createSleepOnset } from "@/hooks/sleeps";
import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import styles from "./sleeps.module.css";

export default function SleepOnsetButton({
  user,
  isSleeping,
} : {
  user: User | null
  isSleeping: boolean
}) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <div className={styles.buttonO}>
        <button
          disabled={isSleeping}
          onClick={() => createSleepOnset(user, setLoading)}
        >
          　入眠　
        </button>
      </div>
    </>
  );
}
