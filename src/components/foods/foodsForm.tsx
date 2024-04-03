"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { useRef, useState } from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { createFood, uploadFoodImg } from "@/hooks/foods";

export default function FoodsForm({ user }: { user: User | null }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imgUploading, setImgUploading] = useState(false);
  const foodTextRef = useRef<HTMLTextAreaElement>(null);
  const ingredientRef = useRef<HTMLTextAreaElement>(null);
  const [foodImgUrl, setFoodImgUrl] = useState<string | null>(null);
  const [foodImgFile, setFoodImgFile] = useState<File | null>(null);

  const imgChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user!.id}-${Math.random()}.${fileExt}`;

      setFoodImgFile(file);
      setFoodImgUrl(filePath);
      console.log(filePath)
    } else {
      setFoodImgFile(null);
      setFoodImgUrl(null);
    }
  };

  const handleSubmit = async () => {
    const foodText = foodTextRef.current?.value || "";
    const ingredient = ingredientRef.current?.value || "";
    console.log(foodText + ingredient)

    if (foodText === "" && ingredient === "" && foodImgUrl === null) {
      alert("コンテンツがありません");
    } else {
      if (foodImgUrl) {
        await uploadFoodImg(
          user,
          setImgUploading,
          foodImgUrl,
          foodImgFile,
          () => {
            createFood(user, setLoading, foodText, ingredient, foodImgUrl);
          }
        );
      } else {
        createFood(user, setLoading, foodText, ingredient, foodImgUrl);
      }
    }

    // フォームを送信した後、textarea をクリアする
    if (foodTextRef.current) {
      foodTextRef.current.value = "";
    }
    if (ingredientRef.current) {
      ingredientRef.current.value = "";
    }
    setFoodImgFile(null);
    setFoodImgUrl(null);
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
        // accept="image/*"
        onChange={imgChange}
        disabled={imgUploading}
      />

      {foodImgFile ? (
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
              setFoodImgFile(null);
              setFoodImgUrl(null);
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
      ) : (
        <></>
      )}
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
