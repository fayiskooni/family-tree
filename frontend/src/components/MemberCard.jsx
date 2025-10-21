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
import { Pencil, Trash2 } from "lucide-react";

const MemberCard = ({ member, onEdit, onDelete }) => {
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

    // build payload only with defined, non-empty values to avoid sending "" for booleans
    const payload = {};
    for (const [k, v] of Object.entries(editMember)) {
      if (v === null || v === undefined) continue;
      // skip empty strings to avoid boolean parse errors in DB
      if (typeof v === "string" && v.trim() === "") continue;
      payload[k] = v;
    }

    await onEdit(payload); // parent is bound with id
    setOpen(false);
  };

  const handleDelete = async () => {
    await onDelete(); // parent has the id
    setOpen(false);
  };

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow flex items-center justify-center text-center relative group">
      <div className="card-body p-4 flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-semibold truncate">{member.name}</h3>
          <div className="w-6 h-6 border-2 rounded-full text-xs flex items-center justify-center">
            {member.age}
          </div>

          {/* Hover Edit Icon */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Member</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="editName">Name</Label>
                    <Input
                      id="editName"
                      value={editMember.name}
                      onChange={(e) =>
                        setEditMember((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="editGender">Gender</Label>
                    <Select
                      id="editGender"
                      value={
                        editMember.gender === ""
                          ? ""
                          : String(editMember.gender)
                      }
                      onValueChange={(value) =>
                        setEditMember((prev) => ({
                          ...prev,
                          gender:
                            value === "true"
                              ? true
                              : value === "false"
                              ? false
                              : "",
                        }))
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          <SelectItem value="true">Male</SelectItem>
                          <SelectItem value="false">Female</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="editAge">Age</Label>
                    <Input
                      id="editAge"
                      value={editMember.age}
                      onChange={(e) =>
                        setEditMember((prev) => ({
                          ...prev,
                          age: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="editDateOfBirth">Date of Birth</Label>
                    <Input
                      id="editDateOfBirth"
                      value={editMember.date_of_birth}
                      onChange={(e) =>
                        setEditMember((prev) => ({
                          ...prev,
                          date_of_birth: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="editDateOfDeath">Date of Death</Label>
                    <Input
                      id="editDateOfDeath"
                      value={editMember.date_of_death}
                      onChange={(e) =>
                        setEditMember((prev) => ({
                          ...prev,
                          date_of_death: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="editBloodGroup">Blood Group</Label>
                    <Input
                      id="editBloodGroup"
                      value={editMember.blood_group}
                      onChange={(e) =>
                        setEditMember((prev) => ({
                          ...prev,
                          blood_group: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-between">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
