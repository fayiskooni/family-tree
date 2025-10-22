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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    date_of_birth: null,
    date_of_death: null,
    blood_group: null,
  });
  const [open, setOpen] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await createAuthMember({ member });
      if (response?.message) {
        toast(response.message);
      } else {
        toast.success("Member added successfully!");
      }
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      setMember("");
      setOpen(false);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };
  const handleEdit = async (id, member) => {
    console.log(id);

    try {
      await updateMember({ id, member });
      toast.success("Member updated!");
      await queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update member");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMember({ id });
      toast.success("Member deleted!");
      await queryClient.invalidateQueries({ queryKey: ["members"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete member");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Family Members
          </h2>
        </div>

        {loadingMembers ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : members.length === 0 ? (
          <NoMembersFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {members.data.map((member, index) => (
            
                <MemberCard
                  key={member.member_id ?? index}
                  member={member}
                  onEdit={(updated) => handleEdit(member.member_id, updated)}
                  onDelete={() => handleDelete(member.member_id)}
                />
            ))}
            <Dialog open={open} onOpenChange={setOpen}>
              <form>
                <DialogTrigger>
                  <AddCard />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Member Details</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="memberName">Name</Label>
                      <Input
                        name="memberName"
                        value={member.name}
                        onChange={(e) =>
                          setMember({ ...member, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="memberGender">Gender</Label>
                      <Select
                        value={member.gender}
                        onValueChange={(value) =>
                          setMember({ ...member, gender: value })
                        }
                        required
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
                      <Label htmlFor="memberAge">Age</Label>
                      <Input
                        name="memberAge"
                        value={member.age}
                        onChange={(e) =>
                          setMember({ ...member, age: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="memberDateOfBirth">Date of Birth</Label>
                      <Input
                        name="memberDateOfBirth"
                        value={member.date_of_birth}
                        onChange={(e) =>
                          setMember({
                            ...member,
                            date_of_birth: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="memberDateOfDeath">Date of Death</Label>
                      <Input
                        name="memberDateOfDeath"
                        value={member.date_of_death}
                        onChange={(e) =>
                          setMember({
                            ...member,
                            date_of_death: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="memberBloodGroup">Blood Group</Label>
                      <Input
                        name="memberBloodGroup"
                        value={member.blood_group}
                        onChange={(e) =>
                          setMember({ ...member, blood_group: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleClick} type="submit">
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;
