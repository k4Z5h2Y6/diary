"use client";

import { CigaretteDataType } from "@/consts/cigarettes.types";
import { useEffect, useState } from "react";
import { readLatestCigarette } from "@/hooks/cigarettes";
import { Typography } from "@mui/material";

export const CigaretteCounter = () => {
  const [loading, setLoading] = useState<boolean>(false); //todo
  const [latestCigaretteData, setLatestCigaretteData] =
    useState<CigaretteDataType | null>(null);

  useEffect(() => {
    readLatestCigarette(setLoading, setLatestCigaretteData);
  }, []);

  return (
    <>
      <Typography sx={{ textAlign: "center" }}>
        今日の喫煙本数は{latestCigaretteData?.cigarettes_counter}本
      </Typography>
    </>
  );
};
