"use client";
import SignInForm from "@/components/signinForm";
import { useState } from "react";

export default function Login() {
  const [xxx, setXxx] = useState(true)
  return (
    <SignInForm showModal={setXxx} />
  )
}