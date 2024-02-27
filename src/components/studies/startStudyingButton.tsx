"use client";
import { User } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import styles from "./studies.module.css";
import { createStudy } from "@/hooks/studies";

export default function StartStudyingButton({
  user,
  isStudying,
} : {
  user: User | null
  isStudying: boolean
}) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <div className={styles.buttonO}>
        <button
          disabled={isStudying}
          onClick={() => createStudy(user, setLoading)}
        >
          　勉強開始　
        </button>
      </div>
    </>
  );
}