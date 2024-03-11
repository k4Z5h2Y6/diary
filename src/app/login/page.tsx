import { Button, TextField } from "@mui/material";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <form action="/auth/login" method="post">
        <TextField
          name="email"
          label="メールアドレス"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ marginBottom: "16px" }}
        />
        <TextField
          name="password"
          label="パスワード"
          variant="outlined"
          size="small"
          type="password"
          fullWidth
          sx={{ marginBottom: "16px" }}
        />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ marginBottom: "16px" }}
        >
          ログイン
        </Button>
        <div>
          <Link href="/resetPassword">パスワードを忘れた場合</Link>
        </div>
      </form>
    </>
  );
}
