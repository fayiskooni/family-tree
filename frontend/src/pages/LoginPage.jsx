import React, { useState } from "react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import { motion, AnimatePresence } from "framer-motion";
import { TreeDeciduous, ArrowRight, Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  const errorMessage = error?.response?.data?.message || error?.message || (error ? "Identity verification failed" : null);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(30,78,60,0.16),transparent_30%),radial-gradient(circle_at_85%_8%,rgba(191,164,106,0.18),transparent_28%),linear-gradient(180deg,#f9f4e9_0%,#f1e9db_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#b6a77f]/35 bg-[#fffaf0]/85 shadow-[0_34px_80px_-42px_rgba(20,58,45,0.65)] lg:grid-cols-2"
      >
        <aside className="relative hidden flex-col justify-between border-r border-[#b6a77f]/28 bg-[#1f4537] p-10 text-[#f8f1e4] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(214,187,128,0.2),transparent_34%),radial-gradient(circle_at_80%_90%,rgba(250,240,220,0.12),transparent_28%)]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-xl border border-[#d5bd89]/25 bg-[#f8f0dd]/10 px-4 py-3">
              <div className="rounded-lg bg-[#d5bd89]/25 p-2">
                <TreeDeciduous className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#f0dec0]/80">Heritage</p>
                <p className="text-lg font-bold">Family Tree Archive</p>
              </div>
            </div>

            <h2 className="mt-12 text-5xl font-bold leading-tight">
              Welcome
              <br />
              back to your
              <br />
              legacy.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#e6d7ba]">
              Sign in to continue mapping generations, relationships, and stories.
            </p>
          </div>

          <div className="relative z-10 rounded-2xl border border-[#d5bd89]/28 bg-[#f8f0dd]/10 p-5 text-sm leading-relaxed text-[#e9dcc3]">
            Every family branch matters. Keep your history connected and searchable.
          </div>
        </aside>

        <section className="p-7 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-sm">
            <h1 className="text-4xl font-bold text-[#214736]">Sign In</h1>
            <p className="mt-1 text-sm text-[#52645a]">Access your family workspace securely.</p>

            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <div className="flex items-center gap-3 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    <span className="text-xs font-semibold">{errorMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="mt-7 space-y-5">
              <div className="space-y-2">
                <Label>Archive Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5a6a61]" />
                  <Input
                    type="email"
                    placeholder="jordan@legacy.com"
                    className="h-11 pl-10"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5a6a61]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="........"
                    className="h-11 pl-10 pr-10"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6a61] transition-colors hover:text-[#2f4f40]"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full gap-2 rounded-xl text-xs uppercase tracking-[0.14em]"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Authenticating
                  </>
                ) : (
                  <>
                    Enter Workspace
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-xs text-[#52645a]">
              New here?{" "}
              <Link to="/signup" className="font-bold text-primary underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default LoginPage;
