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
import { PaginationDiary } from "../common/pagenationDiary";
import { useRouter } from "next/navigation";
import { CigaretteDataType } from "@/consts/cigarettes.types";
import { deleteCigarettes, readCigarettesCount, readRangedCigarettes } from "@/hooks/cigarettes";
import { CigarettesForm } from "./cigaretteForm";

const parPage = 50;

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
    readCigarettesCount(user?.id!, setAllCigarettesCount);
    readRangedCigarettes(user?.id!, 0, parPage - 1, setCigarettesData);
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
      readRangedCigarettes(user?.id!, 0, parPage - 1, setCigarettesData);
    } else {
      readRangedCigarettes(user?.id!, rangeStart, rangeStart + parPage - 1, setCigarettesData);
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
                {cigarettesData.map((cd) => (
                  <TableRow
                    key={cd.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      {formatDate(cd.created_at)}
                    </TableCell>

                    <TableCell align="center">
                      <CigarettesForm user={user} cigarettesData={cd} />
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        onClick={() => {
                          deleteCigarettes(user?.id!, cd.id, setCigarettesData);
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
      ) : (
        <>まだデータがありません</>
      )}
    </>
  );
};
