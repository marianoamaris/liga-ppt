import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authApi, storeToken, clearToken, getToken, type Profile } from "../lib/api";

interface AuthState {
  profile: Profile | null;
  loading: boolean;
}

interface AuthCtx extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ profile: null, loading: true });

  // Restore session on mount
  useEffect(() => {
    if (!getToken()) {
      setState({ profile: null, loading: false });
      return;
    }
    authApi
      .me()
      .then(({ profile }) => setState({ profile, loading: false }))
      .catch(() => {
        clearToken();
        setState({ profile: null, loading: false });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { session, profile } = await authApi.login(email, password);
    storeToken(session.access_token);
    setState({ profile, loading: false });
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    clearToken();
    setState({ profile: null, loading: false });
  }, []);

  return (
    <Ctx.Provider value={{ ...state, login, logout }}>{children}</Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
