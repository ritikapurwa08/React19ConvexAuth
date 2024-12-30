import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod schema for the extraUserDetails object - Adjust as needed based on optional fields
const extraUserDetailsZodObject = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  addAdditionalName: z.string().optional(),
  addAdditionalEmail: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(), // Changed to string for StorageId
  customProfilePicture: z.string().optional(),
});

// Zod schema for the updateUserDetails request
const updateUserDetailsSchema = z.object({
  userDetailsId: z.string(), // Assuming ID is passed as a string
  extraUserDetails: extraUserDetailsZodObject,
});

// TypeScript type for the Zod schema
export type UpdateUserDetailsZodType = z.infer<typeof updateUserDetailsSchema>;

// Interface for the extraUserDetails object - You can reuse this
export interface ExtraUserDetails {
  name?: string;
  email?: string;
  addAdditionalName?: string;
  addAdditionalEmail?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  customProfilePicture?: string;
}

// Interface for the request to updateUserDetails
export interface UpdateUserDetailsInterface {
  userDetailsId: Id<"userDetails">;
  extraUserDetails: ExtraUserDetails;
}

// Type aliases for clarity
type RequestType = UpdateUserDetailsInterface;
type ResponseType = Id<"userDetails">; // Assuming the mutation returns the updated ID

// Options for callbacks (onSuccess, onError, onSettled)
type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean; // Option to control whether to rethrow the error
};

// The useUpdateUserDetails hook
export const useUpdateUserDetails = () => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);
  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.userDetails.updateUserDetails); // Use your update mutation

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);
        setData(response); // Set the returned userDetailsId
        setStatus("success");
        options?.onSuccess?.(response);

        return response;
      } catch (error) {
        setStatus("error");
        setError(error as Error);
        options?.onError?.(error as Error);

        if (options?.throwError) throw error;
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  // React Hook Form setup
  const UpdateUserDetailsForm = useForm<UpdateUserDetailsZodType>({
    resolver: zodResolver(updateUserDetailsSchema),
    defaultValues: {
      extraUserDetails: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        addAdditionalName: "",
        addAdditionalEmail: "",
        customProfilePicture: "",
      },
    },
    // You might want to set defaultValues based on existing user data if you're editing
  });

  return {
    mutate,
    data,
    error,
    isPending,
    isError,
    isSuccess,
    isSettled,
    UpdateUserDetailsForm,
  };
};
