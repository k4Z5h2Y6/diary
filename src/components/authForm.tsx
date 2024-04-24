"use client";

import { signin, signup } from "@/app/auth/sign/actions";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useRef, useState } from "react";

export const AuthForm = () => {
  const emailRef = useRef<HTMLTextAreaElement>(null);
  const passwordRef = useRef<HTMLTextAreaElement>(null);

  const [showPassword, setShowPassword] = useState(false);

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
      alert("メールを確認してください")
    } else {
      alert("正しく入力できていません");
    }
  };

  //フォーム問題なし、修正後
  return (
    <>
      <TextField
        label="メールアドレス"
        variant="outlined"
        inputRef={emailRef}
        defaultValue={emailRef.current?.value}
        InputLabelProps={{ shrink: true }}
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <FormControl variant="outlined" fullWidth sx={{ marginBottom: "16px" }}>
        <InputLabel
          htmlFor="outlined-adornment-password"
          shrink={true}
          size="small"
        >
          パスワード
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          inputRef={passwordRef}
          notched={true}
          label="Password"
          size="small"
          fullWidth
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((show) => !show)}
                onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                }}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
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
    </>
  );
};
