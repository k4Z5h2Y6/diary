"use client";
import Link from "next/link";
import type { Session } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import { useEffect, useState } from "react";

export const Navigation = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  if (session === null) {
    router.push("/sign");
  }

  const [value, setValue] = useState<string | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    const formatingDirectlyName = pathname.substring(1);
    const index = formatingDirectlyName.indexOf("/");
    if (index !== -1) {
      setValue(formatingDirectlyName.substring(0, index));
    } else if (formatingDirectlyName == "") {
      setValue("home")
    } else {
      setValue(formatingDirectlyName)
    }
  }, []);

  return (
    <>
      {session ? (
        <>
          <Box sx={{ position: "fixed", right: 0, bottom: 0, left: 0 }}>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <BottomNavigationAction
                LinkComponent={Link}
                href={"/setting"}
                value={"setting"}
                label="Setting"
                icon={<SettingsIcon />}
              />
              <BottomNavigationAction
                LinkComponent={Link}
                href={"/"}
                value={"home"}
                label="Home"
                icon={<HomeIcon />}
              />
              <BottomNavigationAction
                LinkComponent={Link}
                href={"/data"}
                value={"data"}
                label="Data"
                icon={<HistoryIcon />}
              />
            </BottomNavigation>
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
