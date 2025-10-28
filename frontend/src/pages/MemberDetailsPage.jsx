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
import { useParams } from "react-router";

import { Label } from "@/components/ui/label";
import PageLoader from "@/components/PageLoader";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MemberDetailsPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

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
  const [memberChild, setMemberChild] = useState([""]); // Initialize with one empty string

  let gender;
  if (memberData?.data?.gender) {
    gender = "Male";
  } else {
    gender = "Female";
  }

  React.useEffect(() => {
    if (spouse?.data && memberData?.data?.gender) {
      const gender = memberData.data.gender;

      if (gender === "Male") {
        setMemberSpouse(spouse.data.wife_id);
      } else if (gender === "Female") {
        setMemberSpouse(spouse.data.husband_id);
      }
    }
  }, [spouse, memberData]);

  const addCoupleMutation = useMutation({
    mutationFn: (data) => createCouple(id, data),
    onSuccess: () => {
      toast.success("Couple Added");
      queryClient.invalidateQueries(["spouse", id]);
    },
  });

  const addChildMutation = useMutation({
    mutationFn: (data) => createChild(id, data),
    onSuccess: () => {
      toast.success("Child Added");
      queryClient.invalidateQueries(["child", id]);
    },
  });

  if (isLoading) return <PageLoader />;

  const handleSave = async () => {
    try {
      if (memberSpouse) {
        await addCoupleMutation.mutateAsync({ partnerId: memberSpouse });
      }

      if (memberChild.length > 0) {
        await addChildMutation.mutateAsync({ children: memberChild });
      }

      // Refresh the data
      await Promise.all([
        queryClient.invalidateQueries(["spouse", id]),
        queryClient.invalidateQueries(["children", id]),
      ]);

      toast.success("Changes saved successfully!");
    } catch (error) {
      toast.error("Failed to save changes", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center">
        {memberData?.data?.name}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        <div>
          <h3>Gender : {gender}</h3>
        </div>
        <div>
          <h3>Age : {memberData?.data?.age}</h3>
        </div>
        <div>
          <h3>Date of Birth : {memberData?.data?.date_of_birth}</h3>
        </div>
        <div>
          <h3>Date of Death : {memberData?.data?.date_of_death}</h3>
        </div>
        <div>
          <h3>Blood Group : : {memberData?.data?.blood_group}</h3>
        </div>
      </div>
      <hr className="border-gray-300" />
      <h2 className="text-xl font-semibold mb-2">Member Relations</h2>
      <div>
        <div>
          <Label>{gender === "Male" ? "Wife" : "Husband"}</Label>
          {spouse?.data?.name ? (
            <div className="text-sm mt-1 p-2 border rounded bg-muted">
              {spouse?.data?.name}
            </div>
          ) : (
            <Select value={memberSpouse} onValueChange={setMemberSpouse}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={`Select ${
                    gender === "Male" ? "Wife" : "Husband"
                  }`}
                />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    {gender === "Male" ? "Wife" : "Husband"}
                  </SelectLabel>

                  {gender === "Male"
                    ? unmarriedFemales.data?.map((female) => (
                        <SelectItem
                          key={female.member_id}
                          value={female.member_id}
                        >
                          {female.name}
                        </SelectItem>
                      ))
                    : unmarriedMales.data?.map((male) => (
                        <SelectItem key={male.member_id} value={male.member_id}>
                          {male.name}
                        </SelectItem>
                      ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <Label>Children</Label>
          {children?.data?.length > 0 && (
            <div className="space-y-2 mb-4">
              {children.data.map((child) => (
                <div
                  key={child.child_id}
                  className="text-sm p-2 border rounded bg-muted"
                >
                  {child.child_name}
                </div>
              ))}
            </div>
          )}

          {memberChild.map((childId, index) => (
            <Select
              key={index}
              value={childId}
              onValueChange={(value) => {
                const newChildren = [...memberChild];
                newChildren[index] = value;
                setMemberChild(newChildren);
              }}
            >
              <SelectTrigger className="w-[180px] mb-2">
                <SelectValue placeholder={`Select Child ${index + 1}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Children</SelectLabel>
                  {allChildren.data?.map((child) => (
                    <SelectItem key={child.member_id} value={child.member_id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ))}
          {memberChild[memberChild.length - 1] !== "" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMemberChild([...memberChild, ""])}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Another Child
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-center pt-6">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default MemberDetailsPage;
