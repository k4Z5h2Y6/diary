"use client";
import { SleepsType } from "@/consts/database.types";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { time } from "console";
import { string } from "prop-types";
import { useState } from "react";

export default function SleepOnsetButton({ user }: { user: User | null }) {

  const supabase = createClientComponentClient<SleepsType>();
  const [loading, setLoading] = useState<boolean>(false);

  // //2024-02-01 10:30:46.532+00
  // const now = () => {
  //   const time = new Date()
  //   console.log(time)
  // }
  
  async function createSleepOnset() {
    try {
      setLoading(true);
      const { error } = await supabase.from("sleeps").insert({
        user_id: user?.id as string,
      });
      if (error) throw error;
      alert("Sleep Onset Created!");
    } catch (error) {
      alert("Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        <button onClick={() => createSleepOnset()}>入眠</button>
      </div>
    </>
  );
}
