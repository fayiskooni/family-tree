import React from "react";
import { Link } from "react-router";
import useLogout from "../hooks/useLogout";
import { LogOutIcon, Trees } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = ({ hideLogout = false }) => {
  const { logoutMutation } = useLogout();

  return (
    <nav className="sticky top-0 z-30 mx-3 mt-2 rounded-2xl border border-[#b6a77f]/35 bg-[#f8f2e8]/85 px-4 py-3 shadow-[0_16px_36px_-30px_rgba(20,58,45,0.6)] backdrop-blur sm:mx-5 sm:px-5 lg:mx-7 lg:px-7">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4">
        <Link
          to="/"
          className="group inline-flex items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-[#f3ead9]"
        >
          <div className="rounded-xl bg-primary/15 p-2 text-primary transition-colors group-hover:bg-primary/20">
            <Trees className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5d6f63]">
              Heritage Workspace
            </p>
            <p className="text-base font-bold text-[#1f4737]">Family Tree</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {!hideLogout && (
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl border border-[#cc8f7f]/35 bg-[#9d2f22]/10 px-4 py-2 text-sm font-bold text-[#8d1f12] transition-colors hover:bg-[#9d2f22]/15"
              onClick={logoutMutation}
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Sign Out</span>
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
