import React from "react";
import { useQuery } from "@tanstack/react-query";
import MemberCard from "../components/MemberCard";
import NoMembersFound from "../components/NoMembersFound";
import { getUserMembers } from "../lib/api";

const MembersPage = () => {
  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["members"],
    queryFn: getUserMembers,
  });

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
              <MemberCard key={index} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;
