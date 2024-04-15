import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Dispatch, SetStateAction, useState } from "react";
import { createCategory } from "@/hooks/categories";
import { User } from "@supabase/auth-helpers-nextjs";
import { Alert, Snackbar } from "@mui/material";

export const CategoryDialog = ({
  user,
  isCategoryDialogOpened,
  setIsCategoryDialogOpened,
}: {
  user: User | null;
  isCategoryDialogOpened: boolean;
  setIsCategoryDialogOpened: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [formData, setFormData] = useState<string>("");

  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    if (formData) {
      createCategory(setIsOpenSnackbar, user, formData);
    }
    handleClose();
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData(value);
  };

  const handleClose = () => {
    setIsCategoryDialogOpened(false);
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
      <React.Fragment>
        <Dialog
          open={isCategoryDialogOpened}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: handleFormSubmit,
          }}
        >
          <DialogTitle>カテゴリーを追加</DialogTitle>
          <DialogContent>
            <DialogContentText>
              追加したいカテゴリー名を入力してください
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
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button type="submit">追加</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity="success"
        >
          入眠しました
        </Alert>
      </Snackbar>
    </>
  );
};
