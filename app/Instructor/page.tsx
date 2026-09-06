"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


type User = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export default function InstructorPage() {
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAccess = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        router.replace("/");
        return;
      }

      try {
        const currentUser: User = JSON.parse(
          storedUser
        );

        // Must be an instructor
        if (currentUser.role !== "INSTRUCTOR") {
          router.replace("/");
          return;
        }

        // Instructor must be approved
        if (currentUser.status !== "APPROVED") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          router.replace("/");
          return;
        }

        setUser(currentUser);
        setCheckingAccess(false);
      } catch (error) {
        console.error(
          "Instructor access error:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.replace("/");
      }
    };

    checkAccess();
  }, [router]);

  if (checkingAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#6c3bff]" />

          <p className="mt-3 text-sm text-slate-500">
            Checking instructor access...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-[#0f1428]">
        Instructor Dashboard
      </h1>

      <p className="mt-2 text-slate-500">
        Welcome, {user.name}
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Role
        </p>

        <p className="mt-1 font-semibold text-[#0f1428]">
          {user.role}
        </p>

        <p className="mt-4 text-sm text-slate-500">
          Account Status
        </p>

        <p className="mt-1 font-semibold text-green-600">
          {user.status}
        </p>
      </div>
    </div>
  );
}