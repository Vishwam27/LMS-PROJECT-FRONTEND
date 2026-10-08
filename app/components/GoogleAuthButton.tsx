"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContent";

type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN";
type Status = "PENDING" | "APPROVED" | "REJECTED";

export type GoogleAuthUser = {
    role: Role;
    status: Status;
};

type GoogleAuthButtonProps = {
    onSuccess: (user: GoogleAuthUser) => void;
    onError?: (message: string) => void;
    label?: string;
    loadingLabel?: string;
    className?: string;
};

export default function GoogleAuthButton({
    onSuccess,
    onError,
    label = "Continue with Google",
    loadingLabel = "Connecting to Google...",
    className = "",
}: GoogleAuthButtonProps) {
    const { loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);

                const user = await loginWithGoogle(tokenResponse.access_token);
                onSuccess(user);
            } catch (error) {
                console.error("Google authentication error:", error);

                const message =
                    error instanceof Error
                        ? error.message
                        : "Google authentication failed.";

                onError?.(message);
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            const message = "Google login was cancelled or failed.";
            onError?.(message);
        },
    });

    return (
        <button
            type="button"
            onClick={() => googleLogin()}
            disabled={loading}
            className={`flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-base font-medium text-slate-800 transition-all hover:bg-slate-50 ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                } ${className}`}
        >
            <GoogleIcon />
            {loading ? loadingLabel : label}
        </button>
    );
}

function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true">
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
    );
}
