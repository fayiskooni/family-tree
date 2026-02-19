import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAuthMember,
  deleteMember,
  getUserMembers,
  updateMember,
} from "../lib/api";
import MemberCard from "../components/MemberCard";
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
import { UserPlus, Sparkles, Users, Plus, Contact } from "lucide-react";

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
    <div className="min-h-screen space-y-8 pb-14">
      <section className="heritage-shell p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_70%_35%,rgba(32,80,62,0.18),transparent_56%)]" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="heritage-kicker mb-6">
              <Sparkles className="size-3.5" />
              People Registry
            </div>
            <h1 className="text-5xl font-bold leading-[0.95] text-[#1f4537] sm:text-6xl lg:text-7xl">
              Every person,
              <br />
              one record at a time.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#4f6157] sm:text-lg">
              Add individuals once, then reuse them across families to build cleaner,
              richer relationship trees.
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
                  <UserPlus className="size-5" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Register Member</DialogTitle>
                </DialogHeader>

                <div className="grid max-h-[70vh] gap-5 overflow-y-auto py-2 pr-1">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={member.name}
                      className="h-11"
                      onChange={(e) => setMember({ ...member, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={member.gender === "" ? "" : String(member.gender)}
                        onValueChange={(v) => setMember({ ...member, gender: v === "true" })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Male</SelectItem>
                          <SelectItem value="false">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input
                        type="number"
                        value={member.age}
                        className="h-11"
                        onChange={(e) => setMember({ ...member, age: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Birth Date (Optional)</Label>
                      <Input
                        type="date"
                        value={member.date_of_birth}
                        className="h-11"
                        onChange={(e) => setMember({ ...member, date_of_birth: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Death Date (Optional)</Label>
                      <Input
                        type="date"
                        value={member.date_of_death}
                        className="h-11"
                        onChange={(e) => setMember({ ...member, date_of_death: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Blood Group (Optional)</Label>
                    <Input
                      placeholder="e.g. AB+"
                      value={member.blood_group}
                      className="h-11"
                      onChange={(e) => setMember({ ...member, blood_group: e.target.value })}
                    />
                  </div>
                </div>

                <DialogFooter className="mt-2">
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleClick} className="px-7">
                    Save Member
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
              <Contact className="size-4" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#244838]">Member Library</h2>
              <p className="text-sm text-[#506258]">
                {members.data?.length || 0} registered member(s)
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2 sm:w-auto"
            onClick={() => setOpen(true)}
          >
            <Plus className="size-4" />
            Add Member
          </Button>
        </div>

        {loadingMembers ? (
          <div className="heritage-panel flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#54665b]">
              Accessing Records...
            </p>
          </div>
        ) : !members.data || members.data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            className="heritage-panel flex flex-col items-center justify-center px-6 py-20 text-center"
          >
            <div className="mb-6 rounded-3xl border border-[#b6a77f]/35 bg-[#f3e9d4] p-5 text-primary">
              <Users className="size-10" />
            </div>
            <h3 className="text-4xl font-bold text-[#234839]">No Members Yet</h3>
            <p className="mt-2 max-w-md text-[#516359]">
              Add your first person to begin building family relationships.
            </p>
            <Button onClick={() => setOpen(true)} className="mt-8 rounded-xl px-8">
              Register First Member
            </Button>
          </motion.div>
        ) : (
          <div className="heritage-grid">
            <AnimatePresence mode="popLayout">
              {members.data.map((m, index) => (
                <motion.div
                  key={m.member_id}
                  initial={{ opacity: 0, y: 16 }}
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
              className="group flex h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.8rem] border-2 border-dashed border-[#b6a77f]/45 bg-[#faf4e8]/70 text-[#4c6358] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-[#f4ebda]"
            >
              <div className="rounded-2xl bg-[#efe2c8] p-4 text-primary transition-transform duration-300 group-hover:scale-105">
                <Plus className="size-6" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.16em]">
                Add Member
              </span>
            </motion.div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MembersPage;
