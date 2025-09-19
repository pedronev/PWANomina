"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
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
  | { type: "SET_LOADING"; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
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
  isLoading: true, // Empezar en true para verificar sesión existente
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
  const [storedUser, setStoredUser] = useLocalStorage<User | null>(
    USER_STORAGE_KEY,
    null
  );
  const [authToken, setAuthToken] = useLocalStorage<string | null>(
    TOKEN_STORAGE_KEY,
    null
  );

  // Initialize from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (storedUser && authToken) {
          // Verificar que el usuario sigue siendo válido
          const user = await AuthService.getUserById(storedUser.id);
          if (user) {
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
          } else {
            // Usuario ya no válido, limpiar storage
            setStoredUser(null);
            setAuthToken(null);
            dispatch({ type: "LOGOUT" });
          }
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Error inicializando auth:", error);
        setStoredUser(null);
        setAuthToken(null);
        dispatch({ type: "LOGOUT" });
      }
    };

    initializeAuth();
  }, [storedUser, authToken, setStoredUser, setAuthToken]);

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
        setStoredUser(user);
        setAuthToken(token);

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error de autenticación";
        dispatch({ type: "LOGIN_FAILURE", payload: message });
        return false;
      }
    },
    [setStoredUser, setAuthToken]
  );

  // Logout function
  const logout = useCallback(() => {
    setStoredUser(null);
    setAuthToken(null);
    dispatch({ type: "LOGOUT" });
  }, [setStoredUser, setAuthToken]);

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
