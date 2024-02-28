"use client";
import { deleteStudies, readStudiesRow } from "@/hooks/studies";
import {
  User,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export const LatestSudiesRow = ({ user }: { user: User | null }) => {
  const [loading, setLoading] = useState(true);
  const [studiesRow, setStudiesRow] = useState<any[]>([]);

  useEffect(() => {
    readStudiesRow(setLoading, setStudiesRow);
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

  const calculateSleepTime = (sts: string, wts: string) => {
    if (sts && wts) {
      const date1 = new Date(sts);
      const date2 = new Date(wts);
      const differenceMs = date2.getTime() - date1.getTime();
      const hours = Math.floor(differenceMs / (1000 * 60 * 60));
      const minutes = Math.floor(
        (differenceMs % (1000 * 60 * 60)) / (1000 * 60)
      );
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes}`;
    } else {
      return null;
    }
  };

  return (
    <>
      {studiesRow ? (
        <>
          <table border={1}>
            <tbody>
            <tr>
              <th>作成日</th>
              <th>開始</th>
              <th>終了</th>
              <th>勉強時間</th>
              <th>削除</th>
            </tr>
            {studiesRow.map((sr, index) => (
              <tr key={index}>
                <td>{formatDate(sr.created_at)}</td>
                <td>{formatTime(sr.start_studying)}</td>
                <td>{formatTime(sr.finish_studying)}</td>
                <td>{calculateSleepTime(sr.start_studying, sr.finish_studying)}</td>
                <td>
                  <button onClick={() => deleteStudies(sr.id, setLoading, setStudiesRow)}>削除</button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </>
      ) : null}
    </>
  );
};
