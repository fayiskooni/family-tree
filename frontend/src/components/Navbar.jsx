import React from "react";
import { Link } from "react-router";
import useLogout from "../hooks/useLogout";
import { LogOutIcon } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = ({ hideLogout = false }) => {
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-100/50 backdrop-blur-xl border-b border-base-content/5 sticky top-0 z-30 h-20 flex items-center px-8 transition-all duration-300">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">

        <div className="flex-1" />

        <div className="flex items-center gap-6">
          {/* Logout button */}
          {!hideLogout && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-error/10 text-error hover:bg-error hover:text-error-content transition-all duration-300 font-bold text-sm shadow-lg shadow-error/5"
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
