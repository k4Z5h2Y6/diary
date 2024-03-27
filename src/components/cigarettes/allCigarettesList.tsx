"use client";

import {
  Button,
  Grid,
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
import { PaginationDiary } from "../common/pagenationDiary";
import CountDownButton from "./countDownButton";
import CountUpButton from "./countUpButton";
import { useRouter } from "next/navigation";
import { CigaretteDataType } from "@/consts/cigarettes.types";
import { deleteCigarettes, readCigarettesCount, readRangedCigarettes } from "@/hooks/cigarettes";

const parPage = 5;

export const AllCigarettesList = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const [cigarettesData, setCigarettesData] = useState<CigaretteDataType[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rangeStart, setRangeStart] = useState<number>(0);
  const [allCigarettesCount, setAllCigarettesCount] = useState<number | null>(null);
  const pageCount = (allCigarettesCount: number | null, parPage: number) => {
    if (allCigarettesCount! % parPage === 0) {
      return allCigarettesCount! / parPage;
    } else {
      return Math.floor(allCigarettesCount! / parPage) + 1;
    }
  };

  useEffect(() => {
    readCigarettesCount(setAllCigarettesCount);
    readRangedCigarettes(0, parPage - 1, setCigarettesData);
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
      readRangedCigarettes(0, parPage - 1, setCigarettesData);
    } else {
      readRangedCigarettes(rangeStart, rangeStart + parPage - 1, setCigarettesData);
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

  return (
    <>
      {cigarettesData ? (
        <>
          <Typography>全{allCigarettesCount}件のデータ</Typography>
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
                {cigarettesData.map((lcd) => (
                  <TableRow
                    key={lcd.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      {formatDate(lcd.created_at)}
                    </TableCell>

                    <TableCell align="center">
                      <Grid container>
                        <Grid item xs={4} >
                          <CountDownButton
                            user={user}
                            currentId={lcd.id}
                            cigarettesCounter={lcd.cigarettes_counter}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Typography sx={{ textAlign: "center" }}>
                            {lcd.cigarettes_counter}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} >
                          <CountUpButton
                            user={user}
                            currentId={lcd.id}
                            cigarettesCounter={lcd.cigarettes_counter}
                          />
                        </Grid>
                      </Grid>
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        onClick={() => {
                          deleteCigarettes(lcd.id, setCigarettesData);
                          router.refresh();
                        }}
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
            pageCount={pageCount(allCigarettesCount, parPage)}
            setCurrentPage={setCurrentPage}
          />
        </>
      ) : null}
    </>
  );
};
