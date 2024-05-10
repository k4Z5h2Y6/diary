"use client";

import { UpdateUserNameType } from "@/consts/profile.types";
import { readUserName, updateUserName } from "@/hooks/profiles";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";

export const UserNameForm = ({ user }: { user: User | null }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const userNameRef = useRef<HTMLTextAreaElement>(null);
  const [isUserNameDialogOpened, setIsUserNameDialogOpened] =
    useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    //サインアップ後のエラーアラート防止でif (user)
    if (user) readUserName(user?.id!, setUserName);
  }, []);

  const handleFormSubmit = async (event: any) => {
    console.log(userNameRef.current?.value);
    event.preventDefault();
    if (userNameRef.current?.value) {
      setUserName(userNameRef.current?.value);
    }
    const newData: UpdateUserNameType = {
      user_name: userNameRef.current?.value || null,
    };
    await updateUserName(user!.id, newData, setIsOpenSnackbar);
    await readUserName(user?.id!, setUserName);
    handleClose();
  };

  const handleClose = () => {
    setIsUserNameDialogOpened(false);
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpenSnackbar(false);
  };

  return (
    <>
      <Typography>
        こんにちは、
        <Button onClick={() => setIsUserNameDialogOpened(true)}>
          {userName ? userName : "匿名"}
        </Button>
        さん
      </Typography>

      <Dialog
        open={isUserNameDialogOpened}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleFormSubmit,
        }}
      >
        <DialogTitle>ユーザーネームを登録・変更</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ユーザーネームを入力してください
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="text"
            label="カテゴリー名"
            type="text"
            fullWidth
            variant="standard"
            inputRef={userNameRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button type="submit">登録</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success">ユーザーネームを変更しました</Alert>
      </Snackbar>
    </>
  );
};
