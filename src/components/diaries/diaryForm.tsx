"use client";

import { createDiary, uploadDiaryImgs } from "@/hooks/diaries";
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
import ImgFetcher from "../common/imgFetcher";

export default function DiaryForm({
  user,
  diaryData,
}: {
  user: User | null;
  diaryData: DiaryDataType[] | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const diaryTextRef = useRef<HTMLTextAreaElement>(null);
  const [diaryCategory, setDiaryCategory] = useState<number | null>(null);
  const [diaryImgUrls, setDiaryImgUrls] = useState<string[] | null>([]);
  const [diaryImgFiles, setDiaryImgFiles] = useState<File[] | null>([]);
  //カテゴリー呼び出し
  const [diaryCategories, setDiaryCategories] = useState<any[]>([]);
  const [diaryCategoryLabel, setDiaryCategoryLabel] = useState<string | null>(
    null
  );

  useEffect(() => {
    readCategories(setDiaryCategories);
  }, []);

  useEffect(() => {
    if (diaryData) {
      diaryTextRef.current!.value = diaryData[0].diary_text!;
      setDiaryCategory(diaryData[0].diary_category);
      setDiaryImgUrls(diaryData[0].diary_img_url!);
    }
  }, [diaryData]);

  useEffect(() => {
    for (let i = 0; i < diaryCategories.length; i++) {
      if (diaryCategory === diaryCategories[i].id) {
        setDiaryCategoryLabel(diaryCategories[i].label);
      }
    } 
  }, [diaryCategories, diaryCategory]);

  //todo 複数画像の削除処理
  const imgChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files) {
      const fileList = event.target.files;
      const urls = [];
      const files = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const fileExt = file.name.split(".").pop();
        const filePath = `${user!.id}-${Math.random()}.${fileExt}`;

        urls.push(filePath);
        files.push(file);
      }
      setDiaryImgUrls(urls);
      setDiaryImgFiles(files);
    } else {
      setDiaryImgUrls(null);
      setDiaryImgFiles(null);
    }
  };

  const handleSubmit = async () => {
    const diaryText = diaryTextRef.current?.value || null;

    if (diaryText) {
      if (
        diaryImgUrls &&
        diaryImgFiles &&
        diaryImgUrls.length > 0 &&
        diaryImgUrls.length === diaryImgFiles.length
      ) {
        await uploadDiaryImgs(
          user,
          setLoading,
          diaryImgUrls,
          diaryImgFiles,
          () => {
            createDiary(
              user,
              setLoading,
              diaryText,
              diaryCategory,
              diaryImgUrls
            );
          }
        );
      } else {
        createDiary(user, setLoading, diaryText, diaryCategory, null);
      }
    } else {
      alert("テキストがありません");
    }

    if (diaryTextRef.current) {
      diaryTextRef.current.value = "";
    }
    setDiaryCategory(null)
    setDiaryImgUrls(null);
    setDiaryImgFiles(null);
  };

  const handleClickCancelImg = (index: number) => {
    const updatedUrls = [...diaryImgUrls!];
    const updatedFiles = [...diaryImgFiles!];
    updatedUrls.splice(index, 1);
    updatedFiles.splice(index, 1);
    setDiaryImgUrls(updatedUrls.length > 0 ? updatedUrls : null);
    setDiaryImgFiles(updatedFiles.length > 0 ? updatedFiles : null);
    console.log(diaryImgUrls);
    console.log(diaryImgFiles);
  };

  //todo
  const handleUpdate = async () => {};

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
        options={diaryCategories}
        value={diaryCategoryLabel}
        onChange={(event: any, newValue: LabelCategoriesType | null) => {
          if (newValue) {
            setDiaryCategoryLabel(newValue!.label);
            setDiaryCategory(newValue!.id);
          } else {
            setDiaryCategoryLabel(null);
            setDiaryCategory(null);
          }
        }}
        // inputValue={diaryCategoryLabel!}
        // onInputChange={(event, newValue) => {
        //     // setDiaryCategoryLabel(newValue!.label);
        //     // setDiaryCategory(newValue!.id);
        //     console.log(newValue)
        // }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="カテゴリー"
            defaultValue={diaryCategoryLabel}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        )}
        size="small"
        sx={{ marginBottom: "16px" }}
      />
      <label htmlFor="diaries">
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
        id="diaries"
        onChange={imgChange}
        multiple
      />

      {/* 画像表示エリア */}
      <Box sx={{ display: "flex" }}>
        {diaryImgUrls &&
          diaryImgUrls.length > 0 &&
          diaryImgUrls!.map((fiu, index) => (
            <Box
              key={index}
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
              {/* todo diaryDataがない場合は画像を削除できない */}
              {diaryData ? (
                <ImgFetcher url={fiu} bucket={"diary_img"} />
              ) : (
                <>
                  <IconButton
                    onClick={() => handleClickCancelImg(index)}
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
                      src={URL.createObjectURL(diaryImgFiles![index])}
                      alt=""
                      style={{
                        width: "160px",
                        height: "160px",
                        objectFit: "contain",
                        aspectRatio: "1 / 1",
                      }}
                    />
                  </picture>
                </>
              )}
            </Box>
          ))}
      </Box>
      {/* {diaryImgFiles ? (
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
      )} */}

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
