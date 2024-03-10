// "use client";
// import { Button } from "@mui/material";
// import { useRouter } from "next/navigation";

export default function Setting() {
  // const router = useRouter();
  return (
    <>
      <form action="/auth/signout" method="post">
        <button className="button block" type="submit">
          ログアウト
        </button>
      </form>
      {/* <Button
        variant="outlined"
        onClick={() => router.push("/auth/signout")}
        sx={{width: "100%"}}
      >
        ログアウト
      </Button> */}
    </>
  );
}
