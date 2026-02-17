import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Trash2, User, UserCircle, Heart, Calendar, Droplets } from "lucide-react";
import { motion } from "framer-motion";

const MemberCard = ({ member, onEdit, onDelete, hideOptions }) => {
  const [open, setOpen] = useState(false);
  const [editMember, setEditMember] = useState({
    name: member.name ?? "",
    gender: member.gender ?? "",
    age: member.age ?? "",
    date_of_birth: member.date_of_birth ?? "",
    date_of_death: member.date_of_death ?? "",
    blood_group: member.blood_group ?? "",
  });

  useEffect(() => {
    setEditMember({
      name: member.name ?? "",
      gender: member.gender ?? "",
      age: member.age ?? "",
      date_of_birth: member.date_of_birth ?? "",
      date_of_death: member.date_of_death ?? "",
      blood_group: member.blood_group ?? "",
    });
  }, [member]);

  const handleSave = async () => {
    if (!editMember.name || editMember.name.trim() === "") {
      toast.error("Name cannot be empty");
      return;
    }

    const payload = {};
    for (const [k, v] of Object.entries(editMember)) {
      if (v === null || v === undefined) continue;
      if (typeof v === "string" && v.trim() === "") continue;
      payload[k] = v;
    }

    await onEdit(payload);
    setOpen(false);
  };

  const handleDelete = async () => {
    await onDelete();
    setOpen(false);
  };

  const isMale = member.gender === true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, borderColor: 'hsl(var(--p))' }}
      className="group relative bg-base-100 rounded-[2.5rem] border border-base-content/10 p-6 shadow-xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isMale ? 'from-blue-500/10' : 'from-pink-500/10'} blur-3xl rounded-full -mr-12 -mt-12`} />

      <div className="flex items-center gap-5 relative z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner ${isMale ? 'bg-blue-500/5 border-blue-500/10 text-blue-500' : 'bg-pink-500/5 border-pink-500/10 text-pink-500'}`}>
          <UserCircle className="size-8" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black tracking-tight truncate group-hover:text-primary transition-colors text-base-content">
            {member.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-base-content/10 text-[10px] font-black uppercase tracking-widest text-base-content/60">
              {member.age} Years
            </span>
            {member.blood_group && (
              <div className="flex items-center gap-1 text-[10px] font-black text-error">
                <Droplets className="size-3" />
                <span>{member.blood_group}</span>
              </div>
            )}
          </div>
        </div>

        {!hideOptions && (
          <div onClick={(e) => e.stopPropagation()}>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="size-4 text-base-content/40" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black">Edit Member Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-6 max-h-[70vh] overflow-y-auto px-1">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Full Name</Label>
                    <Input
                      value={editMember.name}
                      autoFocus
                      className="rounded-xl h-12"
                      onChange={(e) => setEditMember(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Gender</Label>
                      <Select
                        value={String(editMember.gender)}
                        onValueChange={(v) => setEditMember(p => ({ ...p, gender: v === "true" }))}
                      >
                        <SelectTrigger className="rounded-xl h-12">
                          <SelectValue />
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
                        value={editMember.age}
                        className="rounded-xl h-12"
                        onChange={(e) => setEditMember(p => ({ ...p, age: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Birth Date (Optional)</Label>
                      <Input
                        type="date"
                        value={editMember.date_of_birth}
                        className="rounded-xl h-12"
                        onChange={(e) => setEditMember(p => ({ ...p, date_of_birth: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Death Date (Optional)</Label>
                      <Input
                        type="date"
                        value={editMember.date_of_death}
                        className="rounded-xl h-12"
                        onChange={(e) => setEditMember(p => ({ ...p, date_of_death: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Blood Group (Optional)</Label>
                    <Input
                      placeholder="e.g. O+"
                      value={editMember.blood_group}
                      className="rounded-xl h-12"
                      onChange={(e) => setEditMember(p => ({ ...p, blood_group: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-3 mt-4">
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-xl text-error hover:bg-error/10"
                    onClick={handleDelete}
                  >
                    <Trash2 className="size-4 mr-2" /> Remove Member
                  </Button>
                  <div className="flex gap-2 flex-1">
                    <DialogClose asChild>
                      <Button variant="outline" className="flex-1 rounded-xl">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave} className="flex-1 rounded-xl shadow-lg shadow-primary/20">
                      Update Details
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MemberCard;
