"use client";

import { createContext, useContext, useState } from "react";
import { AppContextType } from "@/interfaces/appContext";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<AppContextType["categories"]>([]);
  const value = { categories, setCategories } as AppContextType;
    
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

export default useApp;      