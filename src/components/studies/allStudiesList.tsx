"use client";

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
import { StudyDataType } from "@/consts/studies.types";
import { deleteStudies, readRangedStudies, readStudiesCount } from "@/hooks/studies";

const parPage = 20;

export const AllStudiesList = ({ user }: { user: User | null }) => {
  const [studiesData, setStudiesData] = useState<StudyDataType[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rangeStart, setRangeStart] = useState<number>(0);
  const [allStudiesCount, setAllStudiesCount] = useState<number | null>(null);
  const pageCount = (allStudiesCount: number | null, parPage: number) => {
    if (allStudiesCount! % parPage === 0) {
      return allStudiesCount! / parPage;
    } else {
      return Math.floor(allStudiesCount! / parPage) + 1;
    }
  };

  useEffect(() => {
    readStudiesCount(user?.id!, setAllStudiesCount);
    readRangedStudies(user?.id!, 0, parPage - 1, setStudiesData);
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
      readRangedStudies(user?.id!, 0, parPage - 1, setStudiesData);
    } else {
      readRangedStudies(user?.id!, rangeStart, rangeStart + parPage - 1, setStudiesData);
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

  const calculateStudyTime = (sts: string | null, wts: string | null) => {
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
      {studiesData ? (
        <>
          <Typography>全{allStudiesCount}件のデータ</Typography>
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
                {studiesData.map((sd) => (
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
                        defaultValue={sd.start_studying}
                        id={sd.id}
                        updateColumn={"start_studying"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <DatePickerDiary
                        user={user}
                        defaultValue={sd.finish_studying}
                        id={sd.id}
                        updateColumn={"finish_studying"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {calculateStudyTime(sd.start_studying, sd.finish_studying)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => deleteStudies(user?.id!, sd.id, setStudiesData)}
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
            pageCount={pageCount(allStudiesCount, parPage)}
            setCurrentPage={setCurrentPage}
          />
        </>
      ) : (
        <>まだデータがありません</>
      )}
    </>
  );
};
