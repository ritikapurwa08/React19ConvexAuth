// hooks/useIsProductFavorite.ts

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const useIsProductFavorite = (productId: Id<"products">) => {
  const isFavorite = useQuery(api.userDetails.isProductFavorite, {
    productId,
  }); // Pass productId to the query

  return isFavorite;
};
