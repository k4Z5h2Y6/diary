import Link from "next/link";

export default function Login() {
  return (
    <>
      <form action="/auth/login" method="post">
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="name@company.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <Link href="/resetPassword">
            パスワードを忘れた場合
          </Link>
        </div>
        <div>
          <button>ログイン</button>
        </div>
      </form>
    </>
  );
}

// "use client";
// import SignInForm from "@/components/signinForm";
// import { useState } from "react";

// export default function Login() {
//   const [xxx, setXxx] = useState(true)
//   return (
//     <SignInForm showModal={setXxx} />
//   )
// }
