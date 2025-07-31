import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sincronizando, setSincronizando] = useState(false);

  return (
    <AuthContext.Provider
      value={{ user, setUser, sincronizando, setSincronizando }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
