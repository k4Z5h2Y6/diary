"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DiaryForm from "./diaryForm";
import { readDiary } from "@/hooks/diaries";
import { DiaryDataType } from "@/consts/diaries.types";

export default function DiaryFetcher({ user }: { user: User | null }) {
  const params = useParams();
  const [diaryData, setDiaryData] = useState<DiaryDataType[] | null>(null);

  useEffect(() => {
    if (params.id) {
      readDiary(user?.id!, Number(params.id), setDiaryData);
    }
  }, []);

  return (
    <>
      <DiaryForm user={user} diaryData={diaryData} />
    </>
  );
}
