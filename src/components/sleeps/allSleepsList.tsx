"use client";

import { SleepDataType } from "@/consts/sleeps.types";
import {
  deleteSleeps,
  readRangedSleeps,
  readSleepsCount,
} from "@/hooks/sleeps";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { DatePickerDiary } from "../common/datePickerDiary";
import { PaginationDiary } from "../common/pagenationDiary";

const parPage = 5;

export const AllSleepsList = ({ user }: { user: User | null }) => {
  const [sleepsData, setSleepsData] = useState<SleepDataType[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rangeStart, setRangeStart] = useState<number>(0);
  const [allSleepsCount, setAllSleepsCount] = useState<number | null>(null);
  const pageCount = (allSleepsCount: number | null, parPage: number) => {
    if (allSleepsCount! % parPage === 0) {
      return allSleepsCount! / parPage;
    } else {
      return Math.floor(allSleepsCount! / parPage) + 1;
    }
  };

  useEffect(() => {
    readSleepsCount(user?.id!, setAllSleepsCount);
    readRangedSleeps(user?.id!, 0, parPage - 1, setSleepsData);
  }, []);

  useEffect(() => {
    if (currentPage === 1) {
      setRangeStart(0);
    } else {
      setRangeStart(parPage * (currentPage - 1)); // currentPageが1の場合、rangeStartは0
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 1) {
      readRangedSleeps(user?.id!, 0, parPage - 1, setSleepsData);
    } else {
      readRangedSleeps(user?.id!, rangeStart, rangeStart + parPage - 1, setSleepsData);
    }
  }, [rangeStart]);

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
      {sleepsData ? (
        <>
          <Typography>全{allSleepsCount}件のデータ</Typography>
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
                {sleepsData.map((sd) => (
                  <TableRow
                    key={sd.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      {formatDate(sd.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      <DatePickerDiary
                        user={user}
                        defaultValue={sd.sleep_onset_at}
                        id={sd.id}
                        updateColumn={"sleep_onset_at"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <DatePickerDiary
                        user={user}
                        defaultValue={sd.wake_up_at}
                        id={sd.id}
                        updateColumn={"wake_up_at"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {calculateSleepTime(sd.sleep_onset_at, sd.wake_up_at)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => deleteSleeps(user?.id!, sd.id, setSleepsData)}
                      >
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <PaginationDiary
            pageCount={pageCount(allSleepsCount, parPage)}
            setCurrentPage={setCurrentPage}
          />
        </>
      ) : null}
    </>
  );
};
