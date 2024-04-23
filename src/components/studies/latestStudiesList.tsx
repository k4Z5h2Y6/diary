"use client";
import { deleteStudies, readLatestStudies } from "@/hooks/studies";
import { Button, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import {
  User,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { DatePickerDiary } from "../common/datePickerDiary";
import { StudyDataType } from "@/consts/studies.types";

export const LatestSudiesList = ({ user }: { user: User | null }) => {
  const [latestStudiesData, setLatestStudiesData] = useState<StudyDataType[] | null>([]);

  useEffect(() => {
    readLatestStudies(user?.id!, setLatestStudiesData);
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

  const calculateStudyTime = (ss: string | null, fs: string | null) => {
    if (ss && fs) {
      const date1 = new Date(ss);
      const date2 = new Date(fs);
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
      {latestStudiesData?.length! > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">作成日</TableCell>
                  <TableCell align="center">開始</TableCell>
                  <TableCell align="center">終了</TableCell>
                  <TableCell align="center">作業時間</TableCell>
                  <TableCell align="center">削除</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestStudiesData!.map((lsd) => (
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
                        defaultValue={lsd.start_studying}
                        id={lsd.id}
                        updateColumn={"start_studying"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <DatePickerDiary
                        user={user}
                        defaultValue={lsd.finish_studying}
                        id={lsd.id}
                        updateColumn={"finish_studying"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {calculateStudyTime(lsd.start_studying, lsd.finish_studying)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() =>
                          deleteStudies(user?.id!, lsd.id, setLatestStudiesData)
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
          <Link href="/data/studies">もっと見る</Link>
        </>
      ) : (
        <>まだデータがありません</>
      )}
    </>
  );
};
