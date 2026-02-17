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
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-base-100">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -ml-64 -mt-64 -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full -mr-32 -mb-32 -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl grid lg:grid-cols-2 bg-base-100 rounded-[2.5rem] border border-base-content/5 shadow-2xl overflow-hidden"
      >
        {/* Visual Side */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-base-content/5">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,var(--primary)_0%,transparent_50%)]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 rounded-xl bg-primary text-primary-content shadow-lg shadow-primary/20">
                <TreeDeciduous className="size-5" />
              </div>
              <span className="font-black uppercase tracking-[0.3em] text-[10px] opacity-40 text-base-content">Heritage Archive</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter leading-tight mb-6">
              Begin your<br />
              <span className="text-primary italic font-medium">ancestral journey.</span>
            </h2>
          </div>

          <div className="relative z-10 mt-auto space-y-4">
            {[
              "Secure identity encryption",
              "World-wide lineage mapping",
              "Infinite generational depth"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 className="size-3" />
                </div>
                <span className="text-xs font-bold text-base-content/60">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 lg:p-16 flex flex-col justify-center border-l border-base-content/5">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-black tracking-tight mb-2">Create Record</h1>
              <p className="text-sm text-base-content/40 font-medium">Join the global network of lineage preservation.</p>
            </div>

            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-8"
                >
                  <div className="p-4 rounded-2xl bg-error/10 border border-error/20 flex items-center gap-3 text-error">
                    <AlertCircle className="size-5 shrink-0" />
                    <span className="text-xs font-bold tracking-tight">{errorMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Identity Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/20" />
                  <Input
                    placeholder="Jordan Walker"
                    className="h-12 pl-11 rounded-2xl border-base-content/10 bg-base-content/5 focus:bg-base-100 transition-all"
                    value={signupData.username}
                    onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Archive Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/20" />
                  <Input
                    type="email"
                    placeholder="jordan@legacy.com"
                    className="h-12 pl-11 rounded-2xl border-base-content/10 bg-base-content/5 focus:bg-base-100 transition-all"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Security Pattern</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-base-content/20" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 pl-11 pr-11 rounded-2xl border-base-content/10 bg-base-content/5 focus:bg-base-100 transition-all"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/20 hover:text-base-content/40 transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <p className="text-[9px] font-bold text-base-content/30 ml-1 italic italic">Minimum 6 alphanumeric characters required</p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    Commit Record
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs font-medium text-base-content/40">
                Already registered?{" "}
                <Link to="/login" className="text-primary font-black hover:underline underline-offset-4 tracking-tight">
                  Initialize Session
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
