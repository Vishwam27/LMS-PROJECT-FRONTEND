"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
  avatarUrl?: string | null;
  bio?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<User>;

  // Google Login
  loginWithGoogle: (
    credential: string
  ) => Promise<User>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // RESTORE LOGIN AFTER PAGE REFRESH
  // =========================================================

  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem("token");

      const storedUser =
        localStorage.getItem("user");

      if (storedToken && storedUser) {
        const parsedUser: User =
          JSON.parse(storedUser);

        setToken(storedToken);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error(
        "Failed to restore authentication:",
        error
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // SAVE AUTH SESSION
  // =========================================================

  const saveAuthSession = (
    authToken: string,
    authUser: User
  ) => {
    localStorage.setItem(
      "token",
      authToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(authUser)
    );

    setToken(authToken);
    setUser(authUser);
  };

  // =========================================================
  // EMAIL LOGIN
  // =========================================================

  const login = async (
    email: string,
    password: string
  ): Promise<User> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from server."
        );
      }

      if (!response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);

        throw new Error(
          data?.message || "Unable to login."
        );
      }

      if (!data?.token || !data?.user) {
        throw new Error(
          "Invalid login response from server."
        );
      }

      const loggedInUser: User =
        data.user;

      saveAuthSession(
        data.token,
        loggedInUser
      );

      return loggedInUser;
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        "Unable to login. Please try again."
      );
    }
  };

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  const loginWithGoogle = async (
    credential: string
  ): Promise<User> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            credential,
          }),
        }
      );

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from server."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Google login failed."
        );
      }

      if (!data?.token || !data?.user) {
        throw new Error(
          "Invalid Google login response."
        );
      }

      const googleUser: User =
        data.user;

      saveAuthSession(
        data.token,
        googleUser
      );

      return googleUser;
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        "Google login failed. Please try again."
      );
    }
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    const minLength = 8;

    const hasUpperCase =
      /[A-Z]/.test(password);

    const hasLowerCase =
      /[a-z]/.test(password);

    const hasNumber =
      /[0-9]/.test(password);

    const hasSpecialChar =
      /[!@#$%^&*(),.?":{}|<>_]/.test(
        password
      );

    if (password.length < minLength) {
      throw new Error(
        `Password must be at least ${minLength} characters long.`
      );
    }

    if (!hasUpperCase) {
      throw new Error(
        "Password must include at least one uppercase letter."
      );
    }

    if (!hasLowerCase) {
      throw new Error(
        "Password must include at least one lowercase letter."
      );
    }

    if (!hasNumber) {
      throw new Error(
        "Password must include at least one number."
      );
    }

    if (!hasSpecialChar) {
      throw new Error(
        "Password must include at least one special character."
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: "STUDENT",
          termsAccepted: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Registration failed"
      );
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}