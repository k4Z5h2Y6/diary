"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { createFood, uploadFoodImgs } from "@/hooks/foods";
import { FoodDataType } from "@/consts/foods.types";
import PreviewImg from "./previewImg";

export default function FoodForm({
  user,
  foodData,
}: {
  user: User | null;
  foodData: FoodDataType[] | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imgUploading, setImgUploading] = useState(false);
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
          setImgUploading,
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
  };

  return (
    <>
      <TextField
        label="料理名"
        variant="outlined"
        inputRef={foodTitleRef}
        defaultValue={foodTitleRef}
        multiline
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="食材"
        variant="outlined"
        inputRef={ingredientRef}
        defaultValue={ingredientRef}
        multiline
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="点数、レシピ、感想、調理時間"
        variant="outlined"
        inputRef={foodMemoRef}
        defaultValue={foodMemoRef}
        multiline
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <label htmlFor="foods">
        <Button
          variant="outlined"
          component="span"
          disabled={imgUploading}
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

      <Box
        sx={{
          display: "flex",
          // flexDirection: "column",
        }}
      >

        {/* ここから編集　画像表示で問題あり */}
        {foodImgFiles &&
          foodImgFiles.length > 0 &&
          foodImgFiles.map((foodImgFile, index) => (
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
              {/* <img
                src={URL.createObjectURL(foodImgFile)}
                alt=""
                style={{
                  width: "160px",
                  height: "160px",
                  objectFit: "contain",
                  aspectRatio: "1 / 1",
                }}
              /> */}
              {foodImgUrls ? (
                <>
                  {foodImgUrls.map((fiu) => {
                    <PreviewImg url={fiu[0]} />;
                  })}
                </>
              ) : (
                <PreviewImg url={null} />
              )}
            </Box>
          ))}
      </Box>
      <Button
        variant="contained"
        type="submit"
        onClick={() => handleSubmit()}
        fullWidth
        sx={{ marginBottom: "16px" }}
      >
        送信
      </Button>
    </>
  );
}
