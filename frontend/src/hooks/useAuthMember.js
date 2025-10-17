import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAuthMember } from "../lib/api";

const useAuthMember = () => {
  const authMember = useQuery({
    queryKey: ["authMember"],
    queryFn: getAuthMember,
    retry: false, // auth check
  });
  return { isLoading: authMember.isLoading, authMember: authMember.data?.user };
};

export default useAuthMember;
