import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { API_BASE, authLogin, clearToken, authMe } from "../services/api";
import { getToken } from "../services/api";

interface User {
  id: string;
  username: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  // Indica si se está restaurando/validando la sesión al inicio
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    // Si hay backend configurado, validar token con /auth/me
    if (API_BASE) {
      const token = getToken();
      if (!token) {
        // No hay sesión previa
        setIsInitializing(false);
        return () => {
          mounted = false;
        };
      }

      (async () => {
        try {
          const res = await authMe();
          if (!mounted) {
            return;
          }
          const userData = {
            id: res.user.id,
            username: res.user.username,
            name: res.user.name,
          };
          setIsAuthenticated(true);
          setUser(userData);
          localStorage.setItem("miia_auth", JSON.stringify({ user: userData }));
        } catch {
          if (!mounted) {
            return;
          }
          // Si la validación falla, limpiar sesión y token
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("miia_auth");
          clearToken();
        } finally {
          if (mounted) {
            setIsInitializing(false);
          }
        }
      })();
      return () => {
        mounted = false;
      };
    }

    // Si no hay backend, restaurar sesión mock si existe
    const storedAuth = localStorage.getItem("miia_auth");
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setUser(authData.user);
    }
    setIsInitializing(false);
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // If API is configured, try real backend authentication first
    if (API_BASE) {
      try {
        const res = await authLogin(username, password);
        const userData = {
          id: res.user.id,
          username: res.user.username,
          name: res.user.name,
        };
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem("miia_auth", JSON.stringify({ user: userData }));
        return true;
      } catch {
        // continuar y devolver false; no usar mock si se pretende backend y falló
        return false;
      }
    }

    // Fallback simple authentication (development only)
    if (username === "admin" && password === "miia2025") {
      const userData = {
        id: "1",
        username: "admin",
        name: "Usuario Principal",
      };

      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem("miia_auth", JSON.stringify({ user: userData }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("miia_auth");
    clearToken();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isInitializing }}
    >
      {children}
    </AuthContext.Provider>
  );
};
