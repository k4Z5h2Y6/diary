"use client";

import { createDiary } from "@/hooks/diaries";
import { User } from "@supabase/auth-helpers-nextjs";
import { useRef, useState } from "react";
import styles from "./diaries.module.css";
import ImgUplader from "./imgUploader";

export default function DiariesForm({ user }: { user: User | null }) {
  const [loading, setLoading] = useState<boolean>(false);
  const diaryTextRef = useRef<HTMLTextAreaElement>(null);
  const [diaryImgUrl, setDiaryImgUrl] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // フォームのデフォルトの動作をキャンセル

    // textarea の値を取得する
    const diaryText = diaryTextRef.current?.value || "";

    if (diaryText === "" && diaryImgUrl === null) {
      alert("コンテンツがありません");
    } else {
      createDiary(user, setLoading, diaryText, diaryImgUrl);
    }

    // フォームを送信した後、textarea をクリアする
    if (diaryTextRef.current) {
      diaryTextRef.current.value = "";
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.textareaO}>
          <textarea
            name="diaryText"
            id=""
            ref={diaryTextRef}
            cols={50}
            rows={15}
          />
          <ImgUplader
            uid={user!.id}
            size={150}
            onUpload={(url) => {
              setDiaryImgUrl(url);
            }}
          />
          <input type="submit" value="投稿" />
        </div>
      </form>
    </>
  );
}
