import { Button } from "@mui/material";

export default function Setting() {
  return (
    <>
      <form action="/auth/logout" method="post">
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ marginBottom: "16px" }}
        >
          ログアウト
        </Button>
      </form>
    </>
  );
}
