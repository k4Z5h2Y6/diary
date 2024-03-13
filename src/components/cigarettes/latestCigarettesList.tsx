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
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { DatePickerDiary } from "../common/datePickerDiary";
import { CigaretteDataType } from "@/consts/cigarettes.types";
import { deleteCigarettes, readLatestCigarettes } from "@/hooks/cigarettes";

export const LatestCigarettesList = ({ user }: { user: User | null }) => {
  const [latestCigaretteData, setLatestCigaretteData] =
    useState<CigaretteDataType[] | null>([]);

  useEffect(() => {
    readLatestCigarettes(setLatestCigaretteData);
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

  return (
    <>
      {latestCigaretteData ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">作成日</TableCell>
                  <TableCell align="center">喫煙本数</TableCell>
                  <TableCell align="center">削除</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestCigaretteData.map((lcd) => (
                  <TableRow
                    key={lcd.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      {formatDate(lcd.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      {lcd.cigarettes_counter}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() =>
                          deleteCigarettes(lcd.id, setLatestCigaretteData)
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
