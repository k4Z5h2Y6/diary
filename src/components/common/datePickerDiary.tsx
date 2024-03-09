"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { User } from "@supabase/supabase-js";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { updateSleep } from "@/hooks/sleeps";
import { UpdateSleepType } from "@/consts/sleeps.types";

export const DatePickerDiary = ({
  user,
  defaultValue,
  id,
  updateColumn,
}: {
  user: User | null;
  defaultValue: string | null;
  id: number;
  updateColumn: string;
}) => {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const handleClickOpen = () => {
  //   setIsDialogOpen(true);
  // };
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (defaultValue) {
      setValue(dayjs(defaultValue));
    }
  }, []);

  const handleChenge = (nv: dayjs.Dayjs | null) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("Asia/Tokyo");
    const currentDate = new Date().toISOString();
    if (updateColumn === "sleep_onset_at") {
      const newData: UpdateSleepType = {
        update_at: currentDate,
        sleep_onset_at: dayjs.tz(nv).format(),
      };
      updateSleep(user!.id, id, newData);
    } else if (updateColumn === "wake_up_at") {
      const newData: UpdateSleepType = {
        update_at: currentDate,
        wake_up_at: dayjs.tz(nv).format(),
      };
      updateSleep(user!.id, id, newData);
    }
  };

  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        dateFormats={{ monthAndYear: "YYYY年 MM月" }}
      >
        <DateTimePicker
          defaultValue={dayjs(defaultValue)}
          value={value}
          ampm={false}
          views={["month", "day", "hours", "minutes"]}
          format="MM/DD hh:mm"
          onChange={(nv) => handleChenge(nv)}
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
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
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
