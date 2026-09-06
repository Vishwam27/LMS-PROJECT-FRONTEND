"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Instructor = {
  id: string;
  name: string;
  email: string;
  role: "INSTRUCTOR";
  status: "PENDING";
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
};

type PendingResponse = {
  instructors: Instructor[];
  total: number;
};

type ActionType = "APPROVE" | "REJECT";

export default function AdminInstructorsPage() {
  const router = useRouter();

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);

  const [actionType, setActionType] =
    useState<ActionType | null>(null);

  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState("");

  // =========================================================
  // FETCH PENDING INSTRUCTORS
  // =========================================================

  const fetchPendingInstructors = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        router.replace("/");
        return;
      }

      let currentUser;

      try {
        currentUser = JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
        return;
      }

      // Frontend protection
      if (currentUser.role !== "ADMIN") {
        setError(
          "You do not have permission to access this page."
        );
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/instructors/pending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
        return;
      }

      if (response.status === 403) {
        setError(
          "You do not have permission to access this page."
        );
        return;
      }

      const data: PendingResponse & {
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load pending instructors"
        );
      }

      setInstructors(data.instructors);
    } catch (error) {
      console.error(
        "Pending instructors error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load pending instructors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingInstructors();
  }, []);

  // =========================================================
  // OPEN ACTION MODAL
  // =========================================================

  const openActionModal = (
    instructor: Instructor,
    action: ActionType
  ) => {
    setSelectedInstructor(instructor);
    setActionType(action);
    setActionError("");
  };

  // =========================================================
  // HANDLE APPROVE / REJECT
  // =========================================================

  const handleAction = async () => {
    if (!selectedInstructor || !actionType) {
      return;
    }

    try {
      setProcessing(true);
      setActionError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const action =
        actionType === "APPROVE"
          ? "approve"
          : "reject";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/instructors/${selectedInstructor.id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
        return;
      }

      if (response.status === 403) {
        setActionError(
          "You do not have permission to perform this action."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update instructor"
        );
      }

      // Remove from pending list
      setInstructors((current) =>
        current.filter(
          (instructor) =>
            instructor.id !== selectedInstructor.id
        )
      );

      setSelectedInstructor(null);
      setActionType(null);
    } catch (error) {
      console.error(
        "Instructor action error:",
        error
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update instructor"
      );
    } finally {
      setProcessing(false);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#6c3bff]" />

          <p className="mt-3 text-sm text-slate-500">
            Loading instructor requests...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            🔒
          </div>

          <h1
            className="mt-5 text-xl font-bold text-[#0f1428]"
            style={{
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Access Denied
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={() => router.push("/AdminMaster")}
            className="mt-6 rounded-xl bg-[#6c3bff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5d32e8]"
          >
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div>
            <button
              onClick={() => router.push("/AdminMaster")}
              className="mb-2 text-xs font-semibold text-[#6c3bff]"
            >
              ← Back to Admin
            </button>

            <h1
              className="text-2xl font-bold text-[#0f1428] sm:text-3xl"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Instructor Requests
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review and manage instructor applications.
            </p>
          </div>

          <div className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-[#6c3bff]">
            ADMIN
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* Summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-400">
              Pending Requests
            </p>

            <p
              className="mt-2 text-3xl font-bold text-[#6c3bff]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {instructors.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-400">
              Awaiting Review
            </p>

            <p
              className="mt-2 text-3xl font-bold text-orange-500"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {instructors.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-400">
              Account Type
            </p>

            <p
              className="mt-2 text-lg font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Instructor
            </p>
          </div>
        </section>

        {/* Requests */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">

          {/* Section heading */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
            <div>
              <h2
                className="text-lg font-bold text-[#0f1428]"
                style={{
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                Pending Applications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Approve trusted instructors or reject
                applications you do not want to accept.
              </p>
            </div>

            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
              {instructors.length} Pending
            </span>
          </div>

          {/* Empty */}
          {instructors.length === 0 ? (
            <div className="px-6 py-16 text-center sm:px-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl">
                ✓
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-700">
                No pending instructor requests
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                You're all caught up. New instructor
                applications will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                        Instructor
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                        Email
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                        Applied
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {instructors.map((instructor) => (
                      <tr
                        key={instructor.id}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        {/* Instructor */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {instructor.avatarUrl ? (
                              <img
                                src={instructor.avatarUrl}
                                alt={instructor.name}
                                className="h-11 w-11 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-bold text-orange-600">
                                {instructor.name
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#0f1428]">
                                {instructor.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                Instructor applicant
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-5 text-sm text-slate-600">
                          {instructor.email}
                        </td>

                        {/* Applied */}
                        <td className="px-6 py-5 text-sm text-slate-500">
                          {formatDate(
                            instructor.createdAt
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                            Pending
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                openActionModal(
                                  instructor,
                                  "REJECT"
                                )
                              }
                              className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                            >
                              Reject
                            </button>

                            <button
                              onClick={() =>
                                openActionModal(
                                  instructor,
                                  "APPROVE"
                                )
                              }
                              className="rounded-xl bg-green-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
                            >
                              Approve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-100 md:hidden">
                {instructors.map((instructor) => (
                  <article
                    key={instructor.id}
                    className="p-5"
                  >
                    <div className="flex items-start gap-3">
                      {instructor.avatarUrl ? (
                        <img
                          src={instructor.avatarUrl}
                          alt={instructor.name}
                          className="h-12 w-12 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-bold text-orange-600">
                          {instructor.name
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#0f1428]">
                              {instructor.name}
                            </p>

                            <p className="mt-1 break-all text-xs text-slate-500">
                              {instructor.email}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600">
                            Pending
                          </span>
                        </div>

                        <p className="mt-3 text-xs text-slate-400">
                          Applied{" "}
                          {formatDate(
                            instructor.createdAt
                          )}
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button
                            onClick={() =>
                              openActionModal(
                                instructor,
                                "REJECT"
                              )
                            }
                            className="rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            Reject
                          </button>

                          <button
                            onClick={() =>
                              openActionModal(
                                instructor,
                                "APPROVE"
                              )
                            }
                            className="rounded-xl bg-green-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-green-600"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Security note */}
        <section className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">
          <div className="flex items-start gap-3">
            <div className="text-lg">🔐</div>

            <div>
              <h3 className="text-sm font-bold text-[#0f1428]">
                Instructor approval is admin-only
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Instructor applications can only be
                approved or rejected by an authenticated
                admin account. The backend verifies the
                ADMIN role for every action.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          APPROVE / REJECT CONFIRMATION MODAL
      ====================================================== */}

      {selectedInstructor && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                actionType === "APPROVE"
                  ? "bg-green-50"
                  : "bg-red-50"
              }`}
            >
              {actionType === "APPROVE"
                ? "✓"
                : "⚠️"}
            </div>

            <h2
              className="mt-5 text-lg font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {actionType === "APPROVE"
                ? "Approve Instructor"
                : "Reject Instructor"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {actionType === "APPROVE"
                ? "Are you sure you want to approve"
                : "Are you sure you want to reject"}{" "}
              <span className="font-semibold text-slate-800">
                {selectedInstructor.name}
              </span>
              ?
            </p>

            <div
              className={`mt-4 rounded-xl border px-4 py-3 ${
                actionType === "APPROVE"
                  ? "border-green-100 bg-green-50"
                  : "border-red-100 bg-red-50"
              }`}
            >
              <p
                className={`text-xs leading-5 ${
                  actionType === "APPROVE"
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {actionType === "APPROVE"
                  ? "This instructor will be allowed to log in and create/manage courses."
                  : "This instructor will remain blocked from logging in."}
              </p>
            </div>

            {actionError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {actionError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  if (processing) return;

                  setSelectedInstructor(null);
                  setActionType(null);
                  setActionError("");
                }}
                disabled={processing}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleAction}
                disabled={processing}
                className={
                  actionType === "APPROVE"
                    ? "rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                    : "rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                }
              >
                {processing
                  ? "Processing..."
                  : actionType === "APPROVE"
                    ? "Approve Instructor"
                    : "Reject Instructor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}