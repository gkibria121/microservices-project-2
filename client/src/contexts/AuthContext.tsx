import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

const ContextValue: {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
} = {
  isAuth: false,
  setIsAuth: () => {},
};
const authContext = createContext(ContextValue);

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <authContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuthContext = () => useContext(authContext);
