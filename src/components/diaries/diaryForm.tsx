"use client";

import { createDiary, updateDiary, uploadDiaryImgs } from "@/hooks/diaries";
import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import { readCategories } from "@/hooks/categories";
import { CategoryType, OptionsCategoriesType } from "@/consts/categories.types";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { DiaryDataType, UpdateDiaryType } from "@/consts/diaries.types";
import ImgFetcher from "../common/imgFetcher";
import { CategoryDialog } from "./categoryDialog";

export default function DiaryForm({
  user,
  diaryData,
}: {
  user: User | null;
  diaryData: DiaryDataType[] | null;
}) {
  const diaryTextRef = useRef<HTMLTextAreaElement>(null);
  const [diaryCategory, setDiaryCategory] = useState<number | null>(null);
  const [diaryImgUrls, setDiaryImgUrls] = useState<string[] | null>([]);
  const [diaryImgFiles, setDiaryImgFiles] = useState<File[] | null>([]);

  //カテゴリー呼び出し
  const [diaryCategories, setDiaryCategories] = useState<CategoryType[]>([]);
  const [options, setOptions] = useState<OptionsCategoriesType[]>([]);
  const [diaryCategoryLabel, setDiaryCategoryLabel] =
    useState<OptionsCategoriesType | null>(null);

  //カテゴリー追加ダイアログ
  const [isCategoryDialogOpened, setIsCategoryDialogOpened] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    readCategories(user?.id!, setDiaryCategories);
  }, []);

  useEffect(() => {
    if (diaryData) {
      diaryTextRef.current!.value = diaryData[0].diary_text!;
      setDiaryCategory(diaryData[0].diary_category);
      setDiaryImgUrls(diaryData[0].diary_img_url!);
    }
  }, [diaryData]);

  useEffect(() => {
    const options: OptionsCategoriesType[] = [];
    for (let i = 0; i < diaryCategories.length; i++) {
      options.push({
        id: diaryCategories[i].id,
        label: diaryCategories[i].category_name,
      });
      if (diaryCategory === diaryCategories[i].id) {
        setDiaryCategoryLabel({
          id: diaryCategories[i].id,
          label: diaryCategories[i].category_name,
        });
      }
    }
    setOptions(options);
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
        await uploadDiaryImgs(setLoading, diaryImgUrls, diaryImgFiles);
        await createDiary(
          user?.id!, 
          diaryText,
          diaryCategory,
          diaryImgUrls,
          setLoading,
          setIsOpenSnackbar
        );
      } else {
        createDiary(
          user?.id!, 
          diaryText,
          diaryCategory,
          null,
          setLoading,
          setIsOpenSnackbar
        );
      }
    } else {
      alert("テキストがありません");
    }

    if (diaryTextRef.current) {
      diaryTextRef.current.value = "";
    }
    setDiaryCategory(null);
    setDiaryImgUrls(null);
    setDiaryImgFiles(null);
    setDiaryCategoryLabel(null)
  };

  const handleClickCancelImg = (index: number) => {
    const updatedUrls = [...diaryImgUrls!];
    const updatedFiles = [...diaryImgFiles!];
    updatedUrls.splice(index, 1);
    updatedFiles.splice(index, 1);
    setDiaryImgUrls(updatedUrls.length > 0 ? updatedUrls : []);
    setDiaryImgFiles(updatedFiles.length > 0 ? updatedFiles : []);
  };

  const handleUpdate = () => {
    const currentDate = new Date().toISOString();
    const newData: UpdateDiaryType = {
      update_at: currentDate,
      diary_text: diaryTextRef.current?.value || null,
      diary_category: diaryCategory,
    };
    updateDiary(
      user!.id,
      diaryData![0].id,
      newData,
      setLoading,
      setIsOpenSnackbar
    );
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
      <TextField
        label="テキスト"
        variant="outlined"
        inputRef={diaryTextRef}
        InputLabelProps={{ shrink: true }}
        required
        multiline
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      {diaryCategories ? (
        <Autocomplete
          options={options}
          value={diaryCategoryLabel}
          onChange={(event: any, newValue: OptionsCategoriesType | null) => {
            if (newValue) {
              setDiaryCategoryLabel({ id: newValue.id, label: newValue.label });
              setDiaryCategory(newValue.id);
            } else {
              setDiaryCategoryLabel(null);
              setDiaryCategory(null);
            }
            console.log(newValue);
          }}
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
        />
      ) : (
        <>カテゴリーがありません</>
      )}
      <Button
        variant="text"
        component="span"
        onClick={() => setIsCategoryDialogOpened(true)}
        sx={{ fontSize: 10, marginBottom: "16px" }}
      >
        カテゴリーを追加
      </Button>
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

      {diaryData ? (
        <Button
          variant="contained"
          type="submit"
          onClick={() => handleUpdate()}
          disabled={loading}
          fullWidth
          sx={{ marginBottom: "16px" }}
        >
          {loading ? <CircularProgress size={24} /> : "更新(写真は更新不可)"}
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

      <CategoryDialog
        user={user}
        isCategoryDialogOpened={isCategoryDialogOpened}
        setIsCategoryDialogOpened={setIsCategoryDialogOpened}
      />

      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success">完了しました</Alert>
      </Snackbar>
    </>
  );
}
