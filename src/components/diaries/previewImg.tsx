"use client";
import { DiariesType } from "@/consts/diaries.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
type Diaries = DiariesType["public"]["Tables"]["diaries"]["Row"];

export default function PreviewImg({
  url,
  user,
}: {
  url: Diaries["diary_img_url"];
  user: User | null;
}) {
  const supabase = createClientComponentClient<DiariesType>();
  const [diaryImgUrl, setDiaryImgUrl] = useState<Diaries["diary_img_url"]>(url);

  useEffect(() => {
    console.log(diaryImgUrl);
  },[]);

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
        console.log("Error downloading image: ", error);
      } finally {
      }
    }
    if (url) downloadImage(url);
  }, [url, supabase]);

  return (
    <>
      {diaryImgUrl ? (
        <Image
          width={100}
          height={100}
          src={diaryImgUrl}
          // src={diaryImgUrl.toString()}
          // src={`${diaryImgUrl}`}
          alt=""
          style={{ height: 100, width: 100 }}
        />
      ) : (
        <></>
      )}
    </>
  );
}
