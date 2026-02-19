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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return dateString.includes("T") ? dateString.split("T")[0] : dateString;
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
      if (memberSpouse && !spouse?.data) {
        await addCoupleMutation.mutateAsync({ partnerId: memberSpouse });
        queryClient.invalidateQueries({ queryKey: ["spouse", memberSpouse] });
      }

      const validChildren = memberChild.filter((c) => c !== "");
      if (validChildren.length > 0) {
        await addChildMutation.mutateAsync({ children: validChildren });
        validChildren.forEach((childId) => {
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

      setMemberChild([""]);
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
    <div className="min-h-screen space-y-8 pb-14">
      <section className="heritage-shell p-6 sm:p-8 lg:p-10">
        <div
          className={`absolute inset-0 ${
            isMale
              ? "bg-[radial-gradient(circle_at_75%_30%,rgba(58,123,112,0.2),transparent_55%)]"
              : "bg-[radial-gradient(circle_at_75%_30%,rgba(179,122,99,0.2),transparent_55%)]"
          }`}
        />
        <div className="relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6 gap-2 rounded-xl text-[11px] uppercase tracking-[0.14em]"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 flex h-24 w-24 items-center justify-center rounded-[1.8rem] border ${
                isMale
                  ? "border-[#4c7f74]/30 bg-[#4c7f74]/12 text-[#2f6659]"
                  : "border-[#b37a63]/30 bg-[#b37a63]/12 text-[#8d5845]"
              }`}
            >
              <UserCircle className="size-14" />
            </motion.div>

            <h1 className="text-5xl font-bold leading-none text-[#1f4537] sm:text-6xl lg:text-7xl">
              {m?.name}
            </h1>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] ${
                  isMale
                    ? "bg-[#4c7f74]/16 text-[#2f6659]"
                    : "bg-[#b37a63]/16 text-[#8d5845]"
                }`}
              >
                {gender}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#4f6157]/35" />
              <span className="text-sm font-semibold text-[#4f6157]">{m?.age} years old</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <aside className="space-y-4 lg:col-span-1">
          <div className="heritage-panel space-y-5 p-5 sm:p-6">
            <div className="flex items-start gap-3 rounded-xl border border-[#b6a77f]/30 bg-[#fffaf0]/80 p-3">
              <div className="rounded-lg bg-primary/12 p-2 text-primary">
                <Calendar className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6157]">Born</p>
                <p className="font-semibold text-[#234939]">{formatDate(m?.date_of_birth) || "Unknown"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#b6a77f]/30 bg-[#fffaf0]/80 p-3">
              <div className="rounded-lg bg-primary/12 p-2 text-primary">
                <Heart className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6157]">Passed</p>
                <p className="font-semibold text-[#234939]">{formatDate(m?.date_of_death) || "Present"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#b6a77f]/30 bg-[#fffaf0]/80 p-3">
              <div className="rounded-lg bg-primary/12 p-2 text-primary">
                <Droplets className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6157]">Blood Type</p>
                <p className="font-semibold text-[#234939]">{m?.blood_group || "N/A"}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="h-12 w-full gap-2 rounded-xl text-xs uppercase tracking-[0.14em]"
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Relations
          </Button>
        </aside>

        <section className="space-y-6 lg:col-span-2">
          <div className="heritage-panel p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Heart className="size-4" />
              <h2 className="text-3xl font-bold text-[#244b3a]">Partner</h2>
            </div>

            {spouse?.data?.name ? (
              <Link to={`/member/${isMale ? spouse.data.wife_id : spouse.data.husband_id}`}>
                <div className="group flex items-center justify-between rounded-2xl border border-[#b6a77f]/35 bg-[#fff9ef]/80 p-4 transition-colors hover:bg-[#fbf3e3]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 font-bold text-primary">
                      {spouse.data.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-[#234939]">{spouse.data.name}</span>
                  </div>
                  <ChevronRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ) : (
              <div className="space-y-2">
                <Label>Connect Spouse</Label>
                <Select value={memberSpouse} onValueChange={setMemberSpouse}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {isMale
                      ? unmarriedFemales.data?.map((f) => (
                          <SelectItem key={f.member_id} value={String(f.member_id)}>
                            {f.name}
                          </SelectItem>
                        ))
                      : unmarriedMales.data?.map((m) => (
                          <SelectItem key={m.member_id} value={String(m.member_id)}>
                            {m.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {(spouse?.data?.name || memberSpouse) ? (
            <div className="heritage-panel p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Baby className="size-4" />
                <h2 className="text-3xl font-bold text-[#244b3a]">Children</h2>
              </div>

              {children?.data?.length > 0 && (
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {children.data.map((c) => (
                    <Link key={c.child_id} to={`/member/${c.child_id}`}>
                      <div className="group flex items-center gap-3 rounded-xl border border-[#b6a77f]/30 bg-[#fff9ef]/80 p-3 transition-colors hover:bg-[#fbf3e3]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#efe2c8] text-xs font-bold text-[#2a4d3e]">
                          {c.child_name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-[#234939]">{c.child_name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <Label>Add Children</Label>
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
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={`Select child ${index + 1}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {allChildren.data?.map((child) => (
                        <SelectItem key={child.member_id} value={String(child.member_id)}>
                          {child.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}

                {memberChild[memberChild.length - 1] !== "" && (
                  <Button
                    variant="outline"
                    className="h-11 w-full gap-2 border-dashed"
                    onClick={() => setMemberChild([...memberChild, ""])}
                  >
                    <Plus className="size-4" />
                    Add Another Child
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="heritage-panel flex flex-col items-center gap-3 px-5 py-10 text-center">
              <div className="rounded-2xl bg-[#efe2c8] p-3 text-primary">
                <Heart className="size-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#274c3c]">Connect a spouse first</h3>
              <p className="max-w-sm text-sm text-[#4f6157]">
                Add a partner relation before assigning children to this member.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MemberDetailsPage;
