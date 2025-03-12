"use server";

import { deleteCookie } from "../services/cookie";

export default async function logoutAction() {
  console.log("logged out!");
  await deleteCookie("user");
  await deleteCookie("session");
  console.log("cookie deleted");
}
