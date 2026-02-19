import MemberCard from "@/components/MemberCard";
import PageLoader from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  createFamilyMember,
  deleteFamilyMember,
  getFamily,
  getFamilyMembers,
  getRecommendedMembers,
} from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { Pencil, UserMinus, Plus, TreeDeciduous, Users, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FamilyPage = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data: family, isLoading } = useQuery({
    queryKey: ["family", id],
    queryFn: () => getFamily(id),
  });

  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["members", id],
    queryFn: () => getFamilyMembers(id),
  });

  const {
    data: recommendedMembers = [],
  } = useQuery({
    queryKey: ["recommendedMembers", id],
    queryFn: () => getRecommendedMembers(id),
  });

  const handleAddMember = async (memberId) => {
    try {
      await createFamilyMember(id, { member_id: memberId });
      toast.success("Success! Family member added.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["members", id] }),
        queryClient.invalidateQueries({ queryKey: ["recommendedMembers", id] }),
      ]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await deleteFamilyMember(id, memberId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["members", id] }),
        queryClient.invalidateQueries({ queryKey: ["recommendedMembers", id] }),
      ]);
      toast.success("Member record unlinked.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen space-y-8 pb-14">
      <section className="heritage-shell p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_72%_36%,rgba(186,159,101,0.2),transparent_56%)]" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="heritage-kicker mb-6">
              <Sparkles className="size-3.5" />
              Heritage Archive
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <h1 className="text-5xl font-bold leading-[0.95] text-[#1f4537] sm:text-6xl lg:text-7xl">
                {family?.data?.family_name}
              </h1>
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="mb-1 h-11 w-11 rounded-2xl">
                    <Pencil className="size-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Manage Family Members</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-80 rounded-2xl border border-[#b6a77f]/35 bg-[#fff8ec]/70 p-4">
                    <div className="space-y-3">
                      {members.data?.length > 0 ? (
                        members.data.map((member) => (
                          <div
                            key={member.member_id}
                            className="flex items-center justify-between rounded-xl border border-[#b6a77f]/30 bg-[#fffdf7]/80 p-3"
                          >
                            <span className="font-semibold text-[#244b3a]">{member.name}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8 rounded-lg text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveMember(member.member_id)}
                            >
                              <UserMinus className="size-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="py-8 text-center text-sm text-[#4f6157]">No linked members</p>
                      )}
                    </div>
                  </ScrollArea>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="w-full">Done</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#4f6157] sm:text-lg">
              Explore members connected to this family and maintain lineage links
              with precision.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="w-full max-w-xs"
          >
            <Link to={`/treeView/family/${family.data.family_id}`}>
              <Button size="lg" className="h-14 w-full gap-2 rounded-2xl text-sm uppercase tracking-[0.14em]">
                <TreeDeciduous className="size-5" />
                View Tree
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#b6a77f]/30 bg-[#f8f2e6]/65 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/12 p-2 text-primary">
              <Users className="size-4" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#244838]">Family Members</h2>
              <p className="text-sm text-[#506258]">
                {members.data?.length || 0} linked profile(s)
              </p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full gap-2 sm:w-auto">
                <Plus className="size-4" />
                Add Existing Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Family Members</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-80 rounded-2xl border border-[#b6a77f]/35 bg-[#fff8ec]/70 p-4">
                <div className="space-y-3">
                  {recommendedMembers.data?.length > 0 ? (
                    recommendedMembers.data.map((rm) => (
                      <div
                        key={rm.member_id}
                        className="flex items-center justify-between rounded-xl border border-[#b6a77f]/30 bg-[#fffdf7]/80 p-3"
                      >
                        <span className="font-semibold text-[#244b3a]">{rm.name}</span>
                        <Button
                          size="sm"
                          className="h-8 rounded-lg px-4 text-[11px] uppercase tracking-[0.12em]"
                          onClick={() => handleAddMember(rm.member_id)}
                        >
                          Add
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-sm text-[#4f6157]">No unlinked members found</p>
                      <Link to="/members">
                        <Button variant="ghost" className="mt-3 text-xs uppercase tracking-[0.12em]">
                          Go to Registry
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="w-full">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loadingMembers ? (
          <div className="heritage-panel flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#54665b]">
              Accessing Records...
            </p>
          </div>
        ) : members.data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            className="heritage-panel flex flex-col items-center justify-center px-6 py-20 text-center"
          >
            <div className="mb-6 rounded-3xl border border-[#b6a77f]/35 bg-[#f3e9d4] p-5 text-primary">
              <Users className="size-10" />
            </div>
            <h3 className="text-4xl font-bold text-[#234839]">No Members Linked</h3>
            <p className="mt-2 max-w-md text-[#516359]">
              Connect existing people to this family to build its relationship map.
            </p>
            <Button onClick={() => setOpen(true)} className="mt-8 rounded-xl px-8">
              Link Members
            </Button>
          </motion.div>
        ) : (
          <div className="heritage-grid">
            <AnimatePresence mode="popLayout">
              {members.data.map((member, index) => (
                <motion.div
                  key={member.member_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/member/${member.member_id}`}>
                    <MemberCard member={member} hideOptions={true} />
                  </Link>
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

export default FamilyPage;
