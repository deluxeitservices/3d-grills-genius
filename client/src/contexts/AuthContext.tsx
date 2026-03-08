import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiRequest } from "@/lib/api";

interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<User>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/login", { email, password });
    const data = await res.json();
    setUser(data.user);
    return data.user;
  };

  const register = async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
    const res = await apiRequest("POST", "/api/auth/register", data);
    const result = await res.json();
    setUser(result.user);
    return result.user;
  };

  const logout = async () => {
    await apiRequest("POST", "/api/auth/logout");
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    const res = await apiRequest("PATCH", "/api/auth/profile", data);
    const result = await res.json();
    setUser(result.user);
    return result.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
