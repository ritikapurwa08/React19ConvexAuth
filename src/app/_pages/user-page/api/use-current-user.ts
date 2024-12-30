import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export const UseGetCurrentUser = () => {
  const user = useQuery(api.users.getCurrentUser);

  return {
    user,
  };
};
