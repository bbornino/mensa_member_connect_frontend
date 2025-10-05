// frontend/src/context/RefreshContext.tsx
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react"; // 👈 type-only import

// 1️⃣ Define the shape of the context
interface RefreshContextType {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

// 2️⃣ Create the context with a default value (will be overridden in provider)
const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

// 3️⃣ Define the props for the provider
interface RefreshProviderProps {
  children: ReactNode;
}

// 4️⃣ Create the provider
export const RefreshProvider: React.FC<RefreshProviderProps> = ({ children }) => {
  const [refresh, setRefresh] = useState<boolean>(false);

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

// 5️⃣ Create a custom hook for consuming the context
export const useRefresh = (): RefreshContextType => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefresh must be used within a RefreshProvider");
  }
  return context;
};
