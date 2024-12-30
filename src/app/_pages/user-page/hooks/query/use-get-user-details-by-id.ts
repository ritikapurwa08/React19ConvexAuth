import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export const UseGetUserDetails = () => {
  const data = useQuery(api.userDetails.getUserDetails);

  return {
    data,
  };
};
