// "use client";

// import { Box, Button, Card, Typography } from "@mui/material";
// import PreviewImg from "./previewImg";
// import { DiaryDataType } from "@/consts/diaries.types";
// import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { deleteDiaries } from "@/hooks/diaries";

// export const DiariesCard = ({
//   ldd,
//   setLatestDiariesData,
// }: { 
//   ldd: DiaryDataType,
//   setLatestDiariesData: Dispatch<SetStateAction<DiaryDataType[] | null>>
// }) => {
  
//   const [diary_img_url, set_diary_img_url] = useState(ldd.diary_img_url)
//   const formatDate = (ts: string) => {
//     const date = new Date(ts);
//     const jpDate = new Date(
//       date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
//     );
//     const month = (jpDate.getMonth() + 1).toString().padStart(2, "0");
//     const day = jpDate.getDate().toString().padStart(2, "0");
//     return `${month}/${day}`;
//   };

//   const formatTime = (ts: string) => {
//     if (ts) {
//       const date = new Date(ts);
//       const jpOffset = 9; // Japan's timezone offset from UTC in hours
//       const jpHours = (date.getUTCHours() + jpOffset)
//         .toString()
//         .padStart(2, "0");
//       const minutes = date.getUTCMinutes().toString().padStart(2, "0");
//       return `${jpHours}:${minutes}`;
//     } else {
//       return null;
//     }
//   };

//   const formatCategory = (n: number) => {
//     switch (n) {
//       case 1:
//         return "禁煙日記";
//       case 2:
//         return "pombio";
//       default:
//         return "カテゴリーなし";
//     }
//   };

//   return (
//     <>
//       <Card
//         key={ldd.id}
//         sx={{
//           minWidth: 275,
//           marginBottom: "16px",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Box width={100} height={100}>
//           {/* {ldd.diary_img_url ? <PreviewImg user={user} url={latestDiariesData[index].diary_img_url} /> : <></>} */}
//           <PreviewImg url={diary_img_url} />
//         </Box>
//         <Box>
//           <Typography>
//             {formatDate(ldd.created_at!)} {formatTime(ldd.created_at!)}
//           </Typography>
//           <Typography>{ldd.diary_text}</Typography>
//           <Typography>{formatCategory(ldd.diary_category!)}</Typography>
//           <Button onClick={() => deleteDiaries(ldd.id, setLatestDiariesData)}>
//             削除
//           </Button>
//         </Box>
//       </Card>
//     </>
//   );
// };
