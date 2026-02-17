import {
  createChild,
  createCouple,
  getAllRemainingChildren,
  getAllUnmarriedFemales,
  getAllUnmarriedMales,
  getMember,
  getMemberChild,
  getMemberSpouse,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import PageLoader from "@/components/PageLoader";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Save, UserCircle, Heart, Baby, Calendar, Droplets, ArrowLeft, Loader2, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const formatDate = (dateString) => {
  if (!dateString) return "";
  // If it's an ISO string, just take the date part
  return dateString.includes('T') ? dateString.split('T')[0] : dateString;
};

const MemberDetailsPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: memberData, isLoading } = useQuery({
    queryKey: ["member", id],
    queryFn: () => getMember(id),
  });

  const { data: spouse } = useQuery({
    queryKey: ["spouse", id],
    queryFn: () => getMemberSpouse(id),
  });

  const { data: children = [] } = useQuery({
    queryKey: ["children", id],
    queryFn: () => getMemberChild(id),
  });

  const { data: unmarriedMales = [] } = useQuery({
    queryKey: ["unmarriedMales"],
    queryFn: () => getAllUnmarriedMales(),
  });

  const { data: unmarriedFemales = [] } = useQuery({
    queryKey: ["unmarriedFemales"],
    queryFn: () => getAllUnmarriedFemales(),
  });

  const { data: allChildren = [] } = useQuery({
    queryKey: ["allChildren"],
    queryFn: () => getAllRemainingChildren(),
  });

  const [memberSpouse, setMemberSpouse] = useState("");
  const [memberChild, setMemberChild] = useState([""]);

  const isMale = memberData?.data?.gender === true;
  const gender = isMale ? "Male" : "Female";

  React.useEffect(() => {
    if (spouse?.data && memberData?.data) {
      const g = memberData.data.gender;
      if (g === true) {
        setMemberSpouse(String(spouse.data.wife_id));
      } else {
        setMemberSpouse(String(spouse.data.husband_id));
      }
    }
  }, [spouse, memberData]);

  const addCoupleMutation = useMutation({
    mutationFn: (data) => createCouple(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["spouse", id]);
    },
  });

  const addChildMutation = useMutation({
    mutationFn: (data) => createChild(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["children", id]);
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Only attempt to add/update spouse if they aren't already married
      if (memberSpouse && !spouse?.data) {
        await addCoupleMutation.mutateAsync({ partnerId: memberSpouse });
        // Also invalidate the spouse query for the partner
        queryClient.invalidateQueries({ queryKey: ["spouse", memberSpouse] });
      }

      const validChildren = memberChild.filter(c => c !== "");
      if (validChildren.length > 0) {
        await addChildMutation.mutateAsync({ children: validChildren });
        // Invalidate children/parents queries for the selected children too
        validChildren.forEach(childId => {
          queryClient.invalidateQueries({ queryKey: ["member", childId] });
          queryClient.invalidateQueries({ queryKey: ["children", childId] });
        });
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["spouse", id] }),
        queryClient.invalidateQueries({ queryKey: ["children", id] }),
        queryClient.invalidateQueries({ queryKey: ["unmarriedMales"] }),
        queryClient.invalidateQueries({ queryKey: ["unmarriedFemales"] }),
        queryClient.invalidateQueries({ queryKey: ["allChildren"] }),
      ]);

      setMemberChild([""]); // Reset child selection inputs
      toast.success("Ancestral records updated");
    } catch (error) {
      toast.error("Failed to update genealogy");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <PageLoader />;

  const m = memberData?.data;

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Hero Header */}
      <div className={`relative pt-12 pb-24 px-8 lg:px-12 overflow-hidden bg-gradient-to-b ${isMale ? 'from-blue-500/10' : 'from-pink-500/10'} to-transparent`}>
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-8 rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>

          <div className="flex flex-col items-center text-center text-base-content">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center border shadow-2xl mb-8 ${isMale ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' : 'bg-pink-500/10 border-pink-500/20 text-pink-600'}`}
            >
              <UserCircle className="size-16" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-7xl font-black tracking-tighter mb-4 text-base-content"
            >
              {m?.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isMale ? 'bg-blue-500/20 text-blue-700' : 'bg-pink-500/20 text-pink-700'}`}>
                {gender}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-base-content/20" />
              <span className="text-sm font-bold text-base-content/60 tracking-tight">{m?.age} Years Old</span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-base-content">

          {/* Left Column: Stats */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-6 rounded-3xl bg-base-100 border border-base-content/10 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-base-content/10 text-base-content/60">
                  <Calendar className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Born</span>
                  <span className="font-bold tracking-tight text-base-content">{formatDate(m?.date_of_birth) || "Unknown"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-base-content/10 text-base-content/60">
                  <Heart className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Passed</span>
                  <span className="font-bold tracking-tight text-base-content">{formatDate(m?.date_of_death) || "Present"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-base-content/10 text-base-content/60">
                  <Droplets className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Blood Type</span>
                  <span className="font-bold tracking-tight text-base-content">{m?.blood_group || "N/A"}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 font-black text-sm uppercase tracking-widest gap-3"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
              Commit Changes
            </Button>
          </div>

          {/* Right Column: Relations */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="size-5 text-primary" />
                <h2 className="text-xl font-black tracking-tight text-base-content">Partner</h2>
              </div>

              {spouse?.data?.name ? (
                <Link to={`/member/${isMale ? spouse.data.wife_id : spouse.data.husband_id}`}>
                  <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-between group hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                        {spouse.data.name.charAt(0)}
                      </div>
                      <span className="font-bold tracking-tight text-base-content">{spouse.data.name}</span>
                    </div>
                    <ChevronRight className="size-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ) : (
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Connect Spouse</Label>
                  <Select value={memberSpouse} onValueChange={setMemberSpouse}>
                    <SelectTrigger className="w-full h-12 rounded-2xl border-base-content/20">
                      <SelectValue placeholder={`Find ${isMale ? "Partner" : "Partner"}`} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {isMale
                        ? unmarriedFemales.data?.map((f) => (
                          <SelectItem key={f.member_id} value={String(f.member_id)}>{f.name}</SelectItem>
                        ))
                        : unmarriedMales.data?.map((m) => (
                          <SelectItem key={m.member_id} value={String(m.member_id)}>{m.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </section>

            {(spouse?.data?.name || memberSpouse) ? (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Baby className="size-5 text-primary" />
                  <h2 className="text-xl font-black tracking-tight">Lineage</h2>
                </div>

                <div className="space-y-4">
                  {children?.data?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {children.data.map((c) => (
                        <Link key={c.child_id} to={`/member/${c.child_id}`}>
                          <div className="p-4 rounded-2xl bg-base-content/5 border border-base-content/5 flex items-center gap-3 group hover:border-primary/20 transition-all">
                            <div className="w-8 h-8 rounded-lg bg-base-content/5 flex items-center justify-center font-black text-xs">
                              {c.child_name.charAt(0)}
                            </div>
                            <span className="font-bold text-sm tracking-tight">{c.child_name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Add Children</Label>
                    {memberChild.map((childId, index) => (
                      <Select
                        key={index}
                        value={childId}
                        onValueChange={(v) => {
                          const n = [...memberChild];
                          n[index] = v;
                          setMemberChild(n);
                        }}
                      >
                        <SelectTrigger className="w-full h-12 rounded-2xl border-base-content/10">
                          <SelectValue placeholder={`Select Record ${index + 1}`} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          {allChildren.data?.map((child) => (
                            <SelectItem key={child.member_id} value={String(child.member_id)}>{child.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ))}

                    {memberChild[memberChild.length - 1] !== "" && (
                      <Button
                        variant="ghost"
                        className="w-full rounded-2xl h-12 border-2 border-dashed border-base-content/10 hover:border-primary/20 hover:bg-primary/5 transition-all text-base-content/30 hover:text-primary gap-2"
                        onClick={() => setMemberChild([...memberChild, ""])}
                      >
                        <Plus className="size-4" />
                        Add Lineage Entry
                      </Button>
                    )}
                  </div>
                </div>
              </section>
            ) : (
              <div className="p-8 rounded-3xl bg-base-content/5 border border-dashed border-base-content/10 flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-2xl bg-base-content/5">
                  <Heart className="size-6 text-base-content/20" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm">Add a Spouse First</h3>
                  <p className="text-xs text-base-content/40 max-w-[200px]">You must establish a partnership before you can track lineage for this member.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MemberDetailsPage;
