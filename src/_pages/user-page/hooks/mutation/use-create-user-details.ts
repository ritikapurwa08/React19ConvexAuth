import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const extraDetaisZodObject = z.object({
  addAdditionalName: z.string().min(1, "adn"),
  addAdditionalEmail: z.string().min(1, "adn"),
  firstName: z.string().min(1, "adn"),
  lastName: z.string().min(1, "adn"),
  address: z.string().min(1, "adn"),
  phoneNumber: z.string().min(1, "adn"),
  customProfilePicture: z.string().min(1, "adn"),
});

export const createUserDetailsSchema = z.object({
  extraUserDetais: extraDetaisZodObject,
});

export type createUserDetailsZodType = z.infer<typeof createUserDetailsSchema>;

export interface ExtraUserDetails {
  addAdditionalName?: string;
  addAdditionalEmail?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  customProfilePicture?: string;
}
export interface CreateUserDetailsInterface {
  existingUserId: Id<"users"> | undefined;
  extraUserDetais: ExtraUserDetails;
}

type RequestType = CreateUserDetailsInterface;
type ResponseType = Id<"userDetails"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useCreateUserDetails = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);
  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.userDetails.upsertUserDetails);

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

  const UserDetailsForm = useForm<createUserDetailsZodType>({
    resolver: zodResolver(createUserDetailsSchema),
    defaultValues: {
      extraUserDetais: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        addAdditionalName: "",
        addAdditionalEmail: "",
        customProfilePicture: "",
      },
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
    UserDetailsForm,
  };
};
