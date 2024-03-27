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
      <Stack spacing={2} sx={{alignItems: "center"}}>
        <Pagination
          count={pageCount}
          showFirstButton
          showLastButton
          onChange={(e, page) => setCurrentPage(page)}
        />
      </Stack>
    </>
  );
};
