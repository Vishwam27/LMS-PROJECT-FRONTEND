"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContent";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/Learner/Dashboard",
  },
  {
    id: "my-courses",
    label: "My Courses",
    icon: BookOpen,
    href: "/Learner/My-Courses",
  },
  {
    id: "explore",
    label: "Explore",
    icon: Compass,
    href: "/Learner/Explore",
  },
  {
    id: "my-account",
    label: "My Account",
    icon: Settings,
    href: "/Learner/My-Account",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);

  const userName = user?.name || "Learner";
  const userEmail = user?.email || "";

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (!parts.length) return "U";

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (
      parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase();
  };

  const initials = getInitials(userName);

  const isActive = (href: string) => {
    if (!pathname) return false;

    if (href === "/Learner/Dashboard") {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <aside
      className={`
        relative hidden h-screen shrink-0
        overflow-visible
        flex-col
        border-r
        transition-[width]
        duration-300
        ease-in-out
        lg:flex
        ${collapsed ? "w-19" : "w-62.5"}
      `}
      style={{
        background:
          "linear-gradient(180deg, #080c1e 0%, #0c1125 58%, #160d31 100%)",
        borderColor:
          "rgba(255,255,255,0.06)",
      }}
    >
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div
        className={`
          relative flex h-20.5 shrink-0
          items-center
          transition-all duration-300
          ${collapsed
            ? "justify-center px-0"
            : "px-5"
          }
        `}
      >
        {/* Logo */}

        <div
          className={`
            flex shrink-0 items-center
            transition-all duration-300
            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
            "
            style={{
              background:
                "linear-gradient(135deg, #6c3bff, #a880ff)",
              boxShadow:
                "0 8px 24px rgba(108,59,255,0.28)",
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z"
                stroke="white"
                strokeWidth="1.5"
              />

              <path
                d="M9 8L12 6.5V9.5L9 11L6 9.5V6.5L9 8Z"
                fill="white"
              />
            </svg>
          </div>

          <span
            className={`
              whitespace-nowrap
              overflow-hidden
              text-lg
              font-bold
              tracking-tight
              text-white
              transition-all
              duration-200
              ${collapsed
                ? "w-0 opacity-0"
                : "w-auto opacity-100"
              }
            `}
            style={{
              fontFamily: "Outfit, sans-serif",
            }}
          >
            CourseMaster
          </span>
        </div>

        {/* ==================================================
            COLLAPSE BUTTON
            Publer-style attached edge button
        =================================================== */}

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="
            absolute
            -right-3.5
            top-1/2
            z-30
            flex h-8 w-7
            -translate-y-1/2
            items-center
            justify-center
            rounded-r-xl
            border
            border-l-0
            border-white/10
            bg-[#151a32]
            text-white/45
            shadow-[0_4px_15px_rgba(0,0,0,0.25)]
            transition-all
            duration-200
            hover:bg-[#1d2340]
            hover:text-white
          "
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {/* ======================================================
          NAVIGATION
      ======================================================= */}

      <nav className="flex-1 px-3 py-3">
        <div className="space-y-1.5">
          {NAV_ITEMS.map(
            ({ id, label, icon: Icon, href }) => {
              const active = isActive(href);

              return (
                <div
                  key={id}
                  className="group relative"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleNavigate(href)
                    }
                    className={`
                      relative flex h-11 w-full
                      items-center rounded-xl
                      transition-all duration-200
                      ${collapsed
                        ? "justify-center"
                        : "gap-3 px-3.5"
                      }
                    `}
                    style={{
                      color: active
                        ? "#b18cff"
                        : "rgba(255,255,255,0.52)",

                      background: active
                        ? "rgba(108,59,255,0.16)"
                        : "transparent",
                    }}
                  >
                    {/* Active left indicator */}

                    {active && (
                      <span
                        className="
                          absolute left-0
                          h-5 w-0.75
                          rounded-r-full
                        "
                        style={{
                          background:
                            "linear-gradient(180deg,#8d63ff,#b18cff)",
                        }}
                      />
                    )}

                    <Icon
                      size={19}
                      strokeWidth={1.8}
                    />

                    {/* Label */}

                    <span
                      className={`
                        whitespace-nowrap
                        overflow-hidden
                        text-sm
                        font-medium
                        transition-all
                        duration-200
                        ${collapsed
                          ? "w-0 translate-x-2 opacity-0"
                          : "w-auto translate-x-0 opacity-100"
                        }
                      `}
                    >
                      {label}
                    </span>
                  </button>

                  {/* =================================================
                      COLLAPSED TOOLTIP
                  ================================================= */}

                  {collapsed && (
                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-[calc(100%+14px)]
                        top-1/2
                        z-50
                        -translate-y-1/2
                        whitespace-nowrap
                        rounded-lg
                        border
                        border-white/10
                        bg-[#151a32]
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-white
                        opacity-0
                        shadow-xl
                        transition-all
                        duration-150
                        group-hover:translate-x-1
                        group-hover:opacity-100
                      "
                    >
                      {label}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </nav>

      {/* ======================================================
          USER SECTION
      ======================================================= */}

      <div
        className={`
          shrink-0
          pb-4
          transition-all duration-300
          ${collapsed ? "px-2" : "px-4"}
        `}
      >
        {!collapsed ? (
          <div
            className="
              flex items-center gap-3
              rounded-xl
              border
              border-white/10
              bg-white/[0.035]
              p-3
            "
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={userName}
                className="
                  h-9 w-9
                  shrink-0
                  rounded-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex h-9 w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-xs
                  font-bold
                  text-white
                "
                style={{
                  background:
                    "linear-gradient(135deg,#6c3bff,#a880ff)",
                }}
              >
                {initials}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {userName}
              </p>

              <p className="truncate text-xs text-white/35">
                {userEmail || "Learner"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              className="
                shrink-0
                rounded-lg
                p-1.5
                text-white/35
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="group relative flex justify-center">
            <button
              type="button"
              onClick={() =>
                handleNavigate(
                  "/Learner/My-Account"
                )
              }
              className="
                flex h-10 w-10
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.035]
                transition
                hover:bg-white/8
              "
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={userName}
                  className="
                    h-8 w-8
                    rounded-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex h-8 w-8
                    items-center
                    justify-center
                    rounded-full
                    text-xs
                    font-bold
                    text-white
                  "
                  style={{
                    background:
                      "linear-gradient(135deg,#6c3bff,#a880ff)",
                  }}
                >
                  {initials}
                </div>
              )}
            </button>

            {/* Profile tooltip */}

            <div
              className="
                pointer-events-none
                absolute
                left-[calc(100%+14px)]
                bottom-0
                z-50
                whitespace-nowrap
                rounded-lg
                border
                border-white/10
                bg-[#151a32]
                px-3
                py-2
                text-xs
                text-white
                opacity-0
                shadow-xl
                transition-all
                duration-150
                group-hover:translate-x-1
                group-hover:opacity-100
              "
            >
              {userName}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}