"use client";
import { deleteSleeps, readSleepsList } from "@/hooks/sleeps";
import {
  User,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export const SleepsList = ({ user }: { user: User | null }) => {
  const [loading, setLoading] = useState(true);
  const [sleepsList, setSleepsList] = useState<any[]>([]);

  useEffect(() => {
    readSleepsList(setLoading, setSleepsList);
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
      {sleepsList ? (
        <>
          <table border={1}>
            <tbody>
            <tr>
              <th>日付</th>
              <th>入眠</th>
              <th>起床</th>
              <th>睡眠時間</th>
              <th>削除</th>
            </tr>
            {sleepsList.map((sl, index) => (
              <tr key={index}>
                <td>{formatDate(sl.sleep_onset_at)}</td>
                <td>{formatTime(sl.sleep_onset_at)}</td>
                <td>{formatTime(sl.wake_up_at)}</td>
                <td>{calculateSleepTime(sl.sleep_onset_at, sl.wake_up_at)}</td>
                <td>
                  <button onClick={() => deleteSleeps(sl.id, setLoading, setSleepsList)}>削除</button>
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
