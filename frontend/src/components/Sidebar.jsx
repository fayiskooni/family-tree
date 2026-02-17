import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import {
  BookOpen,
  HomeIcon,
  TreePine,
  UsersIcon,
  User,
  Settings,
  ShieldCheck
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
    <aside className="w-72 bg-base-200/50 backdrop-blur-xl border-r border-base-content/5 hidden lg:flex flex-col h-screen sticky top-0 z-40 overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

      <div className="p-8">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
            <TreePine className="size-7 text-primary-content" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-base-content to-base-content/60">
            FamilyTree
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-4">
          Core Experience
        </p>
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                  ? "bg-primary text-primary-content shadow-xl shadow-primary/20"
                  : "hover:bg-base-content/5 text-base-content/60 hover:text-base-content"
                }`}
            >
              <item.icon className={`size-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 opacity-70"}`} />
              <span className="font-bold tracking-tight">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-1 w-1 h-6 bg-primary-content rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-base-300/30 rounded-[2rem] p-4 border border-base-content/5">
          <div className="flex items-center gap-4 px-2 py-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20 shadow-inner">
              <User className="size-5 text-primary opacity-80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm truncate tracking-tight">{authUser?.username}</p>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3 text-success opacity-70" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-base-content/40">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
