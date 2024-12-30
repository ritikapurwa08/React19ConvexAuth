import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface UseGetProductByIdProps {
  id: Id<"products">;
}

export const UseGetProductById = ({ id }: UseGetProductByIdProps) => {
  const product = useQuery(api.products.getProductById, { id });

  return {
    product,
  };
};
