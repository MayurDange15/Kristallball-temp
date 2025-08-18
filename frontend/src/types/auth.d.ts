export type UserRole = "admin" | "commander" | "logistics";

export interface User {
  _id: string;
  username: string;
  role: UserRole;
  base?: string; // commander/logistics tied to a base
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
