import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { AuthForm } from "@/components/authForm";

// export default function SignUp(){
//   return (
//     <>
//       <AuthForm/>
//     </>
//   )
// }

import { Button, TextField } from "@mui/material";
import Link from "next/link";
import { login, signup } from "../auth/login/actions";
import { redirect } from "next/dist/server/api-utils";

export default function Login() {
  return (
    <>
      {/* <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={redirect("/auth/login")}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form> */}
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
