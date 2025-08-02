import React from "react";
import { AppContext } from "./AppContext";

export const AppProvider = ({ children }) => {
  const backendURL =import.meta.env.VITE_API; 

  return (
    <AppContext.Provider value={{ backendURL }}>
      {children}
    </AppContext.Provider>
  );
};


