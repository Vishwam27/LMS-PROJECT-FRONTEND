
"use client";

import {
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

import AuthPanel from "../components/AuthPanel";

interface RegisterPageProps {
  onSwitch: () => void;
}

type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN";

const ROLES: {
  id: Role;
  label: string;
  icon: string;
}[] = [
  {
    id: "STUDENT",
    label: "Learner",
    icon: "🎓",
  },
  {
    id: "INSTRUCTOR",
    label: "Instructor",
    icon: "🧑‍🏫",
  },
  {
    id: "ADMIN",
    label: "Admin",
    icon: "⚙️",
  },
];

export default function RegisterPage({
  onSwitch,
}: RegisterPageProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const [role, setRole] = useState<Role>("STUDENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);
  const [agreed, setAgreed] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] =
    useState<string | null>(null);

  // -----------------------------
  // Password validation
  // -----------------------------

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_]/.test(password),
  };

  const isPasswordValid =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number &&
    passwordChecks.special;

  const passwordScore = [
    passwordChecks.length,
    passwordChecks.uppercase,
    passwordChecks.lowercase,
    passwordChecks.number,
    passwordChecks.special,
  ].filter(Boolean).length;

  const getStrength = () => {
    if (!password) {
      return {
        label: "",
        color: "#94a3b8",
      };
    }

    if (passwordScore <= 2) {
      return {
        label: "Weak",
        color: "#ef4444",
      };
    }

    if (passwordScore === 3) {
      return {
        label: "Fair",
        color: "#f59e0b",
      };
    }

    if (passwordScore === 4) {
      return {
        label: "Good",
        color: "#22c55e",
      };
    }

    return {
      label: "Strong",
      color: "#16a34a",
    };
  };

  const strength = getStrength();

  // -----------------------------
  // Input styling
  // -----------------------------

  const getInputStyle = (
    field: string
  ): CSSProperties => {
    const isFocused = focusedField === field;

    return {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 10,
      border: `1.5px solid ${
        isFocused ? "#6c3bff" : "#e2e8f0"
      }`,
      background: isFocused ? "#faf8ff" : "#ffffff",
      fontSize: 15,
      color: "#0f1428",
      outline: "none",
      transition: "all 0.15s ease",
      fontFamily: "Inter, sans-serif",
      boxShadow: isFocused
        ? "0 0 0 3px rgba(108,59,255,0.1)"
        : "none",
    };
  };

  // -----------------------------
  // Step 1
  // -----------------------------

  const handleNext = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirstName) {
      setError("Please enter your first name.");
      return;
    }

    if (!trimmedLastName) {
      setError("Please enter your last name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    setStep(2);
  };

  // -----------------------------
  // Step 2
  // -----------------------------

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError(
        "Please meet all password requirements."
      );
      return;
    }

    if (!agreed) {
      setError(
        "Please agree to the Terms of Service."
      );
      return;
    }

    try {
      setLoading(true);

      const fullName =
        `${firstName.trim()} ${lastName.trim()}`.trim();

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured."
        );
      }

      const response = await fetch(
        `${apiUrl}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName,
            email: email.trim(),
            password,
            role,
            termsAccepted: true,
          }),
        }
      );

      const data: {
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create account."
        );
      }

      onSwitch();
    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <AuthPanel>
      <div>
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "#6c3bff",
              color: "#ffffff",
            }}
          >
            {step === 2 ? "✓" : "1"}
          </div>

          <div
            className="w-12 h-0.5 rounded-full"
            style={{
              background:
                step === 2
                  ? "#6c3bff"
                  : "#e2e8f0",
            }}
          />

          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background:
                step === 2
                  ? "#6c3bff"
                  : "#e2e8f0",
              color:
                step === 2
                  ? "#ffffff"
                  : "#94a3b8",
            }}
          >
            2
          </div>

          <span
            className="text-xs ml-1"
            style={{
              color: "#94a3b8",
            }}
          >
            Step {step} of 2
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-3xl font-bold mb-1.5"
          style={{
            fontFamily: "Outfit, sans-serif",
            color: "#0f1428",
          }}
        >
          {step === 1
            ? "Create your account"
            : "Set your password"}
        </h1>

        <p
          className="text-sm mb-6"
          style={{
            color: "#64748b",
          }}
        >
          {step === 1
            ? "Join CourseMaster and start your learning journey."
            : "Almost there — just a few more details."}
        </p>

        {/* Error */}
        {error && (
          <div
            className="mb-5 rounded-xl px-4 py-3 text-sm"
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
            }}
          >
            {error}
          </div>
        )}

        {/* =========================
            STEP 1
        ========================== */}
        {step === 1 && (
          <form
            onSubmit={handleNext}
            className="space-y-4"
          >
            {/* Role */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{
                  color: "#374151",
                }}
              >
                I want to join as
              </label>

              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((item) => {
                  const selected =
                    role === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setRole(item.id)
                      }
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-center transition-all"
                      style={{
                        border: `1.5px solid ${
                          selected
                            ? "#6c3bff"
                            : "#e2e8f0"
                        }`,
                        background: selected
                          ? "#faf8ff"
                          : "#ffffff",
                        cursor: "pointer",
                        boxShadow: selected
                          ? "0 0 0 3px rgba(108,59,255,0.1)"
                          : "none",
                      }}
                    >
                      <span className="text-xl">
                        {item.icon}
                      </span>

                      <span
                        className="text-xs font-semibold"
                        style={{
                          color: selected
                            ? "#6c3bff"
                            : "#374151",
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{
                    color: "#374151",
                  }}
                >
                  First name
                </label>

                <input
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(
                      event.target.value
                    )
                  }
                  onFocus={() =>
                    setFocusedField("first")
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                  style={getInputStyle("first")}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{
                    color: "#374151",
                  }}
                >
                  Last name
                </label>

                <input
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(
                      event.target.value
                    )
                  }
                  onFocus={() =>
                    setFocusedField("last")
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                  style={getInputStyle("last")}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
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
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                onFocus={() =>
                  setFocusedField("email")
                }
                onBlur={() =>
                  setFocusedField(null)
                }
                style={getInputStyle("email")}
                required
              />
            </div>

            {/* Continue */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-white text-sm font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, #6c3bff 0%, #8a5fff 100%)",
                border: "none",
                cursor: "pointer",
                boxShadow:
                  "0 4px 14px rgba(108,59,255,0.35)",
              }}
            >
              Continue →
            </button>
          </form>
        )}

        {/* =========================
            STEP 2
        ========================== */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{
                  color: "#374151",
                }}
              >
                Create password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  onFocus={() =>
                    setFocusedField("password")
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                  style={{
                    ...getInputStyle("password"),
                    paddingRight: 48,
                  }}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    fontSize: 16,
                  }}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              {/* Password feedback */}
              {password.length > 0 && (
                <div
                  className="mt-3 rounded-xl p-3 text-xs space-y-1.5"
                  style={{
                    background: "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-medium"
                      style={{
                        color: "#64748b",
                      }}
                    >
                      Password strength
                    </span>

                    <span
                      className="font-semibold"
                      style={{
                        color: strength.color,
                      }}
                    >
                      {strength.label}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-2"
                    style={{
                      color:
                        passwordChecks.length
                          ? "#16a34a"
                          : "#94a3b8",
                    }}
                  >
                    <span>
                      {passwordChecks.length
                        ? "✓"
                        : "○"}
                    </span>
                    <span>
                      At least 8 characters
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-2"
                    style={{
                      color:
                        passwordChecks.uppercase
                          ? "#16a34a"
                          : "#94a3b8",
                    }}
                  >
                    <span>
                      {passwordChecks.uppercase
                        ? "✓"
                        : "○"}
                    </span>
                    <span>
                      One uppercase letter
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-2"
                    style={{
                      color:
                        passwordChecks.lowercase
                          ? "#16a34a"
                          : "#94a3b8",
                    }}
                  >
                    <span>
                      {passwordChecks.lowercase
                        ? "✓"
                        : "○"}
                    </span>
                    <span>
                      One lowercase letter
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-2"
                    style={{
                      color:
                        passwordChecks.number
                          ? "#16a34a"
                          : "#94a3b8",
                    }}
                  >
                    <span>
                      {passwordChecks.number
                        ? "✓"
                        : "○"}
                    </span>
                    <span>
                      One number
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-2"
                    style={{
                      color:
                        passwordChecks.special
                          ? "#16a34a"
                          : "#94a3b8",
                    }}
                  >
                    <span>
                      {passwordChecks.special
                        ? "✓"
                        : "○"}
                    </span>
                    <span>
                      One special character
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5">
              <button
                type="button"
                onClick={() =>
                  setAgreed(
                    (current) => !current
                  )
                }
                className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  border: `2px solid ${
                    agreed
                      ? "#6c3bff"
                      : "#cbd5e1"
                  }`,
                  background: agreed
                    ? "#6c3bff"
                    : "#ffffff",
                }}
                aria-label="Agree to terms"
              >
                {agreed && (
                  <span className="text-white text-xs">
                    ✓
                  </span>
                )}
              </button>

              <span
                className="text-sm"
                style={{
                  color: "#64748b",
                  lineHeight: 1.5,
                }}
              >
                I agree to CourseMaster's{" "}
                <span
                  style={{
                    color: "#6c3bff",
                  }}
                >
                  Terms of Service
                </span>{" "}
                and{" "}
                <span
                  style={{
                    color: "#6c3bff",
                  }}
                >
                  Privacy Policy
                </span>
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(1);
                }}
                className="shrink-0 px-5 py-3.5 rounded-xl text-sm font-semibold"
                style={{
                  border:
                    "1.5px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  !agreed ||
                  !isPasswordValid
                }
                className="flex-1 py-3.5 rounded-xl text-white text-sm font-semibold"
                style={{
                  background:
                    loading ||
                    !agreed ||
                    !isPasswordValid
                      ? "#c4b5fd"
                      : "linear-gradient(135deg, #6c3bff 0%, #8a5fff 100%)",
                  border: "none",
                  cursor:
                    loading ||
                    !agreed ||
                    !isPasswordValid
                      ? "not-allowed"
                      : "pointer",
                  boxShadow:
                    loading ||
                    !agreed ||
                    !isPasswordValid
                      ? "none"
                      : "0 4px 14px rgba(108,59,255,0.35)",
                }}
              >
                {loading
                  ? "Creating account..."
                  : "Create my account"}
              </button>
            </div>
          </form>
        )}

        {/* Login */}
        <p
          className="text-center text-sm mt-6"
          style={{
            color: "#64748b",
          }}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold"
            style={{
              color: "#6c3bff",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthPanel>
  );
}

