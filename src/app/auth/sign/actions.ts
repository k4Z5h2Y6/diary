"use server";

import { createClient } from "@/utils/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signin(
  email: string,
  password: string,
) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  email: string,
  password: string,
) {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (error) redirect("/error");

  revalidatePath("/", "layout");
  redirect("/");
}
