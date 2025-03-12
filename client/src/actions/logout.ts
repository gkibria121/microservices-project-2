"use server";

import axios from "axios";
import { logout } from "../services/authService";
import { deleteCookie } from "../services/cookie";
import { redirect, RedirectType } from "next/navigation";

export default async function logoutAction() {
  try {
    await logout();
    await deleteCookie("user");
    await deleteCookie("session");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.error(error);
    }
  }

  redirect("/signin", RedirectType.replace);
}
