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
  const userString = getCookie("user");

  useEffect(() => {
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user as UserType);
      setIsAuth(!!user);
    }
    setUser(null);
    setIsAuth(false);
  }, [userString]);
  return (
    <authContext.Provider value={{ isAuth, user }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuthContext = () => useContext(authContext);
