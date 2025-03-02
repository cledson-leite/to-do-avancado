import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Adiciona estado de carregamento

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Finaliza o carregamento
  }, []);

  function login(email, password) {
    if (!email || !password) {
      return;
    }
    const fakeUser = { id: 1, email, password };
    localStorage.setItem("user", JSON.stringify(fakeUser));
    setUser(fakeUser);
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
