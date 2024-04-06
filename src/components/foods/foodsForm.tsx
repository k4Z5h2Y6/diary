"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { useRef, useState } from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { createFood, uploadFoodImgs } from "@/hooks/foods";

export default function FoodsForm({ user }: { user: User | null }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imgUploading, setImgUploading] = useState(false);
  const foodTextRef = useRef<HTMLTextAreaElement>(null);
  const ingredientRef = useRef<HTMLTextAreaElement>(null);
  const [foodImgUrls, setFoodImgUrls] = useState<string[] | null>([]);
  const [foodImgFiles, setFoodImgFiles] = useState<File[] | null>([]);

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
    const foodText = foodTextRef.current?.value || "";
    const ingredient = ingredientRef.current?.value || "";

    if (
      foodText === "" &&
      ingredient === "" &&
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
            createFood(user, setLoading, foodText, ingredient, foodImgUrls);
          }
        );
      } else {
        createFood(user, setLoading, foodText, ingredient, null);
      }
    }

    if (foodTextRef.current) {
      foodTextRef.current.value = "";
    }
    if (ingredientRef.current) {
      ingredientRef.current.value = "";
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
        inputRef={foodTextRef}
        multiline
        size="small"
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
      <TextField
        label="食材"
        variant="outlined"
        inputRef={ingredientRef}
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
              <img
                src={URL.createObjectURL(foodImgFile)}
                alt=""
                style={{
                  width: "160px",
                  height: "160px",
                  objectFit: "contain",
                  aspectRatio: "1 / 1",
                }}
              />
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
