"use client";
import { deleteSleeps, readSleepsRow } from "@/hooks/sleeps";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { SetStateAction, useEffect, useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { DatePickerDiary } from "../common/datepickerDiary";

export const LatestSleepsRow = ({ user }: { user: User | null }) => {
  const [loading, setLoading] = useState(true);
  const [sleepsRow, setSleepsRow] = useState<any[]>([]);

  useEffect(() => {
    readSleepsRow(setLoading, setSleepsRow);
  }, []);

  const formatDate = (ts: string) => {
    const date = new Date(ts);
    const jpDate = new Date(
      date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    );
    const month = (jpDate.getMonth() + 1).toString().padStart(2, "0");
    const day = jpDate.getDate().toString().padStart(2, "0");
    return `${month}/${day}`;
    // const date = new Date(ts);
    // return date;
  };

  const formatTime = (ts: string) => {
    if (ts) {
      const date = new Date(ts);
      const jpHours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
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
      {sleepsRow ? (
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
                {sleepsRow.map((sr) => (
                  <TableRow
                    key={sr.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      <DatePickerDiary
                        user={user}
                        defaultValue={dayjs(sr.created_at!)}
                        // defaultValue={formatDate(sr.created_at!)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {formatTime(sr.sleep_onset_at)}
                    </TableCell>
                    <TableCell align="center">
                      {formatTime(sr.wake_up_at)}
                    </TableCell>
                    <TableCell align="center">
                      {calculateSleepTime(sr.sleep_onset_at, sr.wake_up_at)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() =>
                          deleteSleeps(sr.id, setLoading, setSleepsRow)
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
