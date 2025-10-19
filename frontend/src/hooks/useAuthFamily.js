import { getAuthFamily } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useAuthFamily = () => {
  const authFamily = useQuery({
    queryKey: ["authFamily"],
    queryFn: getAuthFamily,
    retry: false, // auth check
  });
  return { isLoading: authFamily.isLoading, authFamily: authFamily.data?.user };
};

export default useAuthFamily;