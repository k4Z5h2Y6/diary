"use client";

import { signin, signup } from "@/app/auth/sign/actions";
import { supabase } from "@/consts/supabaseClient";
import { Button, CircularProgress, TextField } from "@mui/material";
import Head from "next/head";
import { useRef, useState } from "react";

export const AuthForm = () => {
  const emailRef = useRef<HTMLTextAreaElement>(null);
  const passwordRef = useRef<HTMLTextAreaElement>(null);

  const handleSignin = () => {
    const email = emailRef.current?.value || null;
    const password = passwordRef.current?.value || null;
    if (email && password) {
      signin(email, password);
    } else {
      alert("正しく入力できていません");
    }
  };

  const handleSignup = () => {
    const email = emailRef.current?.value || null;
    const password = passwordRef.current?.value || null;
    if (email && password) {
      signup(email, password);
    } else {
      alert("正しく入力できていません");
    }
  };

  return (
    <>
      <TextField
        label="メールアドレス"
        variant="outlined"
        inputRef={emailRef}
        InputLabelProps={{ shrink: true }}
        defaultValue={emailRef.current?.value}
        multiline
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="パスワード"
        variant="outlined"
        inputRef={passwordRef}
        InputLabelProps={{ shrink: true }}
        defaultValue={passwordRef.current?.value}
        multiline
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <Button
        variant="contained"
        type="submit"
        onClick={() => handleSignin()}
        fullWidth
        sx={{ marginBottom: "16px" }}
      >
        サインイン
      </Button>
      <Button
        variant="contained"
        type="submit"
        onClick={() => handleSignup()}
        fullWidth
        sx={{ marginBottom: "16px" }}
      >
        サインアップ
      </Button>
      {/* <div>
        <Head>
          <title>新規登録画面</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div>
            <form onSubmit={onSubmit}>
              <div>
                <label>メールアドレス</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label>パスワード</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label>パスワード（確認）</label>
                <input
                  type="password"
                  required
                  value={passwordConf}
                  onChange={(e) => setPasswordConf(e.target.value)}
                />
              </div>
              <div>
                <button type="submit">サインアップ</button>
              </div>
            </form>
          </div>
        </main>
        <footer></footer>
      </div> */}
    </>
  );
};
