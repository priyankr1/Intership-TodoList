import React from "react";
import { AppContext } from "./AppContext";

export const AppProvider = ({ children }) => {
  const backendURL = "http://localhost:5000/api"; // Change for production

  return (
    <AppContext.Provider value={{ backendURL }}>
      {children}
    </AppContext.Provider>
  );
};


