"use client";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCookie } from "cookies-next/client";
import { UserType } from "../types/auth";
const ContextValue: {
  isAuth: boolean;
  user: UserType;
} = {
  isAuth: false,
  user: null,
};
const authContext = createContext(ContextValue);

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<UserType>(null);
  useEffect(() => {
    const user = JSON.parse(getCookie("user") ?? "");

    setUser(user as UserType);
    setIsAuth(!!user);
  }, []);

  return (
    <authContext.Provider value={{ isAuth, user }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuthContext = () => useContext(authContext);
