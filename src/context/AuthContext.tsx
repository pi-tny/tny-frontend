/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  adminLogin,
  adminLogout,
  adminMe,
  clearToken,
  getToken,
  setToken,
  type AdminProfile,
} from "../services/api";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthContextValue = {
  status: AuthStatus;
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Sem token → já nasce "unauthenticated" (evita setState no corpo do effect).
  const [status, setStatus] = useState<AuthStatus>(() => (getToken() ? "loading" : "unauthenticated"));
  const [admin, setAdmin] = useState<AdminProfile | null>(null);

  // Ao montar: valida o token existente contra o backend.
  useEffect(() => {
    if (!getToken()) return;
    adminMe()
      .then((profile) => {
        setAdmin(profile);
        setStatus("authenticated");
      })
      .catch(() => {
        clearToken();
        setAdmin(null);
        setStatus("unauthenticated");
      });
  }, []);

  const login = async (email: string, password: string) => {
    const token = await adminLogin(email, password);
    setToken(token);
    const profile = await adminMe();
    setAdmin(profile);
    setStatus("authenticated");
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch {
      // Logout é stateless no backend; segue mesmo se falhar.
    }
    clearToken();
    setAdmin(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider
      value={{ status, admin, isAuthenticated: status === "authenticated", login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
