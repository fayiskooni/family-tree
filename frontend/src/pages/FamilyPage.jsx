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
import { Pencil, UserMinus } from "lucide-react";

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

  // Handle adding member to family
  const handleAddMember = async (memberId) => {
    try {
      await createFamilyMember(id, { member_id: memberId });
      toast.success("Family member added successfully!");

      // Refresh both lists
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["members", id] }),
        queryClient.invalidateQueries({ queryKey: ["recommendedMembers", id] }),
      ]);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  // Handle removing member from family
  const handleRemoveMember = async (memberId) => {
    try {
      await deleteFamilyMember(id, memberId);

      // Refresh both lists
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["members", id] }),
        queryClient.invalidateQueries({ queryKey: ["recommendedMembers", id] }),
      ]);

      toast.success("Member removed from family successfully!");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  if (isLoading) return <PageLoader />;

  // Common Add Dialog component
  const AddDialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <AddCard />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Family Members</DialogTitle>
        </DialogHeader>

        {loadingRecommendedMembers ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : (
          <ScrollArea className="h-72 w-64 rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">Members</h4>
              {recommendedMembers.data?.length > 0 ? (
                recommendedMembers.data.map((recommendedMember) => (
                  <React.Fragment key={recommendedMember.member_id}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{recommendedMember.name}</span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          handleAddMember(recommendedMember.member_id)
                        }
                      >
                        Add
                      </Button>
                    </div>
                    <Separator className="my-2" />
                  </React.Fragment>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recommended members available.
                </p>
              )}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Edit Members Dialog component
  const EditMembersDialog = (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Family Members</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-72 w-64 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Current Members
            </h4>
            {members.data?.length > 0 ? (
              members.data.map((member) => (
                <React.Fragment key={member.member_id}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{member.name}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMember(member.member_id);
                      }}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator className="my-2" />
                </React.Fragment>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No members in this family.
              </p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {family?.data?.family_name}
            </h2>
            {EditMembersDialog}
          </div>
        </div>

        {loadingMembers ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : members.data.length === 0 ? (
          //  Show NoMembersFound + AddDialog
          <div>
            <NoMembersFound />
            <br />
            {AddDialog}
          </div>
        ) : (
          //  Show member cards + AddDialog
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {members.data.map((member, index) => (
              <Link
                key={member.member_id ?? index}
                to={`/member/${member.member_id}`}
              >
                <MemberCard
                  key={member.member_id}
                  member={member}
                  hideOptions={true}
                />
              </Link>
            ))}
            {AddDialog}
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyPage;
