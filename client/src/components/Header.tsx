"use client";
import Link from "next/link";
import React from "react";
import { useAuthContext } from "../contexts/AuthContext";

function Header() {
  const { isAuth, setIsAuth } = useAuthContext();
  return (
    <nav className="flex justify-between bg-slate-200 py-2 px-4">
      <div className="text-xl">GitTix</div>

      {isAuth ? (
        <form className="flex gap-x-5">
          <button
            className="text-xl text-blue-500"
            onClick={() => setIsAuth((prev) => !prev)}
          >
            Sign Out
          </button>
        </form>
      ) : (
        <div
          className="flex gap-x-5"
          onClick={() => setIsAuth((prev) => !prev)}
        >
          <button className="text-xl text-blue-500">Sign UP</button>
          <button className="text-xl text-blue-500">Sign In</button>
        </div>
      )}
    </nav>
  );
}

export default Header;
