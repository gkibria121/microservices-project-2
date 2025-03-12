"use client";
import Link from "next/link";
import React from "react";
import { useAuthContext } from "../contexts/AuthContext";
import logoutAction from "../actions/logout";

function Header() {
  const { isAuth } = useAuthContext();
  return (
    <nav className="flex justify-between bg-slate-200 py-2 px-4">
      <Link href={"/"} className="text-xl">
        TickSell
      </Link>

      {isAuth ? (
        <form className="flex gap-x-5">
          <button className="text-xl text-blue-500" onClick={logoutAction}>
            Sign Out
          </button>
        </form>
      ) : (
        <div className="flex gap-x-5">
          <Link href={"/signup"} className="text-xl text-blue-500">
            Sign UP
          </Link>
          <Link href={"/signin"} className="text-xl text-blue-500">
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Header;
