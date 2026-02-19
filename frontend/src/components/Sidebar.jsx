import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import {
  BookOpen,
  HomeIcon,
  TreePine,
  UsersIcon,
  User,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/members", icon: UsersIcon, label: "Members" },
    { path: "/userGuide", icon: BookOpen, label: "User Guide" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col border-r border-[#b6a77f]/35 bg-[#1f4537] text-[#f6eedf] shadow-[0_16px_42px_-24px_rgba(12,28,22,0.9)] lg:flex">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(215,186,127,0.18),transparent_35%),radial-gradient(circle_at_90%_85%,rgba(253,245,228,0.12),transparent_32%)]"
      />

      <div className="relative p-7 pb-5">
        <Link
          to="/"
          className="inline-flex items-center gap-3 rounded-2xl border border-[#d5bd89]/30 bg-[#f8f0dd]/10 px-4 py-3 transition-colors hover:bg-[#f8f0dd]/16"
        >
          <div className="rounded-xl bg-[#d5bd89]/25 p-2.5 text-[#f0dec0]">
            <TreePine className="size-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#f0dec0]/75">
              Genealogy
            </p>
            <p className="text-xl font-bold tracking-wide text-[#f9f3e8]">FamilyTree</p>
          </div>
        </Link>
      </div>

      <nav className="relative flex-1 space-y-2 px-4 py-3">
        <p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#f4e8d0]/55">
          Navigation
        </p>

        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all ${
                isActive
                  ? "bg-[#f6edd9] text-[#1f4537] shadow-[0_12px_28px_-18px_rgba(0,0,0,0.55)]"
                  : "text-[#f4e8d0]/78 hover:bg-[#f6edd9]/14 hover:text-[#fff8ec]"
              }`}
            >
              <item.icon
                className={`size-4 transition-transform ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              />
              <span className="text-sm font-bold tracking-wide">{item.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-2 h-2 w-2 rounded-full bg-[#2d5d4a]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="relative mt-auto p-5">
        <div className="rounded-2xl border border-[#d5bd89]/30 bg-[#f8f0dd]/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d5bd89]/26 text-[#f9f1e0]">
              <User className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{authUser?.username}</p>
              <div className="mt-0.5 flex items-center gap-1.5 text-[#f2e3c2]/78">
                <ShieldCheck className="size-3" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
