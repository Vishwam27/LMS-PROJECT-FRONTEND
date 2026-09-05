"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthPanel from "../components/AuthPanel";
import { useAuth } from "../context/AuthContent";

interface LoginPageProps {
  onSwitch: () => void;
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

  // Defer fully until after hydration finishes
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login) return; // safety boundary guard

    setLoading(true);
    setError("");
    try {
      await login(email, password);

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        throw new Error(
          "Incorrect email address or password. Please try again."
        );
      }

      let user;

      try {
        user = JSON.parse(storedUser);
      } catch {
        throw new Error(
          "Unable to read user information."
        );
      }

      if (user.role === "ADMIN") {
        router.replace("/AdminMaster");
        return;
      }

      if (
        user.role === "INSTRUCTOR" &&
        user.status === "APPROVED"
      ) {
        router.replace("/Instructor/Dashboard");
        return;
      }

      if (user.role === "STUDENT") {
        router.replace("/Learner/Dashboard");
        return;
      }

      throw new Error("Unknown account role.");
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setError(
        error instanceof Error
          ? error.message
          : "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    // Google OAuth will be connected here
    console.log("Google login clicked");
  };

  const inputStyle = (field: string) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1.5px solid ${
      focusedField === field
        ? "#6c3bff"
        : "#e2e8f0"
    }`,
    background:
      focusedField === field
        ? "#faf8ff"
        : "white",
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

        <h1
          className="text-3xl font-bold mb-1.5"
          style={{
            fontFamily: "Outfit, sans-serif",
            color: "#0f1428",
          }}
        >
          Welcome 
        </h1>

        <p
          className="text-sm mb-8"
          style={{ color: "#64748b" }}
        >
          Sign in to continue your learning journey.
        </p>

        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              border: "1.5px solid #e2e8f0",
              background: "white",
              color: "#1e293b",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "#6c3bff";

              e.currentTarget.style.background =
                "#faf8ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "#e2e8f0";

              e.currentTarget.style.background =
                "white";
            }}
          >
            {/* Google Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
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
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex-1 h-px"
            style={{
              background: "#e2e8f0",
            }}
          />

          <span
            className="text-xs"
            style={{ color: "#94a3b8" }}
          >
            or sign in with email
          </span>

          <div
            className="flex-1 h-px"
            style={{
              background: "#e2e8f0",
            }}
          />
        </div>

        {/* =========================
            LOGIN FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{
                color: "#374151",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Email address
            </label>

            <input
              type="email"
              placeholder="demo@company.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              onFocus={() =>
                setFocusedField("email")
              }
              onBlur={() =>
                setFocusedField(null)
              }
              style={inputStyle("email")}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{
                color: "#374151",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onFocus={() =>
                  setFocusedField("password")
                }
                onBlur={() =>
                  setFocusedField(null)
                }
                style={{
                  ...inputStyle("password"),
                  paddingRight: 44,
                }}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
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
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all mt-2"
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
          className="text-center text-sm mt-6"
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
      }to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </AuthPanel>
  );
}