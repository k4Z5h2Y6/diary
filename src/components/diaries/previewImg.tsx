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
}: {
  url: string | null;
}) {
  const supabase = createClientComponentClient<DiariesType>();
  const [diaryImgUrl, setDiaryImgUrl] = useState<string | null>(url);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("diary_img")
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setDiaryImgUrl(url);
      } catch (error) {
        console.log("Error downloading image");
      } finally {
      }
    }
    if (url) downloadImage(url);
  }, [url, supabase]);

  return (
    <>
      {diaryImgUrl ? (
        <Image
          src={diaryImgUrl}
          alt=""
          width={100}
          height={100}
          style={{ height: 100, width: 100 }}
          unoptimized={true}
        />
      ) : (
        null
      )}
    </>
  );
}
