"use client";

import { SleepsType } from "@/consts/database.types";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export const SleepsList = ({ user }: { user: User | null }) => {
  const supabase = createClientComponentClient<SleepsType>();
  const [loading, setLoading] = useState(true);
  const [sleepsList, setSleepsList] = useState<any[]>([]);

  async function readSleepsList() {
    try {
      setLoading(true);
      let { data, error, status } = await supabase.from("sleeps").select("*");

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log(data);
        setSleepsList(data);
      }
    } catch (error) {
      alert("Error loading user todo!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    readSleepsList();
  }, []);

  async function deleteSleeps(id: string) {
    try {
      setLoading(true);
      const { error } = await supabase
      .from("sleeps")
      .delete()
      .eq("id", id)
  
      if (error) {
        throw error;
      }
  
      // 削除が成功したら、sleepsList からも該当する id のデータを削除します
      setSleepsList(prevSleepsList => prevSleepsList.filter(sl => sl.id !== id));
    } catch (error) {
      console.error("Error deleting sleep:");
      alert("Error deleting sleep!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>Sleeps List</div>
      {sleepsList ? (
        <>
          {sleepsList.map((sl, index) => (
            <div key={index}>
              <p>{sl.sleep_onset_at}</p>
              <button onClick={() => deleteSleeps(sl.id)}>削除</button>
            </div>
          ))}
        </>
      ) : null}
    </>
  );
};
