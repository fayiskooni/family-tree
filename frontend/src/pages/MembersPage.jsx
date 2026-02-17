import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAuthMember,
  deleteMember,
  getUserMembers,
  updateMember,
} from "../lib/api";
import MemberCard from "../components/MemberCard";
import NoMembersFound from "../components/NoMembersFound";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Sparkles, Users, Search, Plus } from "lucide-react";

const MembersPage = () => {
  const queryClient = useQueryClient();
  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["members"],
    queryFn: getUserMembers,
  });

  const [member, setMember] = useState({
    name: "",
    gender: "",
    age: "",
    date_of_birth: "",
    date_of_death: "",
    blood_group: "",
  });
  const [open, setOpen] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await createAuthMember({ member });
      if (response?.message) toast(response.message);
      else toast.success("Member added to the digital archive!");
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      setMember({ name: "", gender: "", age: "", date_of_birth: "", date_of_death: "", blood_group: "" });
      setOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = async (id, updatedMember) => {
    try {
      await updateMember({ id, member: updatedMember });
      toast.success("Details updated.");
      await queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update member");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMember({ id });
      toast.success("Member record removed.");
      await queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete member");
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative pt-12 pb-16 px-8 lg:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full -mr-48 -mt-48 -z-10" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-base-content/60">Member Directory</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-4 text-base-content">
                The <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">People.</span>
              </h1>
              <p className="text-base-content/60 text-lg max-w-xl font-medium leading-relaxed">
                Manage individuals in your database. These entries serve as the building blocks for your intricate family trees.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="h-16 px-8 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 font-black text-lg gap-3">
                    <UserPlus className="size-6" />
                    Register New Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black">Register Member</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-6 max-h-[70vh] overflow-y-auto px-1">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Full Name</Label>
                      <Input
                        value={member.name}
                        className="rounded-xl h-12 border-base-content/20 focus:border-primary transition-all"
                        onChange={(e) => setMember({ ...member, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Gender</Label>
                        <Select
                          value={member.gender === "" ? "" : String(member.gender)}
                          onValueChange={(v) => setMember({ ...member, gender: v === "true" })}
                        >
                          <SelectTrigger className="rounded-xl h-12 border-base-content/20">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="true">Male</SelectItem>
                            <SelectItem value="false">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Age</Label>
                        <Input
                          type="number"
                          value={member.age}
                          className="rounded-xl h-12 border-base-content/20"
                          onChange={(e) => setMember({ ...member, age: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Birth Date (Optional)</Label>
                        <Input
                          type="date"
                          value={member.date_of_birth}
                          className="rounded-xl h-12 border-base-content/20"
                          onChange={(e) => setMember({ ...member, date_of_birth: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Death Date (Optional)</Label>
                        <Input
                          type="date"
                          value={member.date_of_death}
                          className="rounded-xl h-12 border-base-content/20"
                          onChange={(e) => setMember({ ...member, date_of_death: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Blood Group (Optional)</Label>
                      <Input
                        placeholder="e.g. AB+"
                        value={member.blood_group}
                        className="rounded-xl h-12 border-base-content/20"
                        onChange={(e) => setMember({ ...member, blood_group: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="ghost" className="rounded-xl">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleClick}
                      className="rounded-xl px-10 shadow-lg shadow-primary/20 bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
                    >
                      Create Member
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

        {loadingMembers ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-base-content/60">Accessing Records...</p>
          </div>
        ) : !members.data || members.data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-base-content/5 flex items-center justify-center mb-8 border border-base-content/5">
              <Users className="size-10 text-base-content/20" />
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">Empty Registry</h3>
            <p className="text-base-content/40 max-w-sm mb-10 font-medium">Capture your first family member to begin building your digital lineage.</p>
            <Button onClick={() => setOpen(true)} className="rounded-xl px-10 h-12 shadow-xl shadow-primary/10 bg-primary text-primary-foreground">Register Now</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {members.data.map((m, index) => (
                <motion.div
                  key={m.member_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MemberCard
                    member={m}
                    onEdit={(updated) => handleEdit(m.member_id, updated)}
                    onDelete={() => handleDelete(m.member_id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: members.data.length * 0.05 }}
              onClick={() => setOpen(true)}
              className="group h-32 rounded-[2rem] border-2 border-dashed border-base-content/10 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 cursor-pointer text-base-content/40 hover:text-primary"
            >
              <div className="p-3 rounded-xl bg-base-content/5 group-hover:bg-primary/10 transition-colors">
                <Plus className="size-4" />
              </div>
              <span className="font-black text-[10px] uppercase tracking-widest">Add Member</span>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;
