import { useContext, useState } from "react";
import { createContext } from "react";

interface DarkmodeType {
  darkmode: boolean;
  setDarkmode: React.Dispatch<React.SetStateAction<boolean>>;
}

const DarkmodeContext = createContext<DarkmodeType | null>(null);

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
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
