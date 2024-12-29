import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export const UseGetAllProducts = () => {
  const results = useQuery(api.products.getAllProducts);
  const isLoading = results === undefined;
  return {
    results,
    isLoading,
  };
};
