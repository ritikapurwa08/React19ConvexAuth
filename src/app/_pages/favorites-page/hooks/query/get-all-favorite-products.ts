import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export const GetAllFavoriteProducts = () => {
  const data = useQuery(api.userDetails.getAllFavoriteProducts);

  return {
    data,
  };
};
