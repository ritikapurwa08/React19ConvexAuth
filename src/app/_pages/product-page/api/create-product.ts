import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const productZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
});

export type CreateProductType = z.infer<typeof productZodSchema>;

interface SelectOption {
  label: string;
  value: string;
}

interface SelectOption {
  label: string;
  value: string;
}

export const CategoryOptionForSelect: SelectOption[] = [
  {
    label: "Electronics",
    value: "electronics",
  },
  {
    label: "Clothing",
    value: "clothing",
  },
  {
    label: "Home & Kitchen",
    value: "home-kitchen",
  },
  {
    label: "Beauty",
    value: "beauty",
  },
  {
    label: "Books",
    value: "books",
  },
  {
    label: "Toys & Games",
    value: "toys-games",
  },
  {
    label: "Sports & Outdoors",
    value: "sports-outdoors",
  },
  {
    label: "Health & Personal Care",
    value: "health-personal-care",
  },
];

type RequestType = CreateProductType & { imagesStorageIds?: Id<"_storage">[] };
type ResponseType = Id<"products"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const UseCreateProduct = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.products.createProduct);

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

  const form = useForm<CreateProductType>({
    resolver: zodResolver(productZodSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
    },
  });

  return {
    form,
    mutate,
    data,
    error,
    isPending,
    isError,
    isSuccess,
    isSettled,
  };
};
