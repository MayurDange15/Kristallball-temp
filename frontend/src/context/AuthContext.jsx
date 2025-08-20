import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "auth"; // { token, user }

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null); // { id, username, ... }
  const [token, setToken] = useState(null); // string/JWT

  // Load persisted auth on startup
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token) setToken(parsed.token);
        if (parsed?.user) setUser(parsed.user);
      }
    } catch {
      console.log("Storage Key not found");
    }
    setInitializing(false);
  }, []);

  // Persist whenever changes
  useEffect(() => {
    if (token && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token, user]);

  const login = async (username, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error((await res.json())?.message || "Login failed");
    const { accessToken, user } = await res.json();

    // Temporary stub to keep you moving:
    // if (!username || !password) throw new Error("Missing credentials");
    // const accessToken = "dev-token";
    // const userObj = { id: 1, username };

    setToken(accessToken);
    setUser(user);
    return true;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      initializing,
      isAuthenticated: !!user && !!token,
      user,
      token,
      login,
      logout,
    }),
    [initializing, user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
