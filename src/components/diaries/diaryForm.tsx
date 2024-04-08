"use client";

import { createDiary, uploadDiaryImg } from "@/hooks/diaries";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { readCategories } from "@/hooks/categories";
import { LabelCategoriesType } from "@/consts/categories.types";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { DiaryDataType } from "@/consts/diaries.types";

export default function DiaryForm({
  user,
  diaryData,
}: {
  user: User | null;
  diaryData: DiaryDataType[] | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imgUploading, setImgUploading] = useState(false);
  const diaryTextRef = useRef<HTMLTextAreaElement>(null);
  const [diaryImgUrls, setDiaryImgUrls] = useState<string | null>(null);
  const [diaryImgFiles, setDiaryImgFiles] = useState<File | null>(null);
  const [diaryCategoyLabel, setDiaryCategoyLabel] = useState<string | null>(
    null
  );
  const [diaryCategory, setDiaryCategory] = useState<number | null>(null);
  const [diaryCategories, setDiaryCategories] = useState<any[]>([]);



  //同期処理の必要性
  //カテゴリー呼び出し後
  //詳細呼び出し
  useEffect(() => {
    readCategories(setDiaryCategories);
  }, []);

  useEffect(() => {
    if (diaryData) {
      diaryTextRef.current!.value = diaryData[0].diary_text!;
      setDiaryCategory(diaryData[0].diary_category)
      console.log(diaryCategory)
      for (let i = 0; i < diaryCategories.length; i++) {
        if (diaryCategory === diaryCategories[i].id) {
          console.log(diaryCategories[i].category_name)
          setDiaryCategoyLabel(diaryCategories[i].category_name)
        }
      }
      setDiaryImgUrls(diaryData[0].diary_img_url!)
    }
  }, [diaryData]);

  // useEffect(() => {

  // }, [diaryCategory]);







  const imgChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user!.id}-${Math.random()}.${fileExt}`;

      setDiaryImgFiles(file);
      setDiaryImgUrls(filePath);
    } else {
      setDiaryImgFiles(null);
      setDiaryImgUrls(null);
    }
  };

  const handleSubmit = async () => {
    console.log(diaryCategories)
    // const diaryText = diaryTextRef.current?.value || "";

    // if (diaryText) {
    //   if (diaryImgUrls) {
    //     await uploadDiaryImg(user, diaryImgUrls, diaryImgFiles, () => {
    //       createDiary(user, setLoading, diaryText, diaryImgUrls, diaryCategory);
    //     });
    //   } else {
    //     createDiary(user, setLoading, diaryText, diaryImgUrls, diaryCategory);
    //   }
    // } else {
    //   alert("テキストがありません");
    // }

    // // フォームを送信した後、textarea をクリアする
    // if (diaryTextRef.current) {
    //   diaryTextRef.current.value = "";
    // }
    // setDiaryImgFiles(null);
    // setDiaryImgUrls(null);
    // setDiaryCategoyLabel(null);
  };

  //todo
  const handleUpdate = async () => {
    console.log(diaryCategoyLabel)
  };

  return (
    <>
      <TextField
        label="テキスト*"
        variant="outlined"
        inputRef={diaryTextRef}
        InputLabelProps={{ shrink: true }}
        multiline
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <Autocomplete
        value={diaryCategoyLabel}
        inputValue={diaryCategoyLabel!}
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

      {diaryImgFiles ? (
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
              setDiaryImgFiles(null);
              setDiaryImgUrls(null);
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
          <picture>
            <img
              src={URL.createObjectURL(diaryImgFiles)}
              alt=""
              style={{
                width: "160px",
                height: "160px",
                objectFit: "contain",
                aspectRatio: "1 / 1",
              }}
            />
          </picture>
        </Box>
      ) : (
        <></>
      )}

      {diaryData ? (
        <Button
          variant="contained"
          type="submit"
          onClick={() => handleUpdate()}
          fullWidth
          sx={{ marginBottom: "16px" }}
        >
          更新システム作成中
        </Button>
      ) : (
        <Button
          variant="contained"
          type="submit"
          onClick={() => handleSubmit()}
          disabled={loading}
          fullWidth
          sx={{ marginBottom: "16px" }}
        >
          {loading ? <CircularProgress size={24} /> : "送信"}
        </Button>
      )}
    </>
  );
}
