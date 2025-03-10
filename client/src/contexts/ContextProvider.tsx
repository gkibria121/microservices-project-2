"use client";
import React, { PropsWithChildren } from "react";
import AuthContextProvider from "./AuthContext";

function ContextProvider({ children }: PropsWithChildren) {
  return (
    <>
      <AuthContextProvider>{children}</AuthContextProvider>
    </>
  );
}

export default ContextProvider;
