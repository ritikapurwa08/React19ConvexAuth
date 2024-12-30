// api/products/update-product.ts
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const productZodSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(1),
  category: z.string().min(1),
  imagesStorageIds: z.array(z.string()).optional(),
});

export type productZodType = z.infer<typeof productZodSchema>;

export type productType = {
  id: Id<"products">;
  name: string;
  description: string;
  price: number;
  category: string;
  imagesStorageIds?: Id<"_storage">[];
};

type RequestType = productType;
type ResponseType = Id<"products"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const UseUpdateProduct = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.products.updateProduct);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);
        if (!options?.throwError) throw error;
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  const productZodForm = useForm<productZodType>({
    resolver: zodResolver(productZodSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      imagesStorageIds: [],
    },
  });

  return {
    mutate,
    data,
    error,
    isPending,
    isError,
    isSuccess,
    isSettled,
    productZodForm,
  };
};
