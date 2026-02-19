import React, { useState } from "react";
import useSignUp from "../hooks/useSignUp";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { TreeDeciduous, ArrowRight, User, Mail, Lock, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, signUpMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signUpMutation(signupData);
  };

  const errorMessage = error?.response?.data?.message || error?.message || (error ? "Identity registration failed" : null);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_15%,rgba(30,78,60,0.16),transparent_30%),radial-gradient(circle_at_10%_10%,rgba(191,164,106,0.18),transparent_28%),linear-gradient(180deg,#f9f4e9_0%,#f1e9db_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#b6a77f]/35 bg-[#fffaf0]/85 shadow-[0_34px_80px_-42px_rgba(20,58,45,0.65)] lg:grid-cols-2"
      >
        <section className="p-7 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-sm">
            <h1 className="text-4xl font-bold text-[#214736]">Create Account</h1>
            <p className="mt-1 text-sm text-[#52645a]">Start building your family archive.</p>

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

            <form onSubmit={handleSignup} className="mt-7 space-y-5">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5a6a61]" />
                  <Input
                    placeholder="Jordan Walker"
                    className="h-11 pl-10"
                    value={signupData.username}
                    onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Archive Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5a6a61]" />
                  <Input
                    type="email"
                    placeholder="jordan@legacy.com"
                    className="h-11 pl-10"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
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
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
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
                <p className="text-[10px] text-[#5c6d63]">Minimum 6 alphanumeric characters required.</p>
              </div>

              <Button
                type="submit"
                className="h-11 w-full gap-2 rounded-xl text-xs uppercase tracking-[0.14em]"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Registering
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-xs text-[#52645a]">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <aside className="relative hidden flex-col justify-between border-l border-[#b6a77f]/28 bg-[#1f4537] p-10 text-[#f8f1e4] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(214,187,128,0.2),transparent_34%),radial-gradient(circle_at_18%_90%,rgba(250,240,220,0.12),transparent_28%)]" />

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
              Build your
              <br />
              archive from
              <br />
              the first branch.
            </h2>
          </div>

          <div className="relative z-10 space-y-4 rounded-2xl border border-[#d5bd89]/28 bg-[#f8f0dd]/10 p-5">
            {[
              "Secure private access",
              "Shared member records",
              "Visual family tree mapping",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-[#eadcbf]">
                <CheckCircle2 className="size-4 text-[#d5bd89]" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </aside>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
