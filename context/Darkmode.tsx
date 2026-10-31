"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import type { ReactNode } from "react";

interface DarkmodeType {
  darkmode: boolean;
  setDarkmode: Dispatch<SetStateAction<boolean>>;
}

const DarkmodeContext = createContext<DarkmodeType | null>(null);

export const DarkModeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [darkmode, setDarkmode] = useState(false);

  return (
    <DarkmodeContext.Provider value={{ darkmode, setDarkmode }}>
      {children}
    </DarkmodeContext.Provider>
  );
};

export const useDarkmode = () => {
  const context = useContext(DarkmodeContext);
  if (!context)
    throw new Error("Darkmode must be used inside DarkmodeProvider");
  return context;
};
