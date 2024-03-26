"use client";

import { Pagination, Stack } from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction } from "react";

export const PaginationDiary = ({
  pageCount,
  setCurrentPage,
}: {
  pageCount: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <>
      <Stack spacing={2}>
        <Pagination
          count={pageCount}
          showFirstButton
          showLastButton
          onChange={(e, page) => {
            console.log(page);
            setCurrentPage(page);
          }}
        />
      </Stack>
    </>
  );
};
