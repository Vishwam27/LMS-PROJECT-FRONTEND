"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthPanel from "../components/AuthPanel";
import { useAuth } from "../context/AuthContent";

interface LoginPageProps {
  onSwitch: () => void;
}
interface LoggedInUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}
interface LoginResponse {
  user?: LoggedInUser;
  token?: string;
}

export default function LoginPage({
  onSwitch,
}: LoginPageProps) {
  const router = useRouter();
  const authContext = useAuth();
  const login = authContext?.login;

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
      </div>
    );
  }

  const getStoredUser = (): LoggedInUser | null => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser || typeof parsedUser !== "object") {
        return null;
      }

      return parsedUser;
    } catch (error) {
      console.error("Unable to read stored user:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login) {
      setError("Login service is currently unavailable.");
      return;
    }

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * login() should return the login response.
       *
       * Example:
       * {
       *   user: {
       *     role: "INSTRUCTOR",
       *     status: "PENDING"
       *   },
       *   token: "..."
       * }
       */
      const response = (await login(
        cleanEmail,
        password
      )) as LoginResponse | LoggedInUser | void;

      let user: LoggedInUser | null = null;

      /*
       * 1. Prefer user returned by login()
       */
      if (
        response &&
        typeof response === "object" &&
        "user" in response &&
        response.user
      ) {
        user = response.user;
      }

      /*
       * 2. Support a login() implementation that
       * directly returns the user object.
       */
      if (
        !user &&
        response &&
        typeof response === "object" &&
        "role" in response
      ) {
        user = response as LoggedInUser;
      }

      /*
       * 3. Fallback to localStorage.
       */
      if (!user) {
        user = getStoredUser();
      }

      /*
       * Do NOT show "stored user missing" here.
       *
       * The login request itself may have succeeded even
       * when your AuthContext does not save the user object.
       */
      if (!user) {
        throw new Error(
          "Login succeeded, but account information could not be loaded. Please try again."
        );
      }

      /*
       * =========================
       * ADMIN
       * =========================
       */
      if (user.role === "ADMIN") {
        router.replace("/AdminMaster");
        return;
      }

      /*
       * =========================
       * INSTRUCTOR
       * =========================
       */
      if (user.role === "INSTRUCTOR") {
        const status = String(user.status || "").toUpperCase();

        if (status === "APPROVED") {
          router.replace("/Instructor/Dashboard");
          return;
        }

        if (status === "PENDING") {
          throw new Error(
            "Your instructor account is pending approval. Please wait for an administrator to approve your account."
          );
        }

        if (status === "REJECTED") {
          throw new Error(
            "Your instructor account has been rejected. Please contact the administrator."
          );
        }

        if (status === "SUSPENDED") {
          throw new Error(
            "Your instructor account has been suspended. Please contact the administrator."
          );
        }

        throw new Error(
          "Your instructor account is not currently available. Please contact the administrator."
        );
      }

      /*
       * =========================
       * STUDENT
       * =========================
       */
      if (user.role === "STUDENT") {
        router.replace("/Learner/Dashboard");
        return;
      }

      /*
       * =========================
       * UNKNOWN ROLE
       * =========================
       */
      throw new Error(
        "Unable to determine your account type. Please contact support."
      );
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setError(
        error instanceof Error
          ? error.message
          : "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const inputStyle = (field: string) => ({
    width: "100%",
    padding: "12px 14px",
    paddingRight: field === "password" ? 44 : 14,
    borderRadius: 10,
    border: `1.5px solid ${
      focusedField === field ? "#6c3bff" : "#e2e8f0"
    }`,
    background:
      focusedField === field ? "#faf8ff" : "white",
    fontSize: 15,
    color: "#0f1428",
    outline: "none",
    transition: "all 0.15s ease",
    fontFamily: "Inter, sans-serif",
    boxShadow:
      focusedField === field
        ? "0 0 0 3px rgba(108,59,255,0.1)"
        : "none",
  });

  return (
    <AuthPanel>
      <div>
        {/* Header */}
        <h1
          className="mb-1.5 text-3xl font-bold"
          style={{
            fontFamily: "Outfit, sans-serif",
            color: "#0f1428",
          }}
        >
          Welcome
        </h1>

        <p
          className="mb-8 text-sm"
          style={{ color: "#64748b" }}
        >
          Sign in to continue your learning journey.
        </p>

        {/* Google */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl py-2.5 text-sm font-medium transition-all"
            style={{
              border: "1.5px solid #e2e8f0",
              background: "white",
              color: "#1e293b",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#6c3bff";
              e.currentTarget.style.background = "#faf8ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.background = "white";
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 .957 13l3.007-2.29Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
                fill="#EA4335"
              />
            </svg>

            Google
          </button>
        </div>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="h-px flex-1"
            style={{ background: "#e2e8f0" }}
          />

          <span
            className="text-xs"
            style={{ color: "#94a3b8" }}
          >
            or sign in with email
          </span>

          <div
            className="h-px flex-1"
            style={{ background: "#e2e8f0" }}
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium"
              style={{
                color: "#374151",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="demo@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              style={inputStyle("email")}
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
              style={{
                color: "#374151",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                onFocus={() =>
                  setFocusedField("password")
                }
                onBlur={() =>
                  setFocusedField(null)
                }
                style={inputStyle("password")}
                disabled={loading}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: loading
                    ? "default"
                    : "pointer",
                  color: "#94a3b8",
                  padding: 4,
                }}
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                    />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-lg px-4 py-3 text-sm"
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all"
            style={{
              background: loading
                ? "#a880ff"
                : "linear-gradient(135deg, #6c3bff 0%, #8a5fff 100%)",
              border: "none",
              cursor: loading
                ? "default"
                : "pointer",
              fontFamily: "Inter, sans-serif",
              boxShadow: loading
                ? "none"
                : "0 4px 14px rgba(108,59,255,0.35)",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(108,59,255,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(108,59,255,0.35)";
              }
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{
                    animation:
                      "spin 0.8s linear infinite",
                  }}
                  aria-hidden="true"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l-2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign in to CourseMaster"
            )}
          </button>
        </form>

        {/* Register */}
        <p
          className="mt-6 text-center text-sm"
          style={{ color: "#64748b" }}
        >
          New to CourseMaster?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold"
            style={{
              color: "#6c3bff",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create a free account
          </button>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </AuthPanel>
  );
}