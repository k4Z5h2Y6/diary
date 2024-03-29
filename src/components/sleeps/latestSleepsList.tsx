"use client";
import { SleepDataType } from "@/consts/sleeps.types";
import { deleteSleeps, readLatestSleeps } from "@/hooks/sleeps";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { DatePickerDiary } from "../common/datePickerDiary";

export const LatestSleepsList = ({ user }: { user: User | null }) => {
  const [latestSleepsData, setLatestSleepsData] = useState<SleepDataType[] | null>([]);

  useEffect(() => {
    readLatestSleeps(setLatestSleepsData);
  }, []);

  const formatDate = (ts: string | null) => {
    if (ts) {
      const date = new Date(ts);
      const jpDate = new Date(
        date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
      );
      const month = (jpDate.getMonth() + 1).toString().padStart(2, "0");
      const day = jpDate.getDate().toString().padStart(2, "0");
      return `${month}/${day}`;
    } else {
      return null;
    }
  };

  const calculateSleepTime = (sts: string | null, wts: string | null) => {
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
      {latestSleepsData ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">作成日</TableCell>
                  <TableCell align="center">入眠</TableCell>
                  <TableCell align="center">起床</TableCell>
                  <TableCell align="center">睡眠時間</TableCell>
                  <TableCell align="center">削除</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestSleepsData.map((lsd) => (
                  <TableRow
                    key={lsd.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      {formatDate(lsd.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      <DatePickerDiary
                        user={user}
                        defaultValue={lsd.sleep_onset_at}
                        id={lsd.id}
                        updateColumn={"sleep_onset_at"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <DatePickerDiary
                        user={user}
                        defaultValue={lsd.wake_up_at}
                        id={lsd.id}
                        updateColumn={"wake_up_at"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {calculateSleepTime(lsd.sleep_onset_at, lsd.wake_up_at)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() =>
                          deleteSleeps(lsd.id, setLatestSleepsData)
                        }
                      >
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : null}
    </>
  );
};
