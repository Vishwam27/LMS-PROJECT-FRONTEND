"use client";

import { useEffect, useState } from "react";

export default function BackendStatus() {
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
          controller.abort();
        }, 5000);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/health`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        clearTimeout(timeout);

        if (response.ok) {
          setBackendDown(false);
        } else {
          setBackendDown(true);
        }
      } catch (error) {
        console.error("Backend health check failed:", error);
        setBackendDown(true);
      }
    };

    // Check when page loads
    checkBackend();

    // Check again every 30 seconds
    const interval = setInterval(checkBackend, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!backendDown) {
    return null;
  }

  return (
    <div className="fixed left-1/2 top-4 z-[9999] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2">
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 shadow-lg">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
          <span className="text-lg">⚠️</span>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-red-700">
            Backend unavailable
          </h3>

          <p className="mt-1 text-xs leading-5 text-red-600">
            The server is currently unavailable or under maintenance.
            Please try again later.
          </p>
        </div>
      </div>
    </div>
  );
}