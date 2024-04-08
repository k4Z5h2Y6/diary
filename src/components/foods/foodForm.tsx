"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { createFood, uploadFoodImgs } from "@/hooks/foods";
import { FoodDataType } from "@/consts/foods.types";
import ImgFetcher from "../common/imgFetcher";

export default function FoodForm({
  user,
  foodData,
}: {
  user: User | null;
  foodData: FoodDataType[] | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const foodTitleRef = useRef<HTMLTextAreaElement>(null);
  const ingredientRef = useRef<HTMLTextAreaElement>(null);
  const foodMemoRef = useRef<HTMLTextAreaElement>(null);
  const [foodImgUrls, setFoodImgUrls] = useState<string[] | null>([]);
  const [foodImgFiles, setFoodImgFiles] = useState<File[] | null>([]);

  useEffect(() => {
    if (foodData) {
      foodTitleRef.current!.value = foodData[0].food_title!;
      ingredientRef.current!.value = foodData[0].ingredient!;
      foodMemoRef.current!.value = foodData[0].food_memo!;
      setFoodImgUrls(foodData[0].food_img_url!);
    }
  }, [foodData]);

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

      setFoodImgUrls(urls);
      setFoodImgFiles(files);
    } else {
      setFoodImgUrls(null);
      setFoodImgFiles(null);
    }
    console.log("hello");
  };

  const handleSubmit = async () => {
    const foodText = foodTitleRef.current?.value || null;
    const ingredient = ingredientRef.current?.value || null;
    const foodMemo = foodMemoRef.current?.value || null;
    if (
      !foodText &&
      !ingredient &&
      !foodMemo &&
      (!foodImgUrls || foodImgUrls.length === 0)
    ) {
      alert("コンテンツがありません");
    } else {
      if (
        foodImgUrls &&
        foodImgFiles &&
        foodImgUrls.length > 0 &&
        foodImgUrls.length === foodImgFiles.length
      ) {
        await uploadFoodImgs(
          user,
          setLoading,
          foodImgUrls,
          foodImgFiles,
          () => {
            createFood(
              user,
              setLoading,
              foodText,
              ingredient,
              foodMemo,
              foodImgUrls
            );
          }
        );
      } else {
        createFood(user, setLoading, foodText, ingredient, foodMemo, null);
      }
    }
    if (foodTitleRef.current) {
      foodTitleRef.current.value = "";
    }
    if (ingredientRef.current) {
      ingredientRef.current.value = "";
    }
    if (foodMemoRef.current) {
      foodMemoRef.current.value = "";
    }
    setFoodImgUrls(null);
    setFoodImgFiles(null);
  };

  const handleClickCancelImg = (index: number) => {
    const updatedUrls = [...foodImgUrls!];
    const updatedFiles = [...foodImgFiles!];
    updatedUrls.splice(index, 1);
    updatedFiles.splice(index, 1);
    setFoodImgUrls(updatedUrls.length > 0 ? updatedUrls : null);
    setFoodImgFiles(updatedFiles.length > 0 ? updatedFiles : null);
    console.log(foodImgUrls);
    console.log(foodImgFiles);
  };

  //todo
  const handleUpdate = async () => {
  };

  return (
    <>
      <TextField
        label="料理名"
        variant="outlined"
        inputRef={foodTitleRef}
        InputLabelProps={{ shrink: true }}
        defaultValue={foodTitleRef.current?.value}
        multiline
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="食材"
        variant="outlined"
        inputRef={ingredientRef}
        InputLabelProps={{ shrink: true }}
        defaultValue={ingredientRef.current?.value}
        multiline
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="点数、レシピ、感想、調理時間"
        variant="outlined"
        inputRef={foodMemoRef}
        InputLabelProps={{ shrink: true }}
        defaultValue={foodMemoRef.current?.value}
        multiline
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <label htmlFor="foods">
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
        id="foods"
        onChange={imgChange}
        multiple
      />

      {/* 画像表示エリア */}
      <Box sx={{ display: "flex" }}>
        {foodImgUrls &&
          foodImgUrls.length > 0 &&
          foodImgUrls!.map((fiu, index) => (
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
              {/* todo foodDataがない場合は画像を削除できない */}
              {foodData ? (
                <ImgFetcher url={fiu} bucket={"food_img"} />
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
                      src={URL.createObjectURL(foodImgFiles![index])}
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

      {foodData ? (
        <Button
          variant="contained"
          type="submit"
          // onClick={() => handleUpdate()}
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
