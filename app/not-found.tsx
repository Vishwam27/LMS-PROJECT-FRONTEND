"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-lg text-center">
        
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50">
          <span className="text-2xl">📚</span>
        </div>
        <p
          className="mt-8 text-7xl font-bold text-[#6c3bff] sm:text-8xl"
          style={{
            fontFamily: "Outfit, sans-serif",
          }}
        >
          404
        </p>

        <h1
          className="mt-5 text-2xl font-bold text-[#0f1428] sm:text-3xl"
          style={{
            fontFamily: "Outfit, sans-serif",
          }}
        >
          Page Not Found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          Sorry, we couldn't find the page you're
          looking for. It may have been moved,
          deleted, or the URL may be incorrect.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
         
         <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-xl bg-[#6c3bff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5d32e8]"
               >
               Go to Home
          </button>
        </div>
        <p className="mt-8 text-xs text-slate-400">
          CourseMaster LMS
        </p>
      </div>
    </main>
  );
}