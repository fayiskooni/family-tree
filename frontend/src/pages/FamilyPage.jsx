import AddCard from "@/components/AddCard";
import MemberCard from "@/components/MemberCard";
import NoMembersFound from "@/components/NoMembersFound";
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
import { Separator } from "@/components/ui/separator";
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
import { Pencil, UserMinus, Plus, TreeDeciduous, Users, Sparkles, ChevronRight, Share2 } from "lucide-react";
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
    isLoading: loadingRecommendedMembers,
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
              <TreeDeciduous className="size-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-base-content/60">Heritage Archive</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-base-content">
                  {family?.data?.family_name}
                </h1>
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-base-content/5 mt-auto mb-2 text-base-content/60">
                      <Pencil className="size-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black text-base-content">Manage Archive</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-80 rounded-2xl border border-base-content/5 p-4">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/60 mb-4">Current Members</h4>
                        {members.data?.length > 0 ? (
                          members.data.map((member) => (
                            <div key={member.member_id} className="flex items-center justify-between p-3 rounded-2xl bg-base-content/5 group">
                              <span className="font-bold text-sm tracking-tight">{member.name}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="size-8 rounded-xl text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveMember(member.member_id)}
                              >
                                <UserMinus className="size-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-center py-8 text-base-content/40 font-medium italic">Empty Archive</p>
                        )}
                      </div>
                    </ScrollArea>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" className="rounded-xl w-full">Done</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-base-content/50 text-lg max-w-xl font-medium leading-relaxed">
                Exploring the legacy and branches of the {family?.data?.family_name} lineage.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <Link to={`/treeView/family/${family.data.family_id}`}>
                <Button size="lg" className="h-16 px-8 rounded-2xl bg-primary text-primary-content shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 font-black text-lg gap-3">
                  <TreeDeciduous className="size-6" />
                  Visualize Tree
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="h-px w-full bg-base-content/5 mb-16" />

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-base-content/10">
              <Users className="size-5 text-base-content/60" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-base-content">Active Members</h2>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-xl font-black gap-2 h-11 border-base-content/10">
                <Plus className="size-4" />
                Add Family Members
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Add Family Members</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-80 rounded-2xl border border-base-content/5 p-4">
                <div className="space-y-4 px-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4 pl-1">Recommended Members</h4>
                  {recommendedMembers.data?.length > 0 ? (
                    recommendedMembers.data.map((rm) => (
                      <div key={rm.member_id} className="flex items-center justify-between p-3 rounded-2xl bg-base-content/5 group">
                        <span className="font-bold text-sm tracking-tight">{rm.name}</span>
                        <Button
                          size="sm"
                          className="rounded-xl h-8 px-4 font-black text-[10px] uppercase bg-primary text-primary-foreground shadow-lg shadow-primary/10 hover:opacity-90"
                          onClick={() => handleAddMember(rm.member_id)}
                        >
                          Add
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-sm text-base-content/40 font-medium italic mb-4">No unlinked members found</p>
                      <Link to="/members">
                        <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary">Go to Registry</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="rounded-xl w-full">Dismiss</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loadingMembers ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-base-content/40">Accessing Records...</p>
          </div>
        ) : members.data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-base-content/5 flex items-center justify-center mb-8 border border-base-content/5">
              <Users className="size-10 text-base-content/20" />
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">Ghost Archive</h3>
            <p className="text-base-content/40 max-w-sm mb-10 font-medium">This heritage line has no people linked to it yet. Start by adding existing members.</p>
            <Button onClick={() => setOpen(true)} className="rounded-xl px-10 h-12 shadow-xl shadow-primary/10 bg-primary text-primary-foreground">Add Now</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {members.data.map((member, index) => (
                <motion.div
                  key={member.member_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/member/${member.member_id}`}>
                    <MemberCard
                      member={member}
                      hideOptions={true}
                    />
                  </Link>
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
              <span className="font-black text-[10px] uppercase tracking-widest">Add Family Member</span>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyPage;
