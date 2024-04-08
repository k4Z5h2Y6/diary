"use client";
import { DiariesType } from "@/consts/diaries.types";
import { Box } from "@mui/material";
import {
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImgFetcher({
  url,
  bucket,
}: {
  url: string | null;
  bucket: string;
}) {
  const supabase = createClientComponentClient<DiariesType>();
  const [imgUrl, setImgUrl] = useState<string | null>(url);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setImgUrl(url);
      } catch (error) {
        console.log("Error downloading image");
      } finally {
      }
    }
    if (url) downloadImage(url);
  }, [url, supabase]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt=""
            fill
            objectFit="contain"
            unoptimized={true}
          />
        ) : (
          <Image
            src="/no_image.jpeg"
            alt=""
            fill
            objectFit="contain"
            unoptimized={true}
          />
        )}
      </Box>
    </>
  );
}
