"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthPanel from "../components/AuthPanel";
import { useAuth } from "../context/AuthContent";
import BackendStatus from "../components/BackendStatus";
import GoogleAuthButton from "../components/GoogleAuthButton";


type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN";
type Status = "PENDING" | "APPROVED" | "REJECTED";

type AuthUser = {
  role: Role;
  status: Status;
};

export default function LoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const redirectUser = (user: AuthUser) => {
    if (user.role === "ADMIN") {
      router.replace("/AdminMaster");
      return;
    }

    if (user.role === "INSTRUCTOR") {
      if (user.status === "APPROVED") {
        router.replace("/Instructor/Dashboard");
        return;
      }

      if (user.status === "PENDING") {
        logout();
        throw new Error(
          "Your instructor account is pending admin approval.",
        );
      }
      logout();
      throw new Error(
        "Your instructor application was rejected. Please contact an administrator.",
      );
    }

    if (user.role === "STUDENT") {
      router.replace("/Learner/Dashboard");
      return;
    }
    logout();
    throw new Error("Unable to determine account access.");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(email.trim(), password);
      redirectUser(user);
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: `1.5px solid ${focusedField === field ? "#6c3bff" : "#e2e8f0"
      }`,
    background: focusedField === field ? "#faf8ff" : "#ffffff",
    fontSize: "15px",
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
      <BackendStatus />

      <div>
        <h1
          className="mb-1.5 text-3xl font-bold"
          style={{
            fontFamily: "Outfit, sans-serif",
            color: "#0f1428",
          }}
        >
          Welcome back
        </h1>

        <p className="mb-8 text-sm" style={{ color: "#64748b" }}>
          Sign in to continue your learning journey.
        </p>

        <div className="mb-6">
          <GoogleAuthButton
            onSuccess={redirectUser}
            onError={setError}
          />
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "#e2e8f0" }} />
          <span className="text-sm" style={{ color: "#94a3b8" }}>
            or sign in with email
          </span>
          <div className="h-px flex-1" style={{ background: "#e2e8f0" }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: "#374151" }}
            >
              Email address
            </label>

            <input
              type="email"
              placeholder="demo@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              style={inputStyle("email")}
              required
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{ color: "#374151" }}
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle("password"),
                  paddingRight: "50px",
                }}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 text-base font-semibold text-white transition-all"
            style={{
              background: loading
                ? "#a880ff"
                : "linear-gradient(135deg, #6c3bff 0%, #8a5fff 100%)",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading
                ? "none"
                : "0 4px 14px rgba(108,59,255,0.35)",
            }}
          >
            {loading ? "Signing in..." : "Sign in to CourseMaster"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm" style={{ color: "#64748b" }}>
          New to CourseMaster?{" "}
          <Link
            href="/Register"
            className="font-semibold"
            style={{
              color: "#6c3bff",
              textDecoration: "none",
            }}
          >
            Create a free account
          </Link>
        </p>
      </div>
    </AuthPanel>
  );
}
