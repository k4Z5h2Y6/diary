// "use client";

// import { deleteDiaries, readDiariesList } from "@/hooks/diaries";
// import {
//   User,
// } from "@supabase/auth-helpers-nextjs";
// import { useEffect, useState } from "react";

// export const DiariesList = ({ user }: { user: User | null }) => {
//   const [loading, setLoading] = useState(true);
//   const [diariesList, setDiariesList] = useState<any[]>([]);

//   useEffect(() => {
//     readDiariesList(setLoading, setDiariesList);
//   }, []);

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

//   return (
//     <>
//       {diariesList ? (
//         <>
//           <table border={1}>
//             <tbody>
//             <tr>
//               <th>日付</th>
//               <th>時間</th>
//               <th>内容</th>
//               <th>削除</th>
//             </tr>
//             {diariesList.map((dl, index) => (
//               <tr key={index}>
//                 <td>{formatDate(dl.created_at)}</td>
//                 <td>{formatTime(dl.created_at)}</td>
//                 <td>{dl.diary}</td>
//                 <td>
//                   <button onClick={() => deleteDiaries(dl.id, setLoading, setDiariesList)}>削除</button>
//                 </td>
//               </tr>
//             ))}
//             </tbody>
//           </table>
//         </>
//       ) : null}
//     </>
//   );
// };
