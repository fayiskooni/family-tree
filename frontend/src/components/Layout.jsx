import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false, hideLogout = false }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-14 h-72 w-72 rounded-full bg-[#c1a46a]/20 blur-3xl" />
        <div className="absolute -right-24 top-36 h-80 w-80 rounded-full bg-[#2f5c4c]/15 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {showSidebar && <Sidebar />}

        <div className={`flex min-w-0 flex-1 flex-col ${showSidebar ? "lg:pl-72" : ""}`}>
          <Navbar hideLogout={hideLogout} />

          <main className="flex-1 overflow-y-auto px-3 pb-6 pt-5 sm:px-5 lg:px-7">
            {hideLogout ? (
              <div className="h-full">{children}</div>
            ) : (
              <div className="mx-auto w-full max-w-[1500px]">{children}</div>
            )}
          </main>

          {!hideLogout && (
            <footer className="mx-3 mb-3 mt-auto rounded-2xl border border-[#b6a77f]/30 bg-[#faf5ea]/80 px-6 py-4 text-center text-xs font-semibold tracking-[0.14em] text-[#4f6157] sm:mx-5 lg:mx-7">
              FAMILY TREE ARCHIVE
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
