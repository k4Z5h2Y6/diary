"use client";

import { createDiary, uploadDiaryImg } from "@/hooks/diaries";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import { readCategories } from "@/hooks/categories";
import { LabelCategoriesType } from "@/consts/categories.types";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

export default function DiariesForm({ user }: { user: User | null }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imgUploading, setImgUploading] = useState(false);
  const diaryTextRef = useRef<HTMLTextAreaElement>(null);
  const [diaryImgUrl, setDiaryImgUrl] = useState<string | null>(null);
  const [diaryImgFile, setDiaryImgFile] = useState<File | null>(null);
  const [diaryCategoyLabel, setDiaryCategoyLabel] = useState<string | null>(
    null
  );
  const [diaryCategory, setDiaryCategory] = useState<number | null>(null);
  const [diaryCategories, setDiaryCategories] = useState<any[]>([]);

  const imgChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user!.id}-${Math.random()}.${fileExt}`;

      setDiaryImgFile(file);
      setDiaryImgUrl(filePath);
    } else {
      setDiaryImgFile(null);
      setDiaryImgUrl(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // フォームのデフォルトの動作をキャンセル

    // textarea の値を取得する
    const diaryText = diaryTextRef.current?.value || "";

    if (diaryText) {
      if (diaryImgUrl) {
        await uploadDiaryImg(
          user,
          setImgUploading,
          diaryImgUrl,
          diaryImgFile,
          () => {
            createDiary(
              user,
              setLoading,
              diaryText,
              diaryImgUrl,
              diaryCategory
            );
          }
        );
      } else {
        createDiary(user, setLoading, diaryText, diaryImgUrl, diaryCategory);
      }
    } else {
      alert("コンテンツがありません");
    }

    // フォームを送信した後、textarea をクリアする
    if (diaryTextRef.current) {
      diaryTextRef.current.value = "";
    }
    setDiaryImgFile(null);
    setDiaryImgUrl(null);
  };

  useEffect(() => {
    readCategories(setLoading, setDiaryCategories);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          label="テキスト"
          variant="outlined"
          inputRef={diaryTextRef}
          multiline
          size="small"
          fullWidth
          sx={{ marginBottom: "16px" }}
        />
        <label htmlFor="single">
          <Button
            variant="outlined"
            component="span"
            fullWidth
            sx={{ marginBottom: "16px" }}
          >
            画像を選択
          </Button>
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          // accept="image/*"
          onChange={imgChange}
          disabled={imgUploading}
        />

        {diaryImgFile ? (
          <Box
            sx={{
              width: "160px",
              height: "160px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => {
                setDiaryImgFile(null);
                setDiaryImgUrl(null);
              }}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1,
                color: "#aaa",
              }}
            >
              <CancelRoundedIcon />
            </IconButton>
            <img
              src={URL.createObjectURL(diaryImgFile)}
              alt=""
              style={{
                width: "160px",
                height: "160px",
                objectFit: "contain",
                aspectRatio: "1 / 1",
              }}
            />
          </Box>
        ) : (
          <></>
        )}

        <Autocomplete
          value={diaryCategoyLabel}
          onChange={(event: any, newValue: LabelCategoriesType | null) => {
            if (newValue) {
              setDiaryCategoyLabel(newValue!.label);
              setDiaryCategory(newValue!.id);
            } else {
              setDiaryCategoyLabel(null);
              setDiaryCategory(null);
            }
          }}
          options={diaryCategories}
          renderInput={(params) => (
            <TextField {...params} label="カテゴリー" fullWidth />
          )}
          size="small"
          sx={{ marginBottom: "16px" }}
        />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ marginBottom: "16px" }}
        >
          送信
        </Button>
      </form>
    </>
  );
}
