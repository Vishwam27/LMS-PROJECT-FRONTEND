"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";

export interface User {
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
interface AuthResponse {
  token?: string;
  user?: User;
  message?: string;
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

// =========================================================
// LOCAL STORAGE SESSION STORE
// ---------------------------------------------------------
// The login session lives in localStorage ("token" + "user").
// React reads it with useSyncExternalStore, the recommended
// way to read browser storage. It is safe for server
// rendering and avoids calling setState inside an effect.
// =========================================================

const TOKEN_KEY = "token";
const USER_KEY = "user";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);

  // "storage" fires when ANOTHER tab changes localStorage
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // Storage can be blocked (private mode, etc.)
    return null;
  }
}

const getStoredToken = () => readStorage(TOKEN_KEY);
const getStoredUser = () => readStorage(USER_KEY);

// On the server there is no localStorage
const getServerSnapshot = (): string | null => null;

// "loading" is true on the server and while hydrating,
// and becomes false as soon as the browser has taken over
const subscribeToNothing = () => () => {};
const getLoadedSnapshot = () => false;
const getLoadingServerSnapshot = () => true;

type StoredSession =
  | { status: "empty" }
  | { status: "valid"; token: string; user: User }
  | { status: "corrupted"; error: unknown };

function parseStoredSession(
  token: string | null,
  rawUser: string | null
): StoredSession {
  if (!token || !rawUser) {
    return { status: "empty" };
  }

  try {
    return {
      status: "valid",
      token,
      user: JSON.parse(rawUser) as User,
    };
  } catch (error) {
    return { status: "corrupted", error };
  }
}

// =========================================================
// SAVE / CLEAR AUTH SESSION
// =========================================================

function saveAuthSession(
  authToken: string,
  authUser: User
) {
  localStorage.setItem(
    TOKEN_KEY,
    authToken
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(authUser)
  );

  notifyListeners();
}

function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  notifyListeners();
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  // =========================================================
  // RESTORE LOGIN AFTER PAGE REFRESH
  // =========================================================

  const storedToken = useSyncExternalStore(
    subscribe,
    getStoredToken,
    getServerSnapshot
  );

  const storedUser = useSyncExternalStore(
    subscribe,
    getStoredUser,
    getServerSnapshot
  );

  const loading = useSyncExternalStore(
    subscribeToNothing,
    getLoadedSnapshot,
    getLoadingServerSnapshot
  );

  const session = useMemo(
    () =>
      parseStoredSession(
        storedToken,
        storedUser
      ),
    [storedToken, storedUser]
  );

  const user =
    session.status === "valid"
      ? session.user
      : null;

  const token =
    session.status === "valid"
      ? session.token
      : null;

  // Saved login data is broken (not valid JSON) -> clear it
  useEffect(() => {
    if (session.status === "corrupted") {
      console.error(
        "Failed to restore authentication:",
        session.error
      );

      clearAuthSession();
    }
  }, [session]);

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

      let data: AuthResponse | null = null;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from server."
        );
      }

      if (!response.ok) {
        clearAuthSession();

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

      let data: AuthResponse | null = null;

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
    clearAuthSession();
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