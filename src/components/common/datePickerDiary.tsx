"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { User } from "@supabase/supabase-js";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

export const DatePickerDiary = ({ 
  user,
  defaultValue,
}: { 
  user: User | null
  defaultValue: Dayjs | null
}) => {
  const [value, setValue] = useState<Dayjs | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };
  const handleClose = () => {
    setIsDialogOpen(false);
  };


  useEffect(() => {
    console.log(value)
  },[value])

  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        dateFormats={{ monthAndYear: "YYYY年 MM月" }}
      >
        <DatePicker
          defaultValue={defaultValue}
          value={value}
          format="YYYY/MM/DD"
          onChange={(nv) => setValue(nv)}
          // renderInput={(params: any) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
