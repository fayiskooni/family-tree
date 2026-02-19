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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Trash2, UserCircle, Droplets } from "lucide-react";
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
      whileHover={{ y: -3 }}
      className="group relative h-44 overflow-hidden rounded-[1.6rem] border border-[#b6a77f]/35 bg-[#fffdf7]/88 p-5 shadow-[0_20px_46px_-30px_rgba(20,58,45,0.58)] transition-all duration-500"
    >
      <div
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${
          isMale ? "bg-[#3c7b70]/20" : "bg-[#b37a63]/20"
        }`}
      />

      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
            isMale
              ? "border-[#4c7f74]/25 bg-[#4c7f74]/10 text-[#2f6659]"
              : "border-[#b37a63]/25 bg-[#b37a63]/10 text-[#8d5845]"
          }`}
        >
          <UserCircle className="size-7" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-2xl font-bold tracking-wide text-[#244c3a] transition-colors group-hover:text-primary">
            {member.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded-full bg-[#efe3cd] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#42594e]">
              {member.age} years
            </span>
            {member.blood_group && (
              <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#9f2f20]">
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
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-xl text-[#426555]/70 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#ece1cb]"
                >
                  <Pencil className="size-4" />
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Member Details</DialogTitle>
                </DialogHeader>

                <div className="grid max-h-[70vh] gap-5 overflow-y-auto py-2 pr-1">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={editMember.name}
                      autoFocus
                      className="h-11"
                      onChange={(e) =>
                        setEditMember((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={String(editMember.gender)}
                        onValueChange={(v) =>
                          setEditMember((p) => ({ ...p, gender: v === "true" }))
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
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
                        value={editMember.age}
                        className="h-11"
                        onChange={(e) =>
                          setEditMember((p) => ({ ...p, age: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Birth Date (Optional)</Label>
                      <Input
                        type="date"
                        value={editMember.date_of_birth}
                        className="h-11"
                        onChange={(e) =>
                          setEditMember((p) => ({ ...p, date_of_birth: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Death Date (Optional)</Label>
                      <Input
                        type="date"
                        value={editMember.date_of_death}
                        className="h-11"
                        onChange={(e) =>
                          setEditMember((p) => ({ ...p, date_of_death: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Blood Group (Optional)</Label>
                    <Input
                      placeholder="e.g. O+"
                      value={editMember.blood_group}
                      className="h-11"
                      onChange={(e) =>
                        setEditMember((p) => ({ ...p, blood_group: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <DialogFooter className="mt-3 flex-col gap-3 sm:flex-row">
                  <Button
                    variant="ghost"
                    className="flex-1 text-destructive hover:bg-destructive/10"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 size-4" /> Remove
                  </Button>
                  <div className="flex flex-1 gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button onClick={handleSave} className="flex-1">
                      Update
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
