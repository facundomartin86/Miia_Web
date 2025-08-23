import React, { createContext, useContext, ReactNode } from "react";

interface ThemeContextType {
  theme: "futuristic";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = {
    theme: "futuristic" as const,
    colors: {
      primary: "#3b82f6",
      secondary: "#06b6d4",
      accent: "#10b981",
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
