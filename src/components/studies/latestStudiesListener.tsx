"use client";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { readLatestSleep } from "@/hooks/sleeps";
import styles from "./studies.module.css";
import StartStudyingButton from "./startStudyingButton";
import FinishStudyingButton from "./finishStudyingButton";
import { readLatestStudy } from "@/hooks/studies";
import { StudiesType } from "@/consts/studies.types";

export const LatestStudiesListener = ({ user }: { user: User | null }) => {
  const supabase = createClientComponentClient<StudiesType>();
  const [isStudying, setIsStudying] = useState<boolean>(false);

  useEffect(() => {
    // Realtimeクライアントを使用してsleepsテーブルを監視
    const subscription = supabase
      .channel("studies")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "studies",
        },
        (payload) => {
          // 変更後のデータに対しての処理を記載
          readLatestStudy(setIsStudying);
        }
      )
      .subscribe();

    // コンポーネントがアンマウントされたときにサブスクリプションを解除
    return () => {
      subscription.unsubscribe();
    };
  }, []); // 最初のマウント時にのみ実行

  useEffect(() => {
    readLatestStudy(setIsStudying);
  }, []);

  return (
    <>
      <div className={styles.studiesO}>
        <div className={styles.studiesI}>
          <div>
            <StartStudyingButton user={user} isStudying={isStudying} />
          </div>
          <div>
            <FinishStudyingButton user={user} isStudying={isStudying} />
          </div>
        </div>
      </div>
    </>
  );
};
