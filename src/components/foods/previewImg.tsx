"use client";
import { DiariesType } from "@/consts/diaries.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PreviewImg({
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
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt=""
          objectFit="contain"
          layout="fill"
          unoptimized={true}
        />
      ) : (
        null
      )}
    </>
  );
}
