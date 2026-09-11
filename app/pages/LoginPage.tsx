"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

import AuthPanel from "../components/AuthPanel";
import { useAuth } from "../context/AuthContent";

interface LoginPageProps {
  onSwitch: () => void;
}

export default function LoginPage({
  onSwitch,
}: LoginPageProps) {
  const router = useRouter();

  const {
    login,
    loginWithGoogle,
  } = useAuth();

  // =========================================================
  // STATE
  // =========================================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [focusedField, setFocusedField] =
    useState<string | null>(null);

  // =========================================================
  // ROLE BASED REDIRECT
  // =========================================================

  const redirectUser = (user: {
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
    status: "PENDING" | "APPROVED" | "REJECTED";
  }) => {
    if (user.role === "ADMIN") {
      router.replace("/AdminMaster");
      return;
    }

    if (
      user.role === "INSTRUCTOR" &&
      user.status === "APPROVED"
    ) {
      router.replace(
        "/Instructor/Dashboard"
      );
      return;
    }

    if (user.role === "STUDENT") {
      router.replace(
        "/Learner/Dashboard"
      );
      return;
    }

    throw new Error(
      "Unable to determine account access."
    );
  };

  // =========================================================
  // EMAIL LOGIN
  // =========================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const user = await login(
        email,
        password
      );

      redirectUser(user);
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        setError("");

        const user =
          await loginWithGoogle(
            tokenResponse.access_token
          );

        redirectUser(user);
      } catch (error) {
        console.error(
          "Google login error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Google login failed."
        );
      } finally {
        setGoogleLoading(false);
      }
    },

    onError: () => {
      setGoogleLoading(false);

      setError(
        "Google login was cancelled or failed."
      );
    },
  });

  // =========================================================
  // GOOGLE BUTTON
  // =========================================================

  const handleGoogleLogin = () => {
    setError("");
    googleLogin();
  };

  // =========================================================
  // INPUT STYLE
  // =========================================================

  const inputStyle = (
    field: string
  ): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",

    border: `1.5px solid ${
      focusedField === field
        ? "#6c3bff"
        : "#e2e8f0"
    }`,

    background:
      focusedField === field
        ? "#faf8ff"
        : "#ffffff",

    fontSize: "15px",
    color: "#0f1428",

    outline: "none",

    transition: "all 0.15s ease",

    fontFamily:
      "Inter, sans-serif",

    boxShadow:
      focusedField === field
        ? "0 0 0 3px rgba(108,59,255,0.1)"
        : "none",
  });

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <AuthPanel>
      <div>
        {/* HEADER */}

        <h1
          className="text-3xl font-bold mb-1.5"
          style={{
            fontFamily:
              "Outfit, sans-serif",
            color: "#0f1428",
          }}
        >
          Welcome back
        </h1>

        <p
          className="text-sm mb-8"
          style={{
            color: "#64748b",
          }}
        >
          Sign in to continue your
          learning journey.
        </p>

        {/* GOOGLE BUTTON */}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-base font-medium transition-all mb-6"
          style={{
            border:
              "1.5px solid #e2e8f0",

            background: "#ffffff",

            color: "#1e293b",

            cursor: googleLoading
              ? "not-allowed"
              : "pointer",

            opacity: googleLoading
              ? 0.7
              : 1,
          }}
        >
          {/* GOOGLE ICON */}

          <svg
            width="20"
            height="20"
            viewBox="0 0 18 18"
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

          {googleLoading
            ? "Connecting to Google..."
            : "Continue with Google"}
        </button>

        {/* DIVIDER */}

        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex-1 h-px"
            style={{
              background: "#e2e8f0",
            }}
          />

          <span
            className="text-sm"
            style={{
              color: "#94a3b8",
            }}
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

        {/* LOGIN FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* EMAIL */}

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#374151",
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

          {/* PASSWORD */}

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#374151",
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
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onFocus={() =>
                  setFocusedField(
                    "password"
                  )
                }
                onBlur={() =>
                  setFocusedField(null)
                }
                style={{
                  ...inputStyle("password"),
                  paddingRight: "50px",
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
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white text-base font-semibold transition-all"
            style={{
              background: loading
                ? "#a880ff"
                : "linear-gradient(135deg, #6c3bff 0%, #8a5fff 100%)",

              border: "none",

              cursor: loading
                ? "not-allowed"
                : "pointer",

              boxShadow: loading
                ? "none"
                : "0 4px 14px rgba(108,59,255,0.35)",
            }}
          >
            {loading
              ? "Signing in..."
              : "Sign in to CourseMaster"}
          </button>
        </form>

        {/* REGISTER */}

        <p
          className="text-center text-sm mt-7"
          style={{
            color: "#64748b",
          }}
        >
          New to CourseMaster?{" "}

          <button
            type="button"
            onClick={onSwitch}
            style={{
              color: "#6c3bff",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Create a free account
          </button>
        </p>
      </div>
    </AuthPanel>
  );
}