/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminLogin,
  adminLogout,
  adminMe,
  clearToken,
  getToken,
  setToken,
  type AdminProfile,
} from "../services/api";
import { keys } from "../hooks/queries";

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
  const queryClient = useQueryClient();
  // reactive flag so the profile query re-enables right after login.
  const [hasToken, setHasToken] = useState(() => Boolean(getToken()));

  // on a stale/expired token the profile fetch 401s, and the axios interceptor
  // clears the token; the error state below already renders as unauthenticated.
  const me = useQuery({ queryKey: keys.me, queryFn: adminMe, enabled: hasToken, retry: false });

  const status: AuthStatus = !hasToken
    ? "unauthenticated"
    : me.isSuccess
      ? "authenticated"
      : me.isError
        ? "unauthenticated"
        : "loading";

  const login = async (email: string, password: string) => {
    const token = await adminLogin(email, password);
    setToken(token);
    // prime the cache before flipping the flag, so status is "authenticated"
    // as soon as this resolves.
    await queryClient.fetchQuery({ queryKey: keys.me, queryFn: adminMe });
    setHasToken(true);
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch {
      // logout is stateless on the backend; proceed even if it fails.
    }
    clearToken();
    setHasToken(false);
    queryClient.removeQueries({ queryKey: keys.me });
  };

  return (
    <AuthContext.Provider
      value={{ status, admin: me.data ?? null, isAuthenticated: status === "authenticated", login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
