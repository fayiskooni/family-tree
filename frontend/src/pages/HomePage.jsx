import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAuthFamily,
  getUserFamilies,
  updateFamily,
  deleteFamily,
} from "../lib/api";
import FamilyCard from "../components/FamilyCard";
import NoFamiliesFound from "../components/NoFamiliesFound";
import AddCard from "@/components/AddCard";
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
import { Plus, Sparkles, FolderTree, Search } from "lucide-react";

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
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative pt-12 pb-16 px-8 lg:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48 -z-10" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-base-content/40">Your Digital Archive</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-4">
                Grand <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/40">Lineages.</span>
              </h1>
              <p className="text-base-content/50 text-lg max-w-xl font-medium leading-relaxed">
                Connect your past, visualize your present, and preserve your family's journey for the generations to come.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="h-16 px-8 rounded-2xl bg-primary text-primary-content shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 font-black text-lg gap-3">
                    <Plus className="size-6" />
                    Initialize New Family
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black">Archive New Family</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                      <Label htmlFor="familyName" className="text-xs font-bold uppercase tracking-widest opacity-40">Family Identifier</Label>
                      <Input
                        id="familyName"
                        placeholder="e.g. The Harrison Dynasty"
                        value={familyName}
                        className="rounded-xl border-base-content/10 focus:ring-primary h-12"
                        onChange={(e) => setFamilyName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost" className="rounded-xl">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAdd} type="submit" className="rounded-xl px-8 shadow-lg shadow-primary/20">
                      Create Archive
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="h-px w-full bg-base-content/5 mb-16" />

        {loadingFamilies ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-base-content/40">Accessing Records...</p>
          </div>
        ) : Array.isArray(families.data) && families.data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-base-content/5 flex items-center justify-center mb-8 border border-base-content/5">
              <FolderTree className="size-10 text-base-content/20" />
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">Silent Archives</h3>
            <p className="text-base-content/40 max-w-sm mb-10 font-medium">Your family history is waiting to be written. Begin by creating your first lineage container.</p>
            <Button onClick={() => setOpen(true)} className="rounded-xl px-10 h-12 shadow-xl shadow-primary/10">Initialize Now</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {Array.isArray(families.data) &&
                families.data.map((family, index) => (
                  <motion.div
                    key={family.family_id}
                    initial={{ opacity: 0, y: 20 }}
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
              transition={{ delay: families.data?.length * 0.05 }}
              onClick={() => setOpen(true)}
              className="group h-48 rounded-[2.5rem] border-2 border-dashed border-base-content/10 flex flex-col items-center justify-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 cursor-pointer text-base-content/30 hover:text-primary"
            >
              <div className="p-4 rounded-2xl bg-base-content/5 group-hover:bg-primary/10 transition-colors">
                <Plus className="size-6" />
              </div>
              <span className="font-black text-xs uppercase tracking-widest">New Family</span>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
