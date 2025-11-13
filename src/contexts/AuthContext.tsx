import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, confirmPassword: string, fullName: string, role: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string | null;
  address?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const token = localStorage.getItem("access");
    const storedUser = localStorage.getItem("user");
    
    // If we have a token and stored user data, use it directly
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }
    
    setLoading(false);
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/profile/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        throw new Error("Unauthorized — please sign in again.");
      }

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      signOut(); // Auto logout on failure
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, confirmPassword: string, fullName: string, role: string) => {
    const res = await fetch(`${BASE_URL}/api/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirm_password: confirmPassword, full_name: fullName, role }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Sign-up failed");
    }
  };

  const signIn = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/users/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Invalid credentials");
    }

    const data = await res.json();
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Set user directly from login response instead of fetching profile
    setUser(data.user);
  };

  const signOut = async () => {
    // Simply clear tokens from localStorage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    // Since there's no password reset endpoint, we'll just simulate success
    console.warn("Password reset not implemented on backend");
    // In a real app, you would make an API call here
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}