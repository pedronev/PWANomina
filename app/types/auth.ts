export interface User {
  readonly id: string;
  readonly nombre: string;
  readonly username: string;
  readonly area_id: string | null;
  readonly activo: boolean;
  readonly ultimo_acceso: string | null;
}

export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

export interface AuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
}

export interface AuthContextType extends AuthState {
  readonly login: (credentials: LoginCredentials) => Promise<boolean>;
  readonly logout: () => void;
  readonly clearError: () => void;
}
