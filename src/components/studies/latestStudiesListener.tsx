"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import StartStudyingButton from "./startStudyingButton";
import FinishStudyingButton from "./finishStudyingButton";
import { readLatestStudying } from "@/hooks/studies";
import { Autocomplete, Button, Grid, Skeleton, TextField } from "@mui/material";
import { CategoryType, OptionsCategoriesType } from "@/consts/categories.types";
import { readCategories } from "@/hooks/categories";
import { StudyDataType } from "@/consts/studies.types";
import { StudiesForm } from "./studiesForm";

//fetcherの作成必要あり？

export const LatestStudiesListener = ({ user }: { user: User | null }) => {
  const [studyingData, setStudyingData] = useState<StudyDataType[] | null>(
    null
  );

  useEffect(() => {
    //サインアップ後のエラーアラート防止でif (user)
    if (user) {
      readLatestStudying(user?.id!, setStudyingData);
    }
  }, []);

  return (
    <>
      {studyingData?.length! > 0 ? (
        <>
          {studyingData!.map((sd) => (
            <StudiesForm key={sd.id} user={user} studyingData={sd} setStudyingData={setStudyingData}/>
          ))}
          <StudiesForm user={user} studyingData={null} setStudyingData={setStudyingData}/>
        </>
      ) : (
        <StudiesForm user={user} studyingData={null} setStudyingData={setStudyingData}/>
      )}
    </>
  );
};
