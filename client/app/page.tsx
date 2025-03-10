"use client";

import { useAuthContext } from "@/src/contexts/AuthContext";

export default function Home() {
  const { isAuth } = useAuthContext();
  return <div>{isAuth ? "You are signed in" : "You are not signed in"}</div>;
}
