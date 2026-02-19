import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAuthFamily,
  getUserFamilies,
  updateFamily,
  deleteFamily,
} from "../lib/api";
import FamilyCard from "../components/FamilyCard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, FolderTree, ArrowRight, ScrollText } from "lucide-react";

const HomePage = () => {
  const queryClient = useQueryClient();
  const { data: families = {}, isLoading: loadingFamilies } = useQuery({
    queryKey: ["families"],
    queryFn: getUserFamilies,
  });

  const [familyName, setFamilyName] = useState("");
  const [open, setOpen] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await createAuthFamily({ familyName });
      if (response?.message) toast(response.message);
      else toast.success("Family archive created!");
      await queryClient.invalidateQueries({ queryKey: ["families"] });
      setFamilyName("");
      setOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = async (id, newName) => {
    try {
      await updateFamily({ id, familyName: newName });
      toast.success("Legacy updated!");
      await queryClient.invalidateQueries({ queryKey: ["families"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update family");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFamily({ id });
      toast.success("Record permanently removed.");
      await queryClient.invalidateQueries({ queryKey: ["families"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete family");
    }
  };

  return (
    <div className="min-h-screen space-y-8 pb-14">
      <section className="heritage-shell p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_70%_35%,rgba(186,159,101,0.22),transparent_58%)]" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="heritage-kicker mb-6">
              <Sparkles className="size-3.5" />
              Your Digital Archive
            </div>
            <h1 className="text-5xl font-bold leading-[0.95] text-[#1f4537] sm:text-6xl lg:text-7xl">
              Family legacies,
              <br />
              carefully preserved.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#4f6157] sm:text-lg">
              Build curated family collections, keep names organized, and move from
              memory to a living genealogy archive.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="w-full max-w-xs"
          >
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="h-14 w-full gap-2 rounded-2xl text-sm uppercase tracking-[0.14em]">
                  <Plus className="size-5" />
                  Create Family
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[430px]">
                <DialogHeader>
                  <DialogTitle>Create Family Archive</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-3">
                  <div className="space-y-2">
                    <Label htmlFor="familyName">Family Name</Label>
                    <Input
                      id="familyName"
                      placeholder="e.g. The Harrison Line"
                      value={familyName}
                      className="h-11"
                      onChange={(e) => setFamilyName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAdd} type="submit" className="px-7">
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#b6a77f]/30 bg-[#f8f2e6]/65 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/12 p-2 text-primary">
              <ScrollText className="size-4" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#244838]">Family Archives</h2>
              <p className="text-sm text-[#506258]">
                {Array.isArray(families.data) ? families.data.length : 0} record(s)
                in your library
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2 sm:w-auto"
            onClick={() => setOpen(true)}
          >
            <Plus className="size-4" />
            Add Another
          </Button>
        </div>

        {loadingFamilies ? (
          <div className="heritage-panel flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#54665b]">
              Accessing Records...
            </p>
          </div>
        ) : Array.isArray(families.data) && families.data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            className="heritage-panel flex flex-col items-center justify-center px-6 py-20 text-center"
          >
            <div className="mb-6 rounded-3xl border border-[#b6a77f]/35 bg-[#f3e9d4] p-5 text-primary">
              <FolderTree className="size-10" />
            </div>
            <h3 className="text-4xl font-bold text-[#234839]">No Archives Yet</h3>
            <p className="mt-2 max-w-md text-[#516359]">
              Start with your first family record and grow your genealogy from there.
            </p>
            <Button onClick={() => setOpen(true)} className="mt-8 rounded-xl px-8">
              Create First Family
            </Button>
          </motion.div>
        ) : (
          <div className="heritage-grid">
            <AnimatePresence mode="popLayout">
              {Array.isArray(families.data) &&
                families.data.map((family, index) => (
                  <motion.div
                    key={family.family_id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/family/${family.family_id}`}>
                      <FamilyCard
                        family={family}
                        onEdit={(newName) => handleEdit(family.family_id, newName)}
                        onDelete={() => handleDelete(family.family_id)}
                      />
                    </Link>
                  </motion.div>
                ))}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (families.data?.length || 0) * 0.05 }}
              onClick={() => setOpen(true)}
              className="group flex h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.8rem] border-2 border-dashed border-[#b6a77f]/45 bg-[#faf4e8]/70 text-[#4c6358] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-[#f4ebda]"
            >
              <div className="rounded-2xl bg-[#efe2c8] p-4 text-primary transition-transform duration-300 group-hover:scale-105">
                <Plus className="size-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.16em]">
                New Family
                <ArrowRight className="size-3.5" />
              </span>
            </motion.div>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
