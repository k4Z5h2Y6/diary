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
  FormHelperText,
} from "@mui/material";
import { useRef, useState } from "react";

export const AuthForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSignin = () => {
    const email = emailRef.current?.value || null;
    const password = passwordRef.current?.value || null;
    if (email && password) {
      if (!isValidEmail(email)) {
        setEmailError("メールアドレスの形式が正しくありません");
        return;
      }
      if (!isValidPassword(password)) {
        setPasswordError("パスワードは7文字以上のアルファベットで入力してください");
        return;
      }
      // 正しいパスワードが入力された場合は、エラーメッセージをクリアする
      setPasswordError("");
      signin(email, password);
    } else {
      alert("正しく入力できていません");
    }
  };

  const handleSignup = () => {
    const email = emailRef.current?.value || null;
    const password = passwordRef.current?.value || null;
    if (email && password) {
      if (!isValidEmail(email)) {
        setEmailError("メールアドレスの形式が正しくありません");
        return;
      }
      if (!isValidPassword(password)) {
        setPasswordError("パスワードは6文字以上のアルファベットで入力してください");
        return;
      }
      setEmailError("")
      setPasswordError("");
      signup(email, password);
      alert("メールを確認してください");
    } else {
      alert("正しく入力できていません");
    }
  };

  const isValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // パスワードが7文字以上のアルファベットか数字であるかをチェック
  const isValidPassword = (password: string) => {
    return password.length >= 6 && /^[a-zA-Z0-9]+$/.test(password)
  };

  return (
    <>
      <TextField
        id="xxx"
        label="メールアドレス"
        variant="outlined"
        inputRef={emailRef}
        defaultValue={emailRef.current?.value}
        InputLabelProps={{ shrink: true }}
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
        error={!!emailError}
        helperText={emailError}
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
          placeholder="6文字以上の大文字小文字英数字のみ可"
          size="small"
          fullWidth
          error={!!passwordError}
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
        {/* パスワードのエラーメッセージを表示 */}
        <FormHelperText error={!!passwordError}>{passwordError}</FormHelperText>
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
        サインアップ(初めての方)
      </Button>
    </>
  );
};