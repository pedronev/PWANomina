"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { AuthService } from "@/app/services/authService";
import type {
  User,
  LoginCredentials,
  AuthState,
  AuthContextType,
} from "@/app/types/auth";

// Actions
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "INIT_AUTH"; payload: User | null };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "INIT_AUTH":
      return {
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Storage keys
const USER_STORAGE_KEY = "auth-user";
const TOKEN_STORAGE_KEY = "auth-token";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [storedUser] = useLocalStorage<User | null>(USER_STORAGE_KEY, null);
  const [authToken] = useLocalStorage<string | null>(TOKEN_STORAGE_KEY, null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from storage - ejecutar de forma síncrona
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (storedUser && authToken) {
          // Verificar que el usuario sigue siendo válido
          const user = await AuthService.getUserById(storedUser.id);
          if (user) {
            dispatch({ type: "INIT_AUTH", payload: user });
          } else {
            // Usuario ya no válido
            dispatch({ type: "INIT_AUTH", payload: null });
          }
        } else {
          dispatch({ type: "INIT_AUTH", payload: null });
        }
      } catch (error) {
        console.error("Error inicializando auth:", error);
        dispatch({ type: "INIT_AUTH", payload: null });
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  // Login function usando AuthService
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      dispatch({ type: "LOGIN_START" });

      try {
        const user = await AuthService.login(credentials);

        if (!user) {
          throw new Error("Credenciales incorrectas");
        }

        // Generar token simple (en producción usar JWT)
        const token = `token-${user.id}-${Date.now()}`;

        // Guardar en localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
        }

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error de autenticación";
        dispatch({ type: "LOGIN_FAILURE", payload: message });
        return false;
      }
    },
    []
  );

  // Logout function
  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    dispatch({ type: "LOGOUT" });
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  // No renderizar nada hasta que se haya inicializado
  if (!isInitialized) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
