"use client";
import Link from "next/link";
import type { Session } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import styles from "./navigation.module.css";

export const Navigation = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  if (session === null) {
    router.push("/login");
  }
  return (
    <>
      {session ? (
        <div className={styles.navO}>
          <div className={styles.navItemO}>
            <Link href="/setting"><p className={styles.navP}>Setting</p></Link>
          </div>
          <div className={styles.navItemO}>
            <Link href="/"><p className={styles.navP}>Home</p></Link>
          </div>
          <div className={styles.navItemO}>
            <Link href="/data"><p className={styles.navP}>Data</p></Link>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
