// hooks/useRemoveFromFavorites.ts

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

interface RemoveFromFavoritesInterface {
  productId: Id<"products">;
}

type RequestType = RemoveFromFavoritesInterface;
type ResponseType = { success: boolean; message: string } | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const UseRemoveFromFavorites = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);
  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.userDetails.removeFromFavorites);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);
        setData(response);
        setStatus("success");
        options?.onSuccess?.(response);

        return response;
      } catch (error) {
        setStatus("error");
        setError(error as Error);
        options?.onError?.(error as Error);

        if (!options?.throwError) throw error;
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    mutate,
    data,
    error,
    isPending,
    isError,
    isSuccess,
    isSettled,
  };
};
