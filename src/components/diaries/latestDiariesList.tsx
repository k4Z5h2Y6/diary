"use client";

import { DiariesType, DiaryDataType } from "@/consts/diaries.types";
import { deleteDiaries, readLatestDiaries } from "@/hooks/diaries";
import Image from "next/image";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import PreviewImg from "./previewImg";

export const LatestDiariesList = ({ user }: { user: User | null }) => {
  const [latestDiariesData, setLatestDiariesData] = useState<
    DiaryDataType[] | null
  >(null);
  const [diaryImgUrl, setDiaryImgUrl] = useState<string | null>(null);

  useEffect(() => {
    readLatestDiaries(setLatestDiariesData);
  }, []);

  const formatDate = (ts: string) => {
    const date = new Date(ts);
    const jpDate = new Date(
      date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    );
    const month = (jpDate.getMonth() + 1).toString().padStart(2, "0");
    const day = jpDate.getDate().toString().padStart(2, "0");
    return `${month}/${day}`;
  };

  const formatTime = (ts: string) => {
    if (ts) {
      const date = new Date(ts);
      const jpOffset = 9; // Japan's timezone offset from UTC in hours
      const jpHours = (date.getUTCHours() + jpOffset)
        .toString()
        .padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      return `${jpHours}:${minutes}`;
    } else {
      return null;
    }
  };

  const formatCategory = (n: number) => {
    switch (n) {
      case 1:
        return "禁煙日記";
      case 2:
        return "pombio";
      default:
        return "カテゴリーなし";
    }
  };

  return (
    <>
      {latestDiariesData ? (
        <>
          {latestDiariesData.map((ldd) => (
            <Card
              key={ldd.id}
              sx={{
                minWidth: 275,
                marginBottom: "16px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box width={100} height={100}>
                {/* {ldd.diary_img_url ? (
                  <PreviewImg url={ldd.diary_img_url} />
                ) : (
                  <></>
                )} */}
                <PreviewImg
                user={user!}
                  url={ldd.diary_img_url}
                  // url={diaryImgUrl}
                />
              </Box>
              <Box>
                <Typography>
                  {formatDate(ldd.created_at!)} {formatTime(ldd.created_at!)}
                </Typography>
                <Typography>{ldd.diary_text}</Typography>
                <Typography>{formatCategory(ldd.diary_category!)}</Typography>
                <Button
                  onClick={() => deleteDiaries(ldd.id, setLatestDiariesData)}
                >
                  削除
                </Button>
              </Box>
            </Card>
          ))}
        </>
      ) : null}
    </>
  );
};

// "use client";

// import {  DiaryDataType } from "@/consts/diaries.types";
// import { readLatestDiaries } from "@/hooks/diaries";
// import { User } from "@supabase/auth-helpers-nextjs";
// import { useEffect, useState } from "react";
// import PreviewImg from "./previewImg";
// import { DiariesCard } from "./diariesCard";

// export const LatestDiariesList = ({ user }: { user: User | null }) => {
//   const [latestDiariesData, setLatestDiariesData] = useState<
//     DiaryDataType[] | null
//   >(null);

//   useEffect(() => {
//     readLatestDiaries(setLatestDiariesData);
//   }, []);

//   return (
//     <>
//       {latestDiariesData ? (
//         <>
//           {latestDiariesData.map((ldd) => (
//             <DiariesCard key={ldd.id} ldd={ldd} setLatestDiariesData={setLatestDiariesData}/>
//           ))}
//         </>
//       ) : null}
//     </>
//   );
// };
